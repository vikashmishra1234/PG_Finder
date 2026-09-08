# Architecture & Design

## 📐 System Overview

PG Finder follows a **modern full-stack architecture** with clear separation of concerns:

```
┌─────────────────────────────────────────────────────────────┐
│                    CLIENT LAYER (Browser)                    │
│  Next.js 16 (App Router) + React 19 + TypeScript            │
└────────────────┬────────────────────────────────────────────┘
                 │
┌────────────────▼────────────────────────────────────────────┐
│              MIDDLEWARE & ROUTING LAYER                      │
│  - JWT Token Validation (middleware.ts)                      │
│  - Role-Based Access Control                                 │
│  - Route Protection & Redirects                              │
└────────────────┬────────────────────────────────────────────┘
                 │
┌────────────────▼────────────────────────────────────────────┐
│              APPLICATION LAYER (Next.js API)                 │
│  Server Actions + API Routes                                 │
│  ├── server/actions/     → User mutations                    │
│  ├── server/services/    → Business logic                    │
│  └── server/repository/  → Data queries                      │
└────────────────┬────────────────────────────────────────────┘
                 │
┌────────────────▼────────────────────────────────────────────┐
│              DATA ACCESS LAYER (Prisma)                      │
│  - Schema validation                                          │
│  - Query optimization                                         │
│  - Transaction management                                     │
└────────────────┬────────────────────────────────────────────┘
                 │
┌────────────────▼────────────────────────────────────────────┐
│            DATABASE LAYER (PostgreSQL)                       │
│  - User & Role tables                                        │
│  - PG listings & Images                                      │
│  - Complaints & Payments                                     │
└─────────────────────────────────────────────────────────────┘
```

---

## 📁 Directory Structure Deep Dive

### `app/` - Next.js App Router (UI Layer)

```
app/
├── page.tsx              # Landing page (public)
│   └── Features: Hero section, CTA, testimonials
├── layout.tsx            # Root layout wrapper
├── globals.css           # Global Tailwind styles
├── sign-in/
│   └── page.tsx         # Login form & authentication
├── sign-up/
│   └── page.tsx         # Registration form (renter/owner selection)
└── dashboard/
    ├── page.tsx         # Dashboard homepage (protected)
    ├── layout.tsx       # Dashboard layout (sidebar, navbar)
    ├── properties/      # Owner: List & manage properties
    ├── complaints/      # View & manage complaints
    ├── payments/        # Payment history & tracking
    └── settings/        # User profile & preferences
```

**Flow:** User visits → Middleware checks token → Routes to appropriate page

### `server/` - Backend Logic (Server Layer)

```
server/
├── actions/             # Server Actions (form handlers)
│   ├── auth.ts         # Register, login, logout
│   ├── pg.ts           # Create, update, delete listings
│   ├── complaint.ts    # File & resolve complaints
│   └── payment.ts      # Process payments
│
├── services/            # Business Logic Layer
│   ├── authService.ts      # Password hashing, JWT generation
│   ├── pgService.ts        # Listing validation & processing
│   ├── complaintService.ts # Complaint workflow logic
│   └── paymentService.ts   # Payment calculations & tracking
│
└── repository/          # Data Access Layer (Prisma Queries)
    ├── userRepository.ts      # User CRUD operations
    ├── pgRepository.ts        # PG listing queries
    ├── complaintRepository.ts # Complaint queries
    └── paymentRepository.ts   # Payment queries
```

**Layered Pattern:**
```
UI (app/) → Server Actions (actions/) → Services (business logic) → Repository (Prisma) → Database
```

### `prisma/` - Database Schema

```
prisma/
├── schema.prisma        # Complete data model
│   ├── User            # Authentication & profile
│   ├── Role            # User roles (ADMIN, OWNER, RENTER)
│   ├── PG              # Property listings
│   ├── Complaint       # Maintenance issues
│   └── Payment         # Rent transactions
├── migrations/         # Schema version history
└── generated/          # Prisma Client (auto-generated)
```

---

## 🔄 Data Flow Examples

### 1️⃣ User Registration Flow

```
User fills form (sign-up/page.tsx)
         ↓
Form submitted → Server Action (registerUser)
         ↓
Service validates email & password strength
         ↓
Repository checks if email exists
         ↓
Bcrypt hashes password
         ↓
Prisma creates User + Role records
         ↓
JWT token generated
         ↓
Token stored in httpOnly cookie
         ↓
Redirect to dashboard
```

### 2️⃣ PG Listing Creation (Owner)

```
Owner fills form (dashboard/properties/new)
         ↓
Server Action (createPG)
         ↓
Service validates facility details & pricing
         ↓
Repository creates PG + links to user via userId
         ↓
Images uploaded to storage
         ↓
PG marked as "pending verification"
         ↓
Admin reviews & sets isVerified = true
         ↓
Listing visible to renters
```

### 3️⃣ Payment Tracking

```
Renter submits payment form
         ↓
Server Action (recordPayment)
         ↓
Service validates amount & month
         ↓
Prisma creates Payment record with status: "PENDING"
         ↓
Payment gateway integration (future)
         ↓
transactionId stored
         ↓
Status updated to "PAID"
         ↓
Owner sees payment in dashboard
```

---

## 🔐 Authentication & Security Architecture

### Token-Based Auth Flow

```
┌─────────────────────────────────────┐
│ Login (username + password)         │
└──────────────┬──────────────────────┘
               │
               ▼
    ┌──────────────────────┐
    │ Verify credentials   │
    │ (bcrypt comparison)  │
    └──────────┬───────────┘
               │
               ▼
    ┌──────────────────────────────┐
    │ Generate JWT token           │
    │ (payload: userId, role)      │
    │ (expiry: configurable)       │
    └──────────┬───────────────────┘
               │
               ▼
    ┌──────────────────────────────┐
    │ Store in httpOnly cookie     │
    │ (secure from XSS attacks)    │
    └──────────┬───────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│ Protected Routes                    │
│ Middleware validates token          │
│ Extracts userId, role               │
│ Allows/denies access                │
└─────────────────────────────────────┘
```

### Middleware Protection (`middleware.ts`)

```typescript
// Validates JWT token on protected routes
// Redirects unauthenticated users to /sign-in
// Redirects authenticated users away from /sign-in, /sign-up
// Enforces role-based access (owner vs renter)
```

---

## 🗄️ Database Schema Relationships

```
User (1) ──────────────────── (many) PG
  │                                   │
  │                                   ├──── (many) Complaint
  │                                   │
  │                                   └──── (many) Payment
  │
  ├──── (many) Role
  │
  ├──── (many) Complaint
  │
  └──── (many) Payment

Complaint (many) ──── (1) User
           (many) ──── (1) PG

Payment (many) ──── (1) User
        (many) ──── (1) PG
```

---

## 🎯 Component Architecture

### Page Components (Server Components)
- `app/page.tsx` – Landing page
- `app/sign-in/page.tsx` – Login
- `app/sign-up/page.tsx` – Registration
- `app/dashboard/page.tsx` – Dashboard

### Reusable Components (`components/`)
- `components/Navbar.tsx` – Navigation header
- `components/PropertyCard.tsx` – Listing card
- `components/ComplaintForm.tsx` – File complaint
- `components/PaymentTracker.tsx` – Payment history

---

## 🚀 Performance Optimization Strategy

| Optimization | Implementation |
|-------------|----------------|
| **Image Optimization** | Next.js `Image` component with lazy loading |
| **Code Splitting** | Dynamic imports for heavy components |
| **Caching** | Prisma query caching + database indexes |
| **Database Indexing** | Indexes on `userId`, `pgId`, `email` (foreign keys) |
| **Middleware Efficiency** | Token validation only on protected routes |
| **CSS-in-JS** | Tailwind CSS (utility-first, tree-shaking) |

---

## 🔄 Deployment Architecture

### Development Environment
```
Local PostgreSQL ← Prisma ← Next.js Dev Server (npm run dev)
```

### Production Environment (Future)
```
Cloud DB (AWS RDS/Vercel) ← Prisma → Next.js (Vercel)
                                         ↓
                                    CDN (Edge)
```

---

## 📊 Scalability Considerations

1. **Database** – Add connection pooling (PgBouncer) for high concurrency
2. **Caching** – Implement Redis for session & listing cache
3. **File Storage** – Use AWS S3 or Cloudinary for property images
4. **API Rate Limiting** – Protect endpoints from abuse
5. **Monitoring** – Add Sentry/LogRocket for error tracking

---

## 🛠️ Tech Decisions & Rationale

| Decision | Rationale |
|----------|-----------|
| **Next.js 16** | SSR, API routes, built-in optimization, Vercel deployment |
| **TypeScript** | Type safety, better DX, catches errors at compile time |
| **Prisma** | Type-safe queries, auto migrations, excellent DX |
| **Tailwind CSS** | Utility-first, smaller bundle, faster development |
| **JWT Auth** | Stateless, scalable, no server-side session storage needed |

---

## 📚 References

- [Next.js App Router Docs](https://nextjs.org/docs/app)
- [Prisma ORM Guide](https://www.prisma.io/docs/)
- [JWT Authentication Best Practices](https://tools.ietf.org/html/rfc7519)
- [PostgreSQL Performance Tips](https://wiki.postgresql.org/wiki/Performance_Optimization)
