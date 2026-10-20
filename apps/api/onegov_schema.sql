CREATE TYPE "Role" AS ENUM ('citizen', 'officer', 'reviewer', 'admin');
CREATE TYPE "ApplicationStatus" AS ENUM ('submitted', 'in_review', 'needs_info', 'approved', 'rejected', 'completed');
CREATE TYPE "PaymentStatus" AS ENUM ('pending', 'paid', 'failed', 'refunded');

CREATE TABLE "User" (
  id TEXT PRIMARY KEY,
  "faydaId" TEXT UNIQUE,
  fin TEXT UNIQUE,
  "fullName" TEXT NOT NULL,
  email TEXT UNIQUE,
  phone TEXT,
  role "Role" NOT NULL DEFAULT 'citizen',
  locale TEXT NOT NULL DEFAULT 'en',
  verified BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL
);

CREATE TABLE "ServiceCategory" (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  "nameJson" JSONB NOT NULL,
  icon TEXT
);

CREATE TABLE "Service" (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  "categoryId" TEXT NOT NULL REFERENCES "ServiceCategory"(id),
  "nameJson" JSONB NOT NULL,
  "descriptionJson" JSONB NOT NULL,
  fee DECIMAL(12,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'ETB',
  "processingDays" INTEGER NOT NULL DEFAULT 5,
  "requiredDocuments" JSONB NOT NULL,
  "formSchemaJson" JSONB NOT NULL,
  active BOOLEAN NOT NULL DEFAULT true
);

CREATE TABLE "Application" (
  id TEXT PRIMARY KEY,
  "trackingNumber" TEXT NOT NULL UNIQUE,
  "userId" TEXT NOT NULL REFERENCES "User"(id),
  "serviceId" TEXT NOT NULL REFERENCES "Service"(id),
  status "ApplicationStatus" NOT NULL DEFAULT 'submitted',
  "formDataJson" JSONB NOT NULL,
  "feePaid" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL
);

CREATE TABLE "Document" (
  id TEXT PRIMARY KEY,
  "applicationId" TEXT NOT NULL REFERENCES "Application"(id) ON DELETE CASCADE,
  filename TEXT NOT NULL,
  "mimeType" TEXT NOT NULL,
  size INTEGER NOT NULL,
  url TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "Payment" (
  id TEXT PRIMARY KEY,
  "applicationId" TEXT NOT NULL REFERENCES "Application"(id),
  amount DECIMAL(12,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'ETB',
  status "PaymentStatus" NOT NULL DEFAULT 'pending',
  provider TEXT NOT NULL,
  "providerRef" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "AuditLog" (
  id TEXT PRIMARY KEY,
  "actorId" TEXT REFERENCES "User"(id),
  action TEXT NOT NULL,
  entity TEXT NOT NULL,
  "entityId" TEXT,
  ip TEXT,
  metadata JSONB,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
