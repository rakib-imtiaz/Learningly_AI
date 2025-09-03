# Learningly AI – UI Design Documentation

## 1. Overview  
Front-end built with Next.js, Tailwind CSS, React Bits, Radix UI, Jotai.

---

## 2. Layout & Navigation

### 2.1 Global Shell  
- **Header:** Logo → Dashboard, Features, Pricing, Login/Signup  
- **Footer:** Links (Terms, Privacy), Social Icons, Bounce-animated tagline  

### 2.2 Responsive Breakpoints  
- **Desktop:** Sidebar + main  
- **Tablet:** Collapsible nav  
- **Mobile:** Hamburger menu + stacked content

---

## 3. Core Screens & Components

### 3.1 Hero (Landing)  
- **Aurora** bg, **FadeContent + Bounce** headline, **AnimatedContent** subhead, **StarBorder + ClickSpark** CTA  

### 3.2 Features Grid  
- **AnimatedContent** on scroll, **Bounce** titles, **Pulse/Glow** icons  

### 3.3 Upload Modal  
- Drop-zone: **Pulse** border on hover, **Shake** on error  
- URL import: spinner + confetti on success  

### 3.4 Generation Selector  
- Toggles: `<Switch>` animated via **SlideToggle**  
- Sliders: `<RangeSlider>` for quiz count/difficulty  
- Generate button disabled→enabled with **FadeContent**

### 3.5 Results Dashboard  
- Responsive **Card** grid with **FadeContent** mount  
- Card actions: Open, Edit (`<Pencil>` icon, **ClickSpark**), Export PDF  

### 3.6 Study Flows  
- **Quiz:** `<Slide>` questions, `<ProgressBar>`, result charts  
- **Flashcards:** `<FlipCard>`, difficulty buttons with **ClickSpark**  
- **Chat:** `<Typewriter>` bubbles, “Use document” `<Switch>`, suggestion chips  

---

## 4. Admin & Educator Views  
- Class list: sortable **Table**  
- Batch upload: multi-drop with `<ProgressBar>`  
- Analytics: **LineChart**, **BarChart**, **Heatmap**

---

## 5. UI States & Feedback  
- **Loading:** `<Spinner>` + `<SkeletonCard>`  
- **Empty:** Illustration + CTA button  
- **Toasts:** `<ToastContainer>` slide-in  
- **Global Errors:** full-screen modal

---

## 6. Styling & Tokens  
- **Colors:** primary `#667eea`, accent `#ff6b6b`, neutral `#f3f4f6`/`#1a202c`  
- **Spacing:** 4 px base, 8/16/24 increments  
- **Radius:** `rounded-md`, `rounded-full`  
- **Typography:**  
  - Headings: Inter 700  
  - Body: Roboto 400  

---

## 7. Accessibility & Theming  
- Focus rings on all actionable elements  
- Dark/Light mode toggle (persist in localStorage)  
- `prefers-reduced-motion` support via Tailwind utilities

---
