import { eq, desc, asc, like, or, and, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  users, services, bookings, testimonials, siteSettings, contactMessages,
  type InsertUser, type InsertService, type InsertBooking, type InsertTestimonial,
} from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try { _db = drizzle(process.env.DATABASE_URL); } catch (e) { console.warn("[DB] connect failed:", e); }
  }
  return _db;
}

function genRef() {
  return "RW-" + Date.now().toString(36).toUpperCase() + Math.random().toString(36).slice(2, 5).toUpperCase();
}

// ── Users ─────────────────────────────────────────────────────────────────────
export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required");
  const db = await getDb(); if (!db) return;
  const values: InsertUser = { openId: user.openId };
  const updateSet: Record<string, unknown> = {};
  (["name", "email", "loginMethod"] as const).forEach((f) => {
    if (user[f] === undefined) return;
    values[f] = user[f] ?? null; updateSet[f] = user[f] ?? null;
  });
  values.lastSignedIn = user.lastSignedIn ?? new Date();
  updateSet.lastSignedIn = values.lastSignedIn;
  if (user.role !== undefined) { values.role = user.role; updateSet.role = user.role; }
  else if (user.openId === ENV.ownerOpenId) { values.role = "admin"; updateSet.role = "admin"; }
  await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb(); if (!db) return undefined;
  const r = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return r[0];
}

// ── Services ──────────────────────────────────────────────────────────────────
export async function getActiveServices() {
  const db = await getDb(); if (!db) return [];
  return db.select().from(services).where(eq(services.isActive, true)).orderBy(asc(services.sortOrder));
}
export async function getAllServices() {
  const db = await getDb(); if (!db) return [];
  return db.select().from(services).orderBy(asc(services.sortOrder));
}
export async function getServiceBySlug(slug: string) {
  const db = await getDb(); if (!db) return null;
  const r = await db.select().from(services).where(eq(services.slug, slug)).limit(1);
  return r[0] ?? null;
}
export async function getServiceById(id: number) {
  const db = await getDb(); if (!db) return null;
  const r = await db.select().from(services).where(eq(services.id, id)).limit(1);
  return r[0] ?? null;
}
export async function createService(data: InsertService) {
  const db = await getDb(); if (!db) throw new Error("DB unavailable");
  const r: any = await db.insert(services).values(data);
  return getServiceById(r[0]?.insertId ?? 0);
}
export async function updateService(id: number, data: Partial<InsertService>) {
  const db = await getDb(); if (!db) throw new Error("DB unavailable");
  await db.update(services).set(data).where(eq(services.id, id));
  return getServiceById(id);
}
export async function deleteService(id: number) {
  const db = await getDb(); if (!db) throw new Error("DB unavailable");
  await db.delete(services).where(eq(services.id, id));
}

// ── Bookings ──────────────────────────────────────────────────────────────────
export async function createBooking(data: Omit<InsertBooking, "reference">) {
  const db = await getDb(); if (!db) throw new Error("DB unavailable");
  const reference = genRef();
  await db.insert(bookings).values({ ...data, reference } as any);
  const r = await db.select().from(bookings).where(eq(bookings.reference, reference)).limit(1);
  return r[0];
}
export async function getBookings(opts: { status?: string; search?: string; limit?: number; offset?: number }) {
  const db = await getDb(); if (!db) return { rows: [], total: 0 };
  const conds: any[] = [];
  if (opts.status && opts.status !== "all") conds.push(eq(bookings.status, opts.status as any));
  if (opts.search) conds.push(or(like(bookings.fullName, `%${opts.search}%`), like(bookings.email, `%${opts.search}%`), like(bookings.reference, `%${opts.search}%`)));
  const where = conds.length > 0 ? and(...conds) : undefined;
  const rows = await db.select().from(bookings).where(where).orderBy(desc(bookings.createdAt)).limit(opts.limit ?? 20).offset(opts.offset ?? 0);
  const [{ count }] = await db.select({ count: sql<number>`count(*)` }).from(bookings).where(where);
  return { rows, total: Number(count) };
}
export async function getBookingById(id: number) {
  const db = await getDb(); if (!db) return null;
  const r = await db.select().from(bookings).where(eq(bookings.id, id)).limit(1);
  return r[0] ?? null;
}
export async function updateBookingStatus(id: number, status: string, adminNotes?: string) {
  const db = await getDb(); if (!db) throw new Error("DB unavailable");
  const upd: any = { status };
  if (adminNotes !== undefined) upd.adminNotes = adminNotes;
  await db.update(bookings).set(upd).where(eq(bookings.id, id));
  return getBookingById(id);
}
export async function deleteBooking(id: number) {
  const db = await getDb(); if (!db) throw new Error("DB unavailable");
  await db.delete(bookings).where(eq(bookings.id, id));
}
export async function getBookingStats() {
  const db = await getDb();
  if (!db) return { total: 0, pending: 0, confirmed: 0, completed: 0, revenue: 0, recent: [] };
  const [t] = await db.select({
    total: sql<number>`count(*)`,
    pending: sql<number>`sum(case when status='pending' then 1 else 0 end)`,
    confirmed: sql<number>`sum(case when status='confirmed' then 1 else 0 end)`,
    completed: sql<number>`sum(case when status='completed' then 1 else 0 end)`,
    revenue: sql<number>`sum(case when status in ('confirmed','completed') then servicePrice else 0 end)`,
  }).from(bookings);
  const recent = await db.select().from(bookings).orderBy(desc(bookings.createdAt)).limit(5);
  return { total: Number(t.total), pending: Number(t.pending), confirmed: Number(t.confirmed), completed: Number(t.completed), revenue: Number(t.revenue), recent };
}

// ── Testimonials ──────────────────────────────────────────────────────────────
export async function getActiveTestimonials() {
  const db = await getDb(); if (!db) return [];
  return db.select().from(testimonials).where(eq(testimonials.isActive, true)).orderBy(asc(testimonials.sortOrder));
}
export async function getAllTestimonials() {
  const db = await getDb(); if (!db) return [];
  return db.select().from(testimonials).orderBy(asc(testimonials.sortOrder));
}
export async function createTestimonial(data: InsertTestimonial) {
  const db = await getDb(); if (!db) throw new Error("DB unavailable");
  const r: any = await db.insert(testimonials).values(data);
  const rows = await db.select().from(testimonials).where(eq(testimonials.id, r[0]?.insertId ?? 0)).limit(1);
  return rows[0];
}
export async function updateTestimonial(id: number, data: Partial<InsertTestimonial>) {
  const db = await getDb(); if (!db) throw new Error("DB unavailable");
  await db.update(testimonials).set(data).where(eq(testimonials.id, id));
  const r = await db.select().from(testimonials).where(eq(testimonials.id, id)).limit(1);
  return r[0];
}
export async function deleteTestimonial(id: number) {
  const db = await getDb(); if (!db) throw new Error("DB unavailable");
  await db.delete(testimonials).where(eq(testimonials.id, id));
}

// ── Site Settings ─────────────────────────────────────────────────────────────
export async function getAllSettings() {
  const db = await getDb(); if (!db) return {} as Record<string, string>;
  const rows = await db.select().from(siteSettings);
  return Object.fromEntries(rows.map((r) => [r.key, r.value])) as Record<string, string>;
}
export async function upsertSettings(updates: Record<string, string>) {
  const db = await getDb(); if (!db) throw new Error("DB unavailable");
  for (const [key, value] of Object.entries(updates)) {
    await db.insert(siteSettings).values({ key, value }).onDuplicateKeyUpdate({ set: { value } });
  }
}

// ── Contact Messages ──────────────────────────────────────────────────────────
export async function createContactMessage(data: { fullName: string; email?: string | null; inquiry: string }) {
  const db = await getDb(); if (!db) throw new Error("DB unavailable");
  await db.insert(contactMessages).values(data as any);
}
export async function getContactMessages() {
  const db = await getDb(); if (!db) return [];
  return db.select().from(contactMessages).orderBy(desc(contactMessages.createdAt));
}
export async function updateContactMessageStatus(id: number, status: "unread" | "read" | "replied") {
  const db = await getDb(); if (!db) throw new Error("DB unavailable");
  await db.update(contactMessages).set({ status }).where(eq(contactMessages.id, id));
}
export async function deleteContactMessage(id: number) {
  const db = await getDb(); if (!db) throw new Error("DB unavailable");
  await db.delete(contactMessages).where(eq(contactMessages.id, id));
}
