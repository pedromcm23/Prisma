# Prisma: Redefining Direct Booking and Authentic Hospitality Relationships

Prisma is a direct-booking platform designed to reconnect independent hosts and experience-driven travelers. By offering a direct alternative to legacy Online Travel Agencies (OTAs) like Booking.com and Airbnb, Prisma empowers hosts to bypass steep commission fees (which can range from 15.5% to 20% on traditional platforms) and build direct, authentic, and long-term customer relationships. 

The application utilizes an organic marketing channel powered by a dual-mode system: **Host Mode**, where owners can spin up personalized direct-booking landing pages in under 20 minutes with zero design experience, and **Guest Mode**, which incentivizes guests to share their stays on social media through a dedicated **Social Rewards** system.

---

## 🌟 Core Features

### 1. Host Mode: Empowering Independent Stays
Host Mode provides property managers, B&B owners, and boutique lodging hosts with the infrastructure needed to own their brand narrative and manage reservations seamlessly.

*   **Create Your Website (4-Step Wizard):**
    *   **Simple Setup:** Step 1 allows hosts to quickly add their property name, location, and a short tagline.
    *   **Room Setup & Pricing:** Add rooms, set prices per night, and tag specific amenities (e.g., Wi-Fi, Terrace, Kitchen, Sea View, Balcony, Pool).
    *   **Media Gallery:** Drag-and-drop file uploader supporting up to 6 high-quality photos per room.
*   **Property Management ("Everything Under One Roof"):**
    *   **Multi-Property Dashboard:** View, monitor, and remove multiple properties from a single interface.
    *   **Quick Stats:** Each property card displays the location, room configurations and starting prices.
*   **Calendar & Base Pricing:**
    *   **Interactive Booking Calendar:** Manage availability day-by-day with clear status indicators: *Open*, *Blocked*, *Booked by Guest*, or *Flash Deal*.
    *   **Monthly Base Pricing:** Set default per-night prices individually for each calendar month (January–December) to handle seasonal demand fluctuations automatically.
    *   **Spontaneous Escapes:** Toggle last-minute open dates to push them directly onto the guest feed as Flash Deals.
*   **Booking History:**
    *   A centralized registry showing "who stayed with you" with columns for Guest Name, Property, Dates, Booking Status, and Guest Reviews.
*   **Social Rewards (Impact Analytics):**
    *   **"Share the Love" Verification:** Approve submissions from guests who shared their stay on social media to award them loyalty points.
    *   **Impact Tracker:** Monitor approved posts and view metrics on organic potential reach generated at zero marketing cost.

---

### 2. Guest Mode: Cultivating Authentic Travel
Guest Mode is designed for experience-driven travelers (especially Gen Z and Millennials) looking for local, authentic recommendations and direct-booking discounts.

*   **Discover Feed ("Stays with Soul"):**
    *   **Curated Listings:** Search and browse beautiful, polaroid-style listings of unique stays with overall community ratings, key amenities, and direct host attribution.
    *   **Direct-Booking Redirection:** Features a "Visit Site" button on each listing that connects travelers directly to the host's custom landing page in one click.
    *   **Layout Toggles:** Switch seamlessly between **Grid** and **Map** views.
*   **Flash Deals ("Special Bundles, Better Prices"):**
    *   **Exclusive Discounts:** Access promotional last-minute prices and unique host-curated bundles on specific dates.
    *   **Urgent Feeds:** Interactive cards with badges like "FLASH DEAL DISCOUNT" and "EXCLUSIVE BUNDLE" with instant "Grab It" call-to-actions.
*   **My Bookings ("Your Trips"):**
    *   A clean timeline tracking **Current stays** (real-time active bookings), **Upcoming bookings** (future stays), and **Past bookings** (completed history).
*   **My Rewards ("Your Perks"):**
    *   **Progression Tracking:** A visual points balance meter showing progress toward redeeming major discounts (e.g., 1000 points = €50 direct-booking coupon).
    *   **Gamified Reward Rules:**
        *   **Rule 01 (Book a Stay):** Earn **500 points** automatically after check-out.
        *   **Rule 02 (Leave a Review):** Earn **100 points** for rating and reviewing a completed stay.
        *   **Rule 03 (Social Media):** Earn **250 points** by posting/tagging a stay and submitting the link.
        *   **Rule 04 (Refer a Host):** Earn **750 points** when a referred host joins the platform.
    *   **Invite & Earn referral link:** Give friends €25 off their first stay, and earn 500 points when they book.
    *   **Social Post Submission Box:** Paste TikTok or Instagram links directly in-app to claim the 250-point social sharing bonus.

---

## 🔄 System Architecture & Flow

```text
                 +--------------------------------------------+
                 |                 PRISMA APP                 |
                 +---------------------+----------------------+
                                       |
                  +--------------------+--------------------+
                  |                                         |
                  v                                         v
       +--------------------+                    +--------------------+
       |     HOST MODE      |                    |     GUEST MODE     |
       +---------+----------+                    +---------+----------+
                 |                                         |
    +------------+------------+               +------------+------------+
    | - Web Builder (Wizard)  |               | - Discover Feed         |
    | - Property Management   |               | - My Bookings           |
    | - Calendar & Pricing    |               | - Flash Deals           |
    | - Social Rewards Review | <-----------+ | - Social Reward Claims  |
    +-------------------------+  Approves     +-------------------------+
                                 Submissions
```

1.  **Direct Onboarding:** Hosts list properties, set seasonal pricing, and launch custom websites using Prisma's streamlined 4-step wizard.
2.  **Organic Discovery:** Guests find and book stays directly on the hosts' websites, bypassing high OTA fees.
3.  **Viral Sharing Loop:** Guests share their experiences on TikTok or Instagram and submit proof in Guest Mode to earn loyalty points.
4.  **Reward Approval:** Hosts verify the organic social media posts in their Social Rewards dashboard, rewarding guests with points redeemable for future stays.

---

## 💻 Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Library:** React 19
- **Language:** TypeScript
- **Styling:** Tailwind CSS + Radix UI Primitives
- **Database ORM:** Prisma
- **Database:** PostgreSQL (Supabase / Vercel Postgres)
- **Authentication:** NextAuth.js (Auth.js v5)
- **Icons:** Lucide React

---

## 🛠️ Installation & Setup

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) (v18 or higher) and npm installed. You will also need a PostgreSQL database (e.g., [Supabase](https://supabase.com/)).

### 1. Clone the repository
```bash
git clone https://github.com/pedromcm23/Prisma.git
cd Prisma
```

### 2. Install dependencies
```bash
npm install
# or
yarn install
```

### 3. Environment Variables
Create a `.env` file in the root directory based on the `.env.example` structure (if available), or define the following variables:
```env
# Database connection string (PostgreSQL)
DATABASE_URL="postgresql://user:password@host:port/database"
POSTGRES_PRISMA_URL="postgresql://user:password@host:port/database"

# NextAuth Configuration
NEXTAUTH_SECRET="generate_a_random_secret_key_here"
NEXTAUTH_URL="http://localhost:3000"
```

### 4. Database Setup
Push the Prisma schema to your PostgreSQL database to create the necessary tables:
```bash
npx prisma db push
```

### 5. Start the Application
Run the development server:
```bash
npm run dev
# or
yarn dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

---

## 🎨 Design Philosophy
Prisma's user interface is styled to evoke a high-end, tactile, and editorial feel—resembling classic travel journals and analog polaroid photos.
*   **Typography:** Elegant serif headings coupled with clean, accessible sans-serif body text.
*   **Color Palette:** Warm, organic creams (`#F9F6EE`), deep rust terracottas (`#D05A3F`), and soft pastel accents that convey authenticity and premium hospitality.
*   **Aesthetics:** High-contrast borders, shadow depth, and micro-animations ensure a highly dynamic and engaging user experience.
