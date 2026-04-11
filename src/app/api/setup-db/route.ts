import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    console.log("Creating tables manually...");
    
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "GameDrop" (
          "id" TEXT NOT NULL,
          "type" TEXT NOT NULL,
          "title" TEXT NOT NULL,
          "prizeDescription" TEXT NOT NULL,
          "startPrice" DOUBLE PRECISION NOT NULL,
          "currentPrice" DOUBLE PRECISION NOT NULL,
          "minPrice" DOUBLE PRECISION NOT NULL,
          "dropAmount" DOUBLE PRECISION NOT NULL,
          "dropIntervalSeconds" INTEGER NOT NULL,
          "startTime" TIMESTAMP(3) NOT NULL,
          "status" TEXT NOT NULL DEFAULT 'WAITING',
          "winnerId" TEXT,
          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          CONSTRAINT "GameDrop_pkey" PRIMARY KEY ("id")
      );
    `);
    
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "InventoryItem" (
          "id" TEXT NOT NULL,
          "userId" TEXT NOT NULL,
          "name" TEXT NOT NULL,
          "description" TEXT,
          "type" TEXT NOT NULL DEFAULT 'PRIZE',
          "isUsed" BOOLEAN NOT NULL DEFAULT false,
          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          CONSTRAINT "InventoryItem_pkey" PRIMARY KEY ("id")
      );
    `);

    // ADD MISSING COLUMNS IF THEY DON'T EXIST
    try {
      await prisma.$executeRawUnsafe(`ALTER TABLE "InventoryItem" ADD COLUMN IF NOT EXISTS "serviceId" INTEGER;`);
      await prisma.$executeRawUnsafe(`ALTER TABLE "InventoryItem" ADD COLUMN IF NOT EXISTS "quantity" INTEGER;`);
    } catch(e: any) {
      console.log("Columns might already exist:", e.message);
    }

    // Add foreign keys constraints
    try {
      await prisma.$executeRawUnsafe(`ALTER TABLE "GameDrop" ADD CONSTRAINT "GameDrop_winnerId_fkey" FOREIGN KEY ("winnerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;`);
      await prisma.$executeRawUnsafe(`ALTER TABLE "InventoryItem" ADD CONSTRAINT "InventoryItem_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;`);
    } catch(e: any) {
      console.log("FKs might already exist or issue:", e.message);
    }

    return NextResponse.json({ success: true, message: "Tables created successfully" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
