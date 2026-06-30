# Implementation Plan - Luxury Overhaul & Dedicated Categories Page

This plan details the design enhancements and architectural changes to transform the TAPHE Awards landing page into a state-of-the-art cinematic experience and add a dedicated categories dashboard.

---

## User Review Required

> [!IMPORTANT]
> The homepage layout will be upgraded to a sequence of interactive, highly-animated sections (Apple Keynote style). We will introduce a dedicated route (`/categories`) for the new luxury Categories and Nominees page, reducing categories list overload on the main landing page to 8 items max.

---

## Proposed Changes

### 1. Navigation & Routing (App Frontend)

#### [MODIFY] [app.tsx](file:///c:/xampp/htdocs/taphe_online/resources/js/app.tsx)
- Add route for `/categories` referencing `Pages/Categories.tsx`.
- Update navigation links and drawer items to point to `/categories` for comprehensive browsing.

#### [NEW] [Categories.tsx](file:///c:/xampp/htdocs/taphe_online/resources/js/Pages/Categories.tsx)
- Create a premium standalone dashboard for exploring category listings.
- Features category search, category groups, nominee cards, and direct connection to the `VoteModal` flow.

---

### 2. Homepage Upgrades

#### [MODIFY] [Welcome.tsx](file:///c:/xampp/htdocs/taphe_online/resources/js/Pages/Welcome.tsx)
- **Voting Arena (Left Column)**: Limit categories array to the first 8 items. Append a stylish button `"More Categories..."` routing to `/categories`.
- **THIRD SECTION (Award Categories Grid)**:
  - Create a premium section featuring horizontal category showcase cards.
  - Implement white-glass panels, image zoom on hover, and active red shadow glows.
- **FOURTH SECTION (Timeline)**:
  - Replace the current horizontal timeline block with a custom vertical interactive timeline.
  - Add scroll-triggered entry animations (fade & slide) using Framer Motion.
- **FIFTH SECTION (Past Winners Slider)**:
  - Add a large cinematic carousel showing achievements and past winners.
  - Features smooth transition slides, fullscreen aspect background images, and minimalist overlay cards.
- **SIXTH SECTION (Sponsors Marquee)**:
  - Upgrade the marquee ticker to show glassified sponsor logos on a dark luxury backdrop with interactive scale-up hover details.
- **SEVENTH SECTION (Gallery Masonry & Lightbox)**:
  - Implement a dynamic masonry layout for public event photos.
  - Integrate a custom image Lightbox overlay (modal overlay showing clicked high-res image with close controls).
- **LAST SECTION (Call To Action)**:
  - Build an elegant, high-impact CTA section with clean, luxury typography and a single prominent action button to book Gala tickets or Nominate.

---

## Verification Plan

### Automated Tests
- Run `npm run build` to verify compiling of all TypeScript JSX pages and routing dependencies.
- Run `php vendor/phpunit/phpunit/phpunit` to ensure backend routes are fully functional.

### Manual Verification
- Visual inspection of the custom timeline scrolling animations and lightbox image modal.
- Test categories page navigation and ensure limits of 8 entries work correctly.
