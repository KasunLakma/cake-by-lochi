-- CreateTable
CREATE TABLE "EventBooking" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "eventTitle" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "eventDate" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "seats" INTEGER NOT NULL DEFAULT 1,
    "intakeNotes" TEXT,
    "ticketCode" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "EventBooking_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
