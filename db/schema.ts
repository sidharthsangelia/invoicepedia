import { integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { AVAILABLE_STATUSES } from "@/data/invoices";

// Optional: If you're still using Status types in TS
export type Status = (typeof AVAILABLE_STATUSES)[number]["id"];

// 🟢 Step 1: Define Customers first
export const Customers = pgTable("customers", {
  id: integer("id")
    .primaryKey()
    .notNull()
    .default(sql`nextval('invoices_id_seq')`),
  createTs: timestamp("createTs").defaultNow().notNull(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  userId: text("userId").notNull(),
  organizationId: text("organizationId"),
});

// 🟢 Step 2: Now define Invoices
export const Invoices = pgTable("invoices", {
  id: integer("id")
    .primaryKey()
    .notNull()
    .default(sql`nextval('invoices_id_seq')`),
  createTs: timestamp("createTs").defaultNow().notNull(),
  value: integer("value").notNull(),
  description: text("description").notNull(),
  userId: text("userId").notNull(),
  organizationId: text("organizationId"),
  customerId: integer("customerId")
    .notNull()
    .references(() => Customers.id), // Now this will work
  status: text("status").notNull(),
});
