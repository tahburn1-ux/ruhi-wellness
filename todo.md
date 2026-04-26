# Ruhi Wellness — Project TODO

## Database & Backend
- [x] Define full schema (services, bookings, testimonials, site_settings, contact_messages) in drizzle/schema.ts
- [x] Push schema to DB with pnpm db:push
- [x] Add all tRPC procedures in server/routers.ts (services, bookings, testimonials, settings, contact, media)

## Public Website
- [x] Global CSS: Ruhi Wellness brand colours, fonts, animations (drip scroll indicator)
- [x] Navbar with logo, nav links, Book Now CTA
- [x] Home page: animated hero, stats bar, featured drips, benefits section, testimonials, process steps
- [x] Services/Drips catalogue page with category filter and service cards
- [x] Individual Drip Detail page with ingredients, benefits, ideal-for, and Book CTA
- [x] Booking flow: Step 1 (select drip + date/time), Step 2 (personal details), Step 3 (full consent form)
- [x] Contact page with form, hours, phone, address
- [x] Footer with links

## Admin Panel
- [x] Admin login page (uses Manus auth with role=admin)
- [x] Admin dashboard: stats cards (total bookings, pending, revenue, recent orders)
- [x] Orders/Bookings management: list, filter by status, view full booking + consent form, update status
- [x] Services editor: list all services, add/edit/delete, toggle active, reorder
- [x] Testimonials manager: add/edit/delete/reorder testimonials
- [x] Site content editor: edit hero text, about text, contact details, hours
- [x] Media/image uploader: upload and assign images to hero, about, clinic sections

## Polish & Deployment
- [x] Scroll drip animation (SVG water drop follows scroll)
- [x] Flip card animations on service cards
- [x] Scroll reveal animations on sections
- [x] Responsive design (mobile-first)
- [x] Railway deployment config (railway.json + DEPLOY.md guide)
- [ ] GitHub export — manual user step: Management UI → ⋯ More → Export to GitHub (see DEPLOY.md)
- [ ] Add logo when provided by client (upload via Admin → Settings → Images)
- [ ] Update contact details (phone, email, address) in admin settings (editable at /admin/settings)
