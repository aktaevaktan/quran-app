-- CreateTable
CREATE TABLE "TasbihCount" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "date" TEXT NOT NULL,
    "subhanallah" INTEGER NOT NULL DEFAULT 0,
    "alhamdulillah" INTEGER NOT NULL DEFAULT 0,
    "allahuakbar" INTEGER NOT NULL DEFAULT 0,
    "lailaha" INTEGER NOT NULL DEFAULT 0,
    "astaghfirullah" INTEGER NOT NULL DEFAULT 0,
    "salawat" INTEGER NOT NULL DEFAULT 0,
    "totalCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "TasbihCount_date_key" ON "TasbihCount"("date");
