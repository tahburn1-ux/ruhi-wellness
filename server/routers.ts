import { TRPCError } from "@trpc/server";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import {
  getActiveServices, getAllServices, getServiceBySlug,
  createService, updateService, deleteService,
  createBooking, getBookings, getBookingById, updateBookingStatus, deleteBooking, getBookingStats,
  getActiveTestimonials, getAllTestimonials, createTestimonial, updateTestimonial, deleteTestimonial,
  getAllSettings, upsertSettings,
  createContactMessage, getContactMessages, updateContactMessageStatus, deleteContactMessage,
  getAdminByUsername,
} from "./db";
import { storagePut } from "./storage";
import { notifyOwner } from "./_core/notification";
import { z } from "zod";
import * as crypto from "crypto";
import { SignJWT, jwtVerify } from "jose";
import { parse as parseCookies } from "cookie";

const ADMIN_SESSION_COOKIE = "rw_admin_session";
const ADMIN_JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "ruhi-wellness-admin-secret-key-2024"
);

async function verifyAdminPassword(password: string, storedHash: string): Promise<boolean> {
  const [salt, hash] = storedHash.split(":");
  if (!salt || !hash) return false;
  return new Promise((resolve) => {
    crypto.pbkdf2(password, salt, 100000, 64, "sha512", (err, derivedKey) => {
      if (err) { resolve(false); return; }
      resolve(derivedKey.toString("hex") === hash);
    });
  });
}

const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== "admin") throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
  return next({ ctx });
});

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  adminAuth: router({
    login: publicProcedure.input(z.object({
      username: z.string(),
      password: z.string(),
    })).mutation(async ({ input, ctx }) => {
      const admin = await getAdminByUsername(input.username);
      if (!admin) throw new TRPCError({ code: "UNAUTHORIZED", message: "Invalid credentials" });
      const valid = await verifyAdminPassword(input.password, admin.passwordHash);
      if (!valid) throw new TRPCError({ code: "UNAUTHORIZED", message: "Invalid credentials" });
      const token = await new SignJWT({ adminId: admin.id, username: admin.username })
        .setProtectedHeader({ alg: "HS256" })
        .setExpirationTime("7d")
        .sign(ADMIN_JWT_SECRET);
      // Use sameSite:none + secure for proxy/tunnel environments
      const isSecure = ctx.req.protocol === "https" || ctx.req.headers["x-forwarded-proto"] === "https";
      ctx.res.cookie(ADMIN_SESSION_COOKIE, token, {
        httpOnly: true,
        secure: isSecure,
        sameSite: isSecure ? "none" : "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
        path: "/",
      });
      return { success: true, username: admin.username };
    }),
    logout: publicProcedure.mutation(({ ctx }) => {
      ctx.res.clearCookie(ADMIN_SESSION_COOKIE, { path: "/" });
      return { success: true };
    }),
    check: publicProcedure.query(async ({ ctx }) => {
      const cookieHeader = ctx.req.headers.cookie;
      const cookies = parseCookies(cookieHeader || "");
      const token = cookies[ADMIN_SESSION_COOKIE];
      if (!token) return null;
      try {
        const { payload } = await jwtVerify(token, ADMIN_JWT_SECRET);
        return { username: payload.username as string };
      } catch {
        return null;
      }
    }),
  }),

  services: router({
    list: publicProcedure.query(() => getActiveServices()),
    listAll: adminProcedure.query(() => getAllServices()),
    bySlug: publicProcedure.input(z.object({ slug: z.string() })).query(({ input }) => getServiceBySlug(input.slug)),
    create: adminProcedure.input(z.object({
      slug: z.string(), name: z.string(), tagline: z.string().optional(),
      category: z.string().default("Wellness"), tag: z.string().optional(),
      price: z.string(), duration: z.string().optional(), description: z.string().optional(),
      ingredients: z.array(z.string()).optional(), benefits: z.array(z.string()).optional(),
      idealFor: z.array(z.string()).optional(), icon: z.string().optional(),
      isActive: z.boolean().optional(), sortOrder: z.number().optional(),
    })).mutation(({ input }) => createService(input as any)),
    update: adminProcedure.input(z.object({
      id: z.number(), slug: z.string().optional(), name: z.string().optional(),
      tagline: z.string().optional(), category: z.string().optional(), tag: z.string().optional(),
      price: z.string().optional(), duration: z.string().optional(), description: z.string().optional(),
      ingredients: z.array(z.string()).optional(), benefits: z.array(z.string()).optional(),
      idealFor: z.array(z.string()).optional(), icon: z.string().optional(),
      isActive: z.boolean().optional(), sortOrder: z.number().optional(),
    })).mutation(({ input }) => { const { id, ...data } = input; return updateService(id, data as any); }),
    delete: adminProcedure.input(z.object({ id: z.number() })).mutation(({ input }) => deleteService(input.id)),
  }),

  bookings: router({
    create: publicProcedure.input(z.object({
      serviceId: z.number().optional(), serviceName: z.string(), servicePrice: z.string(),
      bookingDate: z.string(), bookingTime: z.string(),
      fullName: z.string(), email: z.string().email(), phone: z.string(), dob: z.string().optional(), deliveryAddress: z.string().optional(),
      consentData: z.record(z.string(), z.boolean()).optional(),
      medicalHistory: z.array(z.object({ condition: z.string(), yes: z.boolean().nullable(), details: z.string() })).optional(),
      medications: z.array(z.object({ name: z.string(), dose: z.string(), frequency: z.string(), reason: z.string() })).optional(),
      ivntHistory: z.record(z.string(), z.union([z.string(), z.boolean(), z.null()])).optional(),
      wellbeing: z.array(z.object({ symptom: z.string(), yes: z.boolean().nullable(), notes: z.string() })).optional(),
    })).mutation(async ({ input }) => {
      const booking = await createBooking(input as any);
      try { await notifyOwner({ title: `New Booking: ${input.serviceName}`, content: `${input.fullName} booked ${input.serviceName} on ${input.bookingDate} at ${input.bookingTime}. Ref: ${booking?.reference}` }); } catch {}
      return booking;
    }),
    list: adminProcedure.input(z.object({ status: z.string().optional(), search: z.string().optional(), limit: z.number().optional(), offset: z.number().optional() })).query(({ input }) => getBookings(input)),
    byId: adminProcedure.input(z.object({ id: z.number() })).query(({ input }) => getBookingById(input.id)),
    updateStatus: adminProcedure.input(z.object({ id: z.number(), status: z.enum(["pending","confirmed","completed","cancelled"]), adminNotes: z.string().optional() })).mutation(({ input }) => updateBookingStatus(input.id, input.status, input.adminNotes)),
    delete: adminProcedure.input(z.object({ id: z.number() })).mutation(({ input }) => deleteBooking(input.id)),
    stats: adminProcedure.query(() => getBookingStats()),
  }),

  testimonials: router({
    list: publicProcedure.query(() => getActiveTestimonials()),
    listAll: adminProcedure.query(() => getAllTestimonials()),
    create: adminProcedure.input(z.object({ clientName: z.string(), initials: z.string().optional(), rating: z.number().min(1).max(5).optional(), text: z.string(), serviceName: z.string().optional(), isActive: z.boolean().optional(), sortOrder: z.number().optional() })).mutation(({ input }) => createTestimonial(input as any)),
    update: adminProcedure.input(z.object({ id: z.number(), clientName: z.string().optional(), initials: z.string().optional(), rating: z.number().min(1).max(5).optional(), text: z.string().optional(), serviceName: z.string().optional(), isActive: z.boolean().optional(), sortOrder: z.number().optional() })).mutation(({ input }) => { const { id, ...data } = input; return updateTestimonial(id, data as any); }),
    delete: adminProcedure.input(z.object({ id: z.number() })).mutation(({ input }) => deleteTestimonial(input.id)),
  }),

  settings: router({
    get: publicProcedure.query(() => getAllSettings()),
    update: adminProcedure.input(z.object({ settings: z.record(z.string(), z.string()) })).mutation(({ input }) => upsertSettings(input.settings as Record<string, string>)),
  }),

  contact: router({
    send: publicProcedure.input(z.object({ fullName: z.string().min(1), email: z.string().email().optional(), inquiry: z.string().min(1) })).mutation(async ({ input }) => {
      await createContactMessage(input);
      try { await notifyOwner({ title: `New Contact: ${input.fullName}`, content: input.inquiry }); } catch {}
      return { success: true };
    }),
    list: adminProcedure.query(() => getContactMessages()),
    markRead: adminProcedure.input(z.object({ id: z.number() })).mutation(({ input }) => updateContactMessageStatus(input.id, "read")),
    updateStatus: adminProcedure.input(z.object({ id: z.number(), status: z.enum(["unread","read","replied"]) })).mutation(({ input }) => updateContactMessageStatus(input.id, input.status)),
    delete: adminProcedure.input(z.object({ id: z.number() })).mutation(({ input }) => deleteContactMessage(input.id)),
  }),

  media: router({
    upload: adminProcedure.input(z.object({ filename: z.string(), contentType: z.string(), base64: z.string() })).mutation(async ({ input }) => {
      const buffer = Buffer.from(input.base64, "base64");
      const key = `ruhi-wellness/${Date.now()}-${input.filename}`;
      const { url } = await storagePut(key, buffer, input.contentType);
      return { url, key };
    }),
  }),

  seed: router({
    run: adminProcedure.mutation(async () => {
      const existing = await getActiveServices();
      if (existing.length > 0) return { message: "Already seeded" };
      const drips = [
        { slug:"the-quench", name:"The Quench", tagline:"Pure isotonic hydration", category:"Wellness", tag:"Hydration", price:"149.00", duration:"30 Min Session", description:"Our foundation drip. Pure isotonic hydration infused with essential B-Vitamins to instantly rehydrate and refresh your system.", ingredients:["Normal Saline (0.9% NaCl)","Vitamin B-Complex","Magnesium","Electrolytes"], benefits:["Rapid rehydration","Increased energy","Improved skin tone","Reduced fatigue","Enhanced mental clarity"], idealFor:["Dehydration","Jet lag","Post-exercise","General wellness"], icon:"droplet", sortOrder:1 },
        { slug:"myers-cocktail", name:"Myers' Cocktail", tagline:"The gold standard IV", category:"Wellness", tag:"Immunity", price:"199.00", duration:"45 Min Session", description:"The gold standard. A robust blend of Vitamin C, B-Complex, Magnesium, and Calcium to boost immunity and overall vitality.", ingredients:["Vitamin C (high dose)","B-Complex","Magnesium","Calcium","Zinc"], benefits:["Immune system boost","Increased energy","Reduced inflammation","Improved mood","Better sleep"], idealFor:["Immune support","Chronic fatigue","Fibromyalgia","Seasonal illness prevention"], icon:"zap", sortOrder:2 },
        { slug:"neuro-boost", name:"Neuro-Boost", tagline:"Cognitive enhancement drip", category:"Wellness", tag:"Focus", price:"249.00", duration:"60 Min Session", description:"Enhance cognitive function and mental clarity with a high-dose infusion of NAD+ and essential amino acids.", ingredients:["NAD+","Alpha Lipoic Acid","B12","L-Taurine","Amino Acids"], benefits:["Enhanced focus","Mental clarity","Improved memory","Anti-aging effects","Neurological support"], idealFor:["Brain fog","Mental fatigue","High-performance professionals","Anti-aging"], icon:"brain", sortOrder:3 },
        { slug:"athletic-prep", name:"Athletic Prep", tagline:"Pre-performance optimisation", category:"Recovery", tag:"Performance", price:"179.00", duration:"45 Min Session", description:"Optimise your body before intense physical exertion with targeted amino acids and immediate cellular hydration.", ingredients:["Amino Acids","B-Complex","Magnesium","Electrolytes","Vitamin C"], benefits:["Improved endurance","Faster warm-up","Reduced injury risk","Better oxygen delivery","Peak performance"], idealFor:["Athletes","Pre-competition","Endurance sports","Gym performance"], icon:"activity", sortOrder:4 },
        { slug:"post-match-rehab", name:"Post-Match Rehab", tagline:"Accelerated muscle recovery", category:"Recovery", tag:"Recovery", price:"189.00", duration:"45 Min Session", description:"Accelerate muscle recovery and flush lactic acid with a restorative blend of Magnesium, Toradol, and B12.", ingredients:["Magnesium","B12","Toradol (anti-inflammatory)","Amino Acids","Electrolytes"], benefits:["Reduced muscle soreness","Faster recovery","Reduced inflammation","Improved sleep","Restored energy"], idealFor:["Post-workout","Sports injuries","Muscle soreness","Endurance athletes"], icon:"dumbbell", sortOrder:5 },
        { slug:"the-reset", name:"The Reset", tagline:"Rapid detox & recovery", category:"Recovery", tag:"Detox", price:"159.00", duration:"30 Min Session", description:"Alleviate symptoms of overindulgence or jet lag rapidly with anti-nausea medication, electrolytes, and complex vitamins.", ingredients:["Anti-nausea medication","Electrolytes","B-Complex","Vitamin C","Magnesium"], benefits:["Rapid nausea relief","Headache reduction","Rehydration","Energy restoration","Mood improvement"], idealFor:["Hangover","Jet lag","Nausea","Food poisoning recovery"], icon:"refresh-cw", sortOrder:6 },
        { slug:"glow-drip", name:"Glow Drip", tagline:"Radiant skin from within", category:"Beauty", tag:"Beauty", price:"219.00", duration:"45 Min Session", description:"Achieve radiant, glowing skin with our beauty-focused infusion of Glutathione, Biotin, and high-dose Vitamin C.", ingredients:["Glutathione","Biotin","Vitamin C (high dose)","Collagen boosters","B-Complex"], benefits:["Brighter skin","Reduced pigmentation","Anti-aging","Stronger hair & nails","Antioxidant protection"], idealFor:["Skin brightening","Anti-aging","Hair & nail health","Pre-event glow"], icon:"sparkles", sortOrder:7 },
        { slug:"immune-shield", name:"Immune Shield", tagline:"Ultimate defence matrix", category:"Wellness", tag:"Immunity", price:"179.00", duration:"45 Min Session", description:"Fortify your immune system with a powerful blend of Zinc, Vitamin C, and immune-boosting nutrients.", ingredients:["Zinc","Vitamin C (mega dose)","Selenium","B-Complex","Glutathione"], benefits:["Strengthened immunity","Antiviral support","Reduced sick days","Antioxidant boost","Faster illness recovery"], idealFor:["Illness prevention","Post-illness recovery","Seasonal changes","Frequent travellers"], icon:"shield", sortOrder:8 },
      ];
      for (const d of drips) await createService(d as any);
      const testimonialData = [
        { clientName:"Sarah M.", initials:"SM", rating:5, text:"The Myers' Cocktail completely transformed my energy levels. I felt the difference within hours. Absolutely incredible service!", serviceName:"Myers' Cocktail" },
        { clientName:"James T.", initials:"JT", rating:5, text:"Used the Athletic Prep before my marathon and had my best race ever. The team at Ruhi Wellness is professional and caring.", serviceName:"Athletic Prep" },
        { clientName:"Priya K.", initials:"PK", rating:5, text:"The Glow Drip has become my monthly ritual. My skin has never looked better and the experience is so luxurious.", serviceName:"Glow Drip" },
        { clientName:"David R.", initials:"DR", rating:5, text:"After a long-haul flight, The Reset had me feeling human again within 30 minutes. Can't recommend it enough!", serviceName:"The Reset" },
      ];
      for (const t of testimonialData) await createTestimonial({ ...t, isActive: true, sortOrder: 0 } as any);
      await upsertSettings({
        "hero.title":"Revitalise at the Cellular Level.",
        "hero.subtitle":"Experience pure, targeted hydration and nutrient delivery in a soothing, premium environment. Formulated for athletes, professionals, and wellness seekers.",
        "about.title":"Why Ruhi Wellness?",
        "about.text":"At Ruhi Wellness, we believe optimal health starts at the cellular level. Our clinically formulated IV drip therapies deliver nutrients directly into your bloodstream, bypassing the digestive system for 100% absorption.",
        "contact.phone":"+44 (0) 7700 900000",
        "contact.email":"hello@ruhiwellness.com",
        "contact.address":"London, United Kingdom",
        "contact.hours.weekdays":"Mon–Fri: 9:00 AM – 7:00 PM",
        "contact.hours.saturday":"Saturday: 10:00 AM – 5:00 PM",
        "contact.hours.sunday":"Sunday: Closed",
      });
      return { message: "Seeded successfully" };
    }),
  }),
});

export type AppRouter = typeof appRouter;
