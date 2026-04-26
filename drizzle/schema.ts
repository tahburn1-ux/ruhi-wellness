import {
  int,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  varchar,
  decimal,
  boolean,
  json,
} from "drizzle-orm/mysql-core";

// ── Users (auth) ──────────────────────────────────────────────────────────────
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// ── Services / Drips ──────────────────────────────────────────────────────────
export const services = mysqlTable("services", {
  id: int("id").autoincrement().primaryKey(),
  slug: varchar("slug", { length: 128 }).notNull().unique(),
  name: varchar("name", { length: 128 }).notNull(),
  tagline: varchar("tagline", { length: 255 }),
  category: varchar("category", { length: 64 }).notNull().default("Wellness"),
  tag: varchar("tag", { length: 64 }),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  duration: varchar("duration", { length: 64 }).default("45 Min Session"),
  description: text("description"),
  ingredients: json("ingredients").$type<string[]>().default([]),
  benefits: json("benefits").$type<string[]>().default([]),
  idealFor: json("idealFor").$type<string[]>().default([]),
  icon: varchar("icon", { length: 8 }).default("💧"),
  isActive: boolean("isActive").default(true).notNull(),
  sortOrder: int("sortOrder").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Service = typeof services.$inferSelect;
export type InsertService = typeof services.$inferInsert;

// ── Bookings ──────────────────────────────────────────────────────────────────
export const bookings = mysqlTable("bookings", {
  id: int("id").autoincrement().primaryKey(),
  reference: varchar("reference", { length: 32 }).notNull().unique(),
  serviceId: int("serviceId"),
  serviceName: varchar("serviceName", { length: 128 }).notNull(),
  servicePrice: decimal("servicePrice", { precision: 10, scale: 2 }).notNull(),
  bookingDate: varchar("bookingDate", { length: 32 }).notNull(),
  bookingTime: varchar("bookingTime", { length: 32 }).notNull(),
  status: mysqlEnum("status", ["pending", "confirmed", "completed", "cancelled"]).default("pending").notNull(),
  fullName: varchar("fullName", { length: 128 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  phone: varchar("phone", { length: 32 }).notNull(),
  dob: varchar("dob", { length: 32 }),
  deliveryAddress: text("deliveryAddress"),
  consentData: json("consentData").$type<Record<string, boolean>>().default({}),
  medicalHistory: json("medicalHistory").$type<Array<{ condition: string; yes: boolean | null; details: string }>>().default([]),
  medications: json("medications").$type<Array<{ name: string; dose: string; frequency: string; reason: string }>>().default([]),
  ivntHistory: json("ivntHistory").$type<Record<string, string | boolean | null>>().default({}),
  wellbeing: json("wellbeing").$type<Array<{ symptom: string; yes: boolean | null; notes: string }>>().default([]),
  adminNotes: text("adminNotes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Booking = typeof bookings.$inferSelect;
export type InsertBooking = typeof bookings.$inferInsert;

// ── Testimonials ──────────────────────────────────────────────────────────────
export const testimonials = mysqlTable("testimonials", {
  id: int("id").autoincrement().primaryKey(),
  clientName: varchar("clientName", { length: 128 }).notNull(),
  initials: varchar("initials", { length: 4 }),
  rating: int("rating").default(5),
  text: text("text").notNull(),
  serviceName: varchar("serviceName", { length: 128 }),
  isActive: boolean("isActive").default(true).notNull(),
  sortOrder: int("sortOrder").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Testimonial = typeof testimonials.$inferSelect;
export type InsertTestimonial = typeof testimonials.$inferInsert;

// ── Site Settings (key-value) ─────────────────────────────────────────────────
export const siteSettings = mysqlTable("siteSettings", {
  key: varchar("key", { length: 128 }).primaryKey(),
  value: text("value").notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type SiteSetting = typeof siteSettings.$inferSelect;

// ── Contact Messages ──────────────────────────────────────────────────────────
export const contactMessages = mysqlTable("contactMessages", {
  id: int("id").autoincrement().primaryKey(),
  fullName: varchar("fullName", { length: 128 }).notNull(),
  email: varchar("email", { length: 320 }),
  inquiry: text("inquiry").notNull(),
  status: mysqlEnum("status", ["unread", "read", "replied"]).default("unread").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ContactMessage = typeof contactMessages.$inferSelect;

// ── Admin Credentials (local login) ──────────────────────────────────────────
export const adminCredentials = mysqlTable("adminCredentials", {
  id: int("id").autoincrement().primaryKey(),
  username: varchar("username", { length: 64 }).notNull().unique(),
  passwordHash: varchar("passwordHash", { length: 255 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type AdminCredential = typeof adminCredentials.$inferSelect;
export type InsertAdminCredential = typeof adminCredentials.$inferInsert;