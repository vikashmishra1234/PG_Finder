# 🏠 PG Finder

A modern, full-stack platform connecting students and professionals with verified paying guest (PG) accommodations. Built with Next.js, React, TypeScript, and PostgreSQL, PG Finder simplifies property discovery for renters and provides an intuitive management dashboard for PG owners.

**Live Demo:** [Coming Soon]  
**Status:** 🚧 In Active Development

---

## ✨ Key Features

### For Renters
- 🔍 **Smart Property Search** – Browse verified PG listings filtered by location, price, amenities, and room type
- 🏠 **Detailed Listings** – View high-quality images, complete facility details, and owner contact information
- 💬 **Complaint System** – Raise and track maintenance issues directly through the platform
- 💳 **Digital Payments** – Secure online rent payments with transaction history

### For PG Owners
- 📊 **Owner Dashboard** – Manage properties, bed availability, and tenant information in one place
- 💰 **Payment Tracking** – Monitor monthly rent collection and payment status
- 🛠️ **Complaint Management** – Receive and resolve tenant complaints efficiently
- 📈 **Analytics** – Track occupancy rates and revenue insights

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | Next.js 16, React 19, TypeScript, Tailwind CSS |
| **Backend** | Next.js API Routes, Server Actions |
| **Database** | PostgreSQL with Prisma ORM |
| **Authentication** | JWT + Bcrypt |
| **Security** | Password hashing, token-based auth, middleware protection |
| **Styling** | Tailwind CSS v4, PostCSS |
| **State Management** | React hooks, Context API |
| **Build Tools** | TypeScript, ESLint |

---

## 📁 Project Structure

```
PG_Finder/
├── app/                      # Next.js App Router
│   ├── page.tsx             # Landing page with hero, features, CTA
│   ├── layout.tsx           # Root layout with global styles
│   ├── globals.css          # Global Tailwind styles
│   ├── sign-in/             # Authentication: Login page
│   ├── sign-up/             # Authentication: Registration page
│   └── dashboard/           # Protected dashboard routes
├── server/                   # Backend logic
│   ├── actions/             # Server actions (mutations)
│   ├── repository/          # Data access layer
│   └── services/            # Business logic & workflows
├── components/              # Reusable React components
├── lib/                      # Utility functions & helpers
├── prisma/                   # Database schema & migrations
│   └── schema.prisma        # Prisma data model
├── public/                   # Static assets
├── middleware.ts            # Auth middleware & route protection
├── tailwind.config.ts       # Tailwind configuration
├── tsconfig.json            # TypeScript configuration
└── package.json             # Dependencies & scripts
```

### How It Fits Together

1. **Authentication Flow** – Users register via `/sign-up` with role selection (renter/owner). JWT tokens stored in cookies
2. **Protected Routes** – Middleware validates tokens and redirects unauthorized users
3. **Dashboard** – Authenticated users access personalized dashboards based on their role
4. **Data Operations** – Server actions handle requests → repository layer queries database via Prisma

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- PostgreSQL database (local or cloud-hosted)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/vikashmishra1234/PG_Finder.git
   cd PG_Finder
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   Update with your database URL and other config:
   ```
   DATABASE_URL="postgresql://user:password@localhost:5432/pg_finder"
   JWT_SECRET="your-secret-key"
   NEXT_PUBLIC_API_URL="http://localhost:3000"
   ```

4. **Set up the database**
   ```bash
   npx prisma migrate dev --name init
   npx prisma db seed
   ```

5. **Run development server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

### Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm start        # Start production server
npm run lint     # Run ESLint checks
```

---

## 🗄️ Database Schema

### Core Models

**User** – Stores renter/owner profiles with authentication credentials
```
- userId (UUID, PK)
- name, email, password
- isActive, isDeleted
- stayingInPgId, roomNo, bedNo (residency details)
- roles, complaints, payments
```

**PG** – Property listings with facilities and pricing
```
- pgId (UUID, PK)
- title, description, address, city, state, pincode
- roomsCount, availableBeds, genderType, roomType
- rent, securityFee, maintenanceFee
- facilities (wifi, parking, laundry, AC, food)
- ownerName, ownerPhone, ownerEmail
- images[], isAvailable, isVerified
- complaints, payments
```

**Complaint** – Maintenance issues tracked by tenants
```
- complaintId (UUID, PK)
- userId, pgId (FK)
- title, description, category
- priority, status (PENDING → IN_PROGRESS → RESOLVED)
```

**Payment** – Rent payment tracking
```
- paymentId (UUID, PK)
- userId, pgId (FK)
- amount, month, status
- transactionId, paymentMethod
```

**Role** – User role management
```
- roleId (UUID, PK)
- name (ADMIN, OWNER, RENTER)
```

See [`prisma/schema.prisma`](./prisma/schema.prisma) for complete schema.

---

## 🔐 Authentication & Security

- **Registration** – Passwords hashed with bcryptjs before storage
- **Login** – JWT tokens issued and stored in httpOnly cookies
- **Token Validation** – Middleware verifies tokens on protected routes
- **Role-Based Access** – Dashboard routes check user roles before rendering

---

## 🚦 API Endpoints (Future)

### Authentication
- `POST /api/auth/register` – User registration
- `POST /api/auth/login` – User login
- `POST /api/auth/logout` – Logout

### Properties
- `GET /api/pg` – List all PGs
- `POST /api/pg` – Create new listing (owner only)
- `GET /api/pg/[id]` – Get PG details
- `PUT /api/pg/[id]` – Update listing (owner only)

### Complaints
- `GET /api/complaints` – List user complaints
- `POST /api/complaints` – File new complaint
- `PUT /api/complaints/[id]` – Update status

### Payments
- `GET /api/payments` – Payment history
- `POST /api/payments` – Record payment

---

## 📊 Features Roadmap

- [ ] Advanced search filters (amenities, price range, distance)
- [ ] Property rating & reviews system
- [ ] Real-time notifications
- [ ] Payment gateway integration (Razorpay/Stripe)
- [ ] Mobile app (React Native)
- [ ] Email verification & password reset
- [ ] Admin panel with platform analytics
- [ ] Map-based property discovery

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📝 License

This project is currently unlicensed. See LICENSE file for details.

---

## 🙋 Support & Contact

- **Issues** – Report bugs via [GitHub Issues](https://github.com/vikashmishra1234/PG_Finder/issues)
- **Email** – [Your Email]
- **LinkedIn** – [Your Profile]

---

## 🎓 Skills Demonstrated

This project showcases 2+ years of full-stack development experience:

- ✅ Next.js 16 (App Router, Server Actions, Middleware)
- ✅ React 19 & TypeScript for type-safe UI
- ✅ PostgreSQL & Prisma ORM for data modeling
- ✅ Authentication & authorization (JWT, role-based access)
- ✅ Responsive design with Tailwind CSS
- ✅ Server-side rendering & static generation
- ✅ RESTful API design patterns
- ✅ Git version control & collaborative development

---

**Built with ❤️ by [Your Name]**

Last updated: July 2026
