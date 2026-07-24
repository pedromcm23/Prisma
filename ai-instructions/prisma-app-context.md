# Prisma: Full Context & Development Guide

## 1. Executive Summary & Problem Definition
**Project Name:** Prisma (assumed from problem context)
**Core Mission:** To empower independent hosts and small hospitality businesses by unbundling legacy booking platforms (Airbnb, Booking.com) while providing travelers with authentic, community-driven, and culturally immersive travel experiences.

### The Problem
1. **Host Dependency & Margin Loss:** Small hospitality businesses rely heavily on major platforms, paying steep commissions (e.g., Airbnb's 15.5% standard fee). This drains revenue daily on a per-booking basis and restricts hosts' ability to build brand identity or long-term loyalty.
2. **Traveler Friction & Lack of Authenticity:** Travelers struggle to find genuine local experiences. Mainstream booking algorithms prioritize commercialized, generic options, leading to traveler fatigue with hidden fees and inauthentic stays.
3. **The Disconnect:** Both parties suffer from a purely transactional ecosystem. Hosts lose margin and brand control; travelers lose out on authentic cultural exchanges.

## 2. Customer Validation & Target Audience
**Primary ICP (B2B Buyer - The Host):**
*   **Profile:** Independent Airbnb or small boutique hotel owners.
*   **Location:** Europe.
*   **Metrics:** <$20k annual operating profit, <60% occupancy rate.
*   **Pain Point:** Frustrated by high platform commissions but trapped by the need for customer inflow. They require a zero-design-experience, ultra-fast setup (under 20 minutes) to adopt a direct-booking tool.

**Secondary ICP (B2C End-User - The Traveler):**
*   **Profile:** Gen Z & Millennials (aged 20–30).
*   **Preferences:** Seek authentic local culture over luxury. Value direct-booking discounts and personal host recommendations.
*   **Pain Point:** Distrust of generic reviews and corporate listings. They need verified reviews from known sources to feel confident booking directly.

**Research Conducted:**
*   **Quantitative:** 44 respondents (Local Experience & Travel Preferences Survey).
*   **Qualitative:** 3 in-depth interviews with independent stay managers/hosts.
*   **Synthetic:** 200 Reddit forum thread analyses.

## 3. Core Value Proposition & Business Model
**The Pivot:** Initial assumptions focused solely on substituting existing platforms. Customer discovery revealed the true value lies in **redefining how guests interact with and discover establishments**. To overcome the trust barrier of direct booking, customers must reach establishments through verified reviews from known sources.

**Business Model Strategy:**
*   Disruptive, highly scalable monetization (e.g., flat-rate software subscription or drastically lower transaction fees).
*   **Economic Empowerment:** Retaining margins allows hosts to reinvest in their properties and local communities.
*   **Elevated Travel Ecosystem:** Facilitating genuine human connection and community-driven tourism.

---

## 4. Web App Architecture & Wireflow

Based on the provided sketches ("WhatsApp Image 2026-07-23 at 16.30.15.jpeg" and "WhatsApp Image 2026-07-23 at 16.30.15 (1).jpeg"), the application follows a bifurcated architecture post-login, catering to both Hosts and Customers.

### Pre-Login / Public Views
*   **Presentation Page (About):** High-level marketing page explaining the Prisma value proposition.
*   **Personalized Host Page:** The direct-booking landing page for a specific host. (Action: Reached by clicking a specific listing or referral link).

### Authentication Flow
*   **Login Page:** Centralized entry point featuring **Google Auth**.
*   **Routing Logic:** Post-login, the system routes the user to either the Host flow or the Customer flow based on their account type.

### Host User Flow (B2B)
1.  **Host Profile:** The main dashboard and profile settings area for the property owner. Includes navigation options to other management tools.
2.  **Landing Page Creation / Edition:**
    *   *Integration:* Uses the **UNLAYER API** (an embedded drag-and-drop editor) to meet the "under 20 minutes, zero design experience" requirement.
    *   *Purpose:* Allows hosts to build and maintain their branded direct-booking site.
3.  **Booking Listings and Management:**
    *   *UI Component:* A comprehensive data table listing each booking.
    *   *Purpose:* Centralized hub for managing reservations, guest communication, and availability.

### Customer User Flow (B2C)
1.  **Search & Discovery:**
    *   **Searching Bar:** Main interface to find stays. Includes advanced **Filters** (likely focused on local experiences, verified sources, and dates).
    *   *Action:* Executing a search updates the view to display relevant listings.
2.  **Customer Profile & Rewards (The "Trust & Community" Loop):**
    *   **Customer Profile:** Basic user settings and history.
    *   **Referral Page and Rewards (Continuity from Image 2):**
        *   Displays **Current Points** (e.g., 1003 points).
        *   Displays **Available Rewards**.
        *   *Action:* Clicking the **"+"** button opens the submission flow.
    *   **Post Submission Page:** 
        *   Allows the customer to submit proof of a verified review/social post to earn points.
        *   Fields include: **Post link** and **Current followers**. (This ties directly into solving the "verified review from known sources" problem).
3.  **Booking Management:**
    *   **Booking Page:** A summary list of all the user's past and upcoming bookings.
    *   **Booking Management Page (Booking Details):** A drilled-down view showing specific details for a single booking (itinerary, host contact, etc.).

---

## 5. Development Priorities & Technical Considerations
*   **Unlayer API Integration:** Essential for the Host side. Must be seamless to ensure the friction for creating a landing page remains incredibly low.
*   **Role-Based Access Control (RBAC):** Distinct routing and permissions for Hosts vs. Customers via Google Auth.
*   **Rewards & Gamification Engine:** The points and referral system on the customer side is critical for the growth loop and building trust via verified social proof.
*   **Responsive Design:** Crucial for both interfaces, especially the B2C booking and B2B host management tools which may be accessed on the go.
