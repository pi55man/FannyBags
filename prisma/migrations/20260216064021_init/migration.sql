-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "avatar" TEXT,
    "location" TEXT,
    "badges" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Wallet" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "availableBalance" REAL NOT NULL DEFAULT 0,
    "pendingPayouts" REAL NOT NULL DEFAULT 0,
    "lifetimeEarnings" REAL NOT NULL DEFAULT 0,
    "userId" TEXT NOT NULL,
    CONSTRAINT "Wallet_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Transaction" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "amount" REAL NOT NULL,
    "type" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "walletId" TEXT NOT NULL,
    CONSTRAINT "Transaction_walletId_fkey" FOREIGN KEY ("walletId") REFERENCES "Wallet" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Song" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "artistId" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "khapeetarStatus" TEXT NOT NULL,
    "khapeetarName" TEXT,
    "fundsRaised" REAL NOT NULL DEFAULT 0,
    "fundingSource" TEXT NOT NULL DEFAULT 'Fan',
    "releaseStatus" TEXT,
    "streams" INTEGER NOT NULL DEFAULT 0,
    "revenue" REAL NOT NULL DEFAULT 0,
    "paidOut" REAL NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Song_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Wallet_userId_key" ON "Wallet"("userId");
