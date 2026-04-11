const { Client } = require('pg');

const connectionString = "postgresql://neondb_owner:npg_bzqIQk0A6yaR@ep-wispy-flower-amkgasfu.c-5.us-east-1.aws.neon.tech/neondb?sslmode=require";

async function setup() {
  const client = new Client({ connectionString });
  try {
    await client.connect();
    console.log("Connected to database. Creating tables...");

    await client.query(`
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

    await client.query(`
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

    console.log("Tables created successfully.");
  } catch (err) {
    console.error("Error creating tables:", err);
  } finally {
    await client.end();
  }
}

setup();
