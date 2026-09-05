import { PrismaClient } from '@prisma/client';
import { SEED_STOCKS } from '../src/modules/market-data/simulator.service.js';

const prisma = new PrismaClient();

async function main() {
  console.log('[Seed] Populating database...');

  // Create demo user
  const user = await prisma.user.upsert({
    where: { email: 'demo@pulsewatch.dev' },
    update: {},
    create: {
      id: 'demo-user-id-groww-2026',
      email: 'demo@pulsewatch.dev',
      name: 'Groww Demo Investor',
      passwordHash: '$2a$10$e8w67w8y9q1w2e3r4t5y6u7i8o9p0a1b2c3d4e5f6g7h8i9j0k1l2', // dummy hash
    },
  });

  console.log(`[Seed] Created User: ${user.name}`);

  // Create stocks
  for (const s of SEED_STOCKS) {
    await prisma.stock.upsert({
      where: { symbol: s.symbol },
      update: {},
      create: {
        symbol: s.symbol,
        name: s.name,
        sector: s.sector,
        marketCap: s.marketCap,
        fiftyTwoHigh: s.fiftyTwoHigh,
        fiftyTwoLow: s.fiftyTwoLow,
      },
    });
  }

  console.log(`[Seed] Created ${SEED_STOCKS.length} Stocks`);

  // Create default watchlist
  const watchlist = await prisma.watchlist.upsert({
    where: { id: 'wl-default-1' },
    update: {},
    create: {
      id: 'wl-default-1',
      userId: user.id,
      name: 'My Watchlist',
      description: 'Core Groww portfolio watchlist',
      isDefault: true,
    },
  });

  console.log(`[Seed] Created Watchlist: ${watchlist.name}`);
}

main()
  .catch((e) => {
    console.error('[Seed Error]', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
