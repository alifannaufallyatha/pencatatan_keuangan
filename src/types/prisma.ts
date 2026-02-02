// Re-export Prisma types for client components
// This file only exports types, not the Prisma client itself
import type { Transaction, Wallet } from "@prisma/client";
import { TransactionType } from "@prisma/client";

export type { Transaction, Wallet };
export { TransactionType };
