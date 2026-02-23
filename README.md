# 202 Tiketa Web App

A modern, fully-functional event ticketing platform built with **Nuxt 3**, **Vue 3**, **TypeScript**, **Tailwind CSS**, and **Pinia**. Features a stunning UI with glassmorphism effects, smooth animations, and a complete ticket booking flow.

![Tech Stack](https://img.shields.io/badge/Nuxt-3.8-00DC82?logo=nuxt.js)
![Vue](https://img.shields.io/badge/Vue-3.3-4FC08D?logo=vue.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-3178C6?logo=typescript)
![Tailwind](https://img.shields.io/badge/Tailwind-3.4-06B6D4?logo=tailwindcss)

## Features

### Core Functionality

- **Event Discovery**: Browse and search events with advanced filtering
- **Event Details**: View comprehensive event information with seat availability
- **Ticket Booking**: Apply for events with quantity selection
- **Payment Flow**: Stripe-style checkout with fake payment processing
- **Ticket Management**: View, share, and download tickets
- **Dashboard**: Manage all your applications and tickets

### Design & UI

- **Glassmorphism Cards**: Beautiful frosted glass effects with backdrop blur
- **Gradient Backgrounds**: Purple, pink, blue, and orange gradients
- **Smooth Animations**: Page transitions, hover effects, and micro-interactions
- **Responsive Design**: Mobile-first approach with breakpoints
- **Dark Theme**: Modern dark mode with accent colors

### Notifications

- **Toast Notifications**: Animated success/error/info messages
- **Notification Center**: Bell icon with dropdown panel
- **Scheduled Reminders**: Automatic reminders for upcoming events
- **Real-time Updates**: Live countdown timers

### Ticket System

- **QR Code Generation**: Dynamic QR codes for each ticket
- **PDF Download**: Generate and download tickets as PDF
- **Shareable Links**: Copy and share ticket links
- **Ticket Transfer**: Change holder name for gifting

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. **Clone or extract the project**

```bash
cd tiketa
```

2. **Install dependencies**

```bash
npm install
```

3. **Run development server**

```bash
npm run dev
```

4. **Open in browser**
   Navigate to `http://localhost:3000`

### Build for Production

```bash
npm run build
```

## 📁 Project Structure

```
tiketa/
├── assets/
│   └── css/
│       └── main.css          # Global styles & animations
├── components/
│   ├── AnimatedButton.vue    # Reusable animated button
│   ├── CountdownTimer.vue    # Live countdown component
│   ├── EmptyState.vue        # Empty state illustrations
│   ├── EventCard.vue         # Event card component
│   ├── Navbar.vue            # Navigation bar
│   ├── NotificationBell.vue  # Notification center
│   ├── SkeletonLoader.vue    # Loading skeletons
│   ├── TicketCard.vue        # Ticket display card
│   └── ToastContainer.vue    # Toast notifications
├── composables/
│   ├── useFakePayment.ts     # Payment simulation
│   ├── useNotifications.ts   # Toast notifications
│   └── useTicketGenerator.ts # PDF & QR generation
├── pages/
│   ├── index.vue             # Homepage
│   ├── dashboard.vue         # User dashboard
│   ├── events/
│   │   ├── index.vue         # Events list
│   │   └── [id].vue          # Event details
│   ├── checkout/
│   │   └── [id].vue          # Payment checkout
│   └── ticket/
│       └── [ticketId].vue    # Ticket display
├── stores/
│   ├── applications.ts       # Applications store
│   ├── events.ts             # Events store
│   └── notifications.ts      # Notifications store
├── types/
│   └── index.ts              # TypeScript types
├── app.vue                   # Root component
├── nuxt.config.ts            # Nuxt configuration
├── tailwind.config.js        # Tailwind configuration
└── package.json
```

## Tech Stack

### Core

- **Nuxt 3** - Vue framework with SSR/SSG
- **Vue 3** - Progressive JavaScript framework
- **TypeScript** - Type-safe JavaScript
- **Pinia** - State management

### Styling

- **Tailwind CSS** - Utility-first CSS framework
- **Custom CSS** - Animations & glassmorphism effects

### UI Components

- **Headless UI** - Accessible UI components
- **Heroicons** - Beautiful SVG icons

### Features

- **Canvas Confetti** - Celebration animations
- **jsPDF** - PDF generation
- **QRCode** - QR code generation
- **Date-fns** - Date formatting

## Pages

### `/` - Homepage

- Hero section with search
- Event filtering (price, date, category)
- Featured events showcase
- Statistics section

### `/events` - Events List

- All events with filters
- Category pills
- Sort options

### `/events/[id]` - Event Details

- Full event information
- Seat availability with progress bar
- Application form
- Price calculator

### `/checkout/[id]` - Payment

- Stripe-style credit card UI
- Order summary
- Fake payment processing
- Confetti animation on success

### `/dashboard` - User Dashboard

- Application statistics
- Tabbed view (All/Confirmed/Pending)
- Ticket cards with countdown

### `/ticket/[ticketId]` - Ticket Display

- QR code for scanning
- Ticket details
- Download PDF option
- Share functionality

## Design System

### Colors

- Primary: `#8b5cf6` (Purple)
- Accent Pink: `#ec4899`
- Accent Blue: `#3b82f6`
- Accent Orange: `#f97316`
- Background: `#0f0f23`

### Gradients

- Primary: `linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)`
- Blue: `linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)`
- Orange: `linear-gradient(135deg, #f97316 0%, #fb923c 100%)`

### Animations

- Page transitions: fade + slide
- Card hover: scale + glow
- Button press: ripple effect
- Loading: skeleton shimmer
- Success: confetti burst

## Data Persistence

The app uses **localStorage** for data persistence:

- Applications are saved automatically
- Notifications are stored locally
- Data persists across browser sessions

## 🔧 Configuration

### Nuxt Config (`nuxt.config.ts`)

```typescript
export default defineNuxtConfig({
  modules: ["@nuxtjs/tailwindcss", "@pinia/nuxt"],
  css: ["~/assets/css/main.css"],
  // ... more config
});
```

### Tailwind Config (`tailwind.config.js`)

Custom colors, animations, and glassmorphism utilities are defined here.

## Mock Data

The app comes with 12 pre-populated events:

- Afrobeats Summer Festival
- Tech Summit Nigeria
- Lagos Food & Wine Festival
- Free Coding Workshop
- Nollywood Movie Premiere
- Yoga & Wellness Retreat
- Startup Pitch Competition
- Contemporary Art Exhibition
- Comedy Night
- Marathon: Run Lagos
- Fashion Week Lagos
- Financial Literacy Seminar

## TypeScript Types

```typescript
interface Event {
  id: string;
  title: string;
  description: string;
  image: string;
  location: string;
  date: string;
  price: number;
  seats: number;
  category: string;
  organizer: string;
}

interface Application {
  id: string;
  eventId: string;
  userName: string;
  email: string;
  phone: string;
  quantity: number;
  status: "pending" | "paid";
  tickets: Ticket[];
  appliedAt: string;
}

interface Ticket {
  id: string;
  applicationId: string;
  holderName: string;
  qrCode: string;
  isUsed: boolean;
}
```

## Future Enhancements

- [ ] Real backend API integration
- [ ] User authentication
- [ ] Social login (Google, Twitter)
- [ ] Payment gateway integration (Paystack, Flutterwave)
- [ ] Email notifications
- [ ] Admin dashboard
- [ ] Event creation for organizers
- [ ] Reviews and ratings
- [ ] Wishlist/favorites
- [ ] Calendar integration

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Credits

- Icons by [Heroicons](https://heroicons.com/)
- UI inspired by Eventbrite, Stripe, and Linear
- Images from Unsplash

---

Built with ❤️ using Nuxt 3
