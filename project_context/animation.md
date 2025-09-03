Learningly AI – Consolidated Project Documentation

This document collates three key artifacts for Learningly AI in the same formats as the provided templates:

Animation Guide (based on animation.md)

Software Requirements Specification (SRS) (based on project_context.md)

UI Documentation (based on UI_context.md)

1. Learningly AI Animation Guide: Integrating React Bits & Framer Motion

Purpose: Define a consistent, high-performance, and brand-aligned animation strategy for Learningly AI, using React Bits components and Framer Motion primitives.

1.1 Core Animation Principles

Purposeful Motion: Every effect must clarify state changes (e.g., upload progress, generation in-flight) or delight users (e.g., study streak confetti).

Subtle Elegance: Keep animations under 300 ms, avoid jarring transitions.

Performance First: Aim for 60 fps; respect useReducedMotion.

Brand Alignment: Use primary (#667eea), secondary (#764ba2), accent (#ff6b6b), neutrals (#f5f5f5, #333) palette.

Responsiveness: Ensure smooth behavior across Desktop, Tablet, Mobile breakpoints.

Accessibility: Provide toggles for reduced motion; use aria-live for dynamic content updates.

1.2 Section-by-Section Recommendations

1.2.1 Hero Section (Landing & Dashboard)

Goal: Convey instant personalization and AI power.

Background: Aurora with colorStops = ["#667eea","#764ba2"].

Headline: Wrap in <FadeContent blur> then <Bounce> to reveal main tagline.

Subcopy & CTA: Use <AnimatedContent direction="vertical">, then <ClickSpark> + <StarBorder> for “Start Learning Now”.

<Aurora colorStops={["#667eea","#764ba2"]} />
<FadeContent blur>
  <Bounce><h1>Learn Smarter with AI</h1></Bounce>
  <AnimatedContent direction="vertical">
    <p>Auto-generate quizzes, summaries, flashcards in seconds.</p>
    <ClickSpark sparkColor="#ff6b6b" sparkCount={20}>
      <StarBorder>
        <button>Start Learning Now</button>
      </StarBorder>
    </ClickSpark>
  </AnimatedContent>
</FadeContent>

1.2.2 Feature Cards Section

Goal: Showcase core features as users scroll.

Container: Use AnimatedContent with direction="horizontal" distance={100}.

Card Title: Wrap in <Bounce>.

Icon Hover: <Pulse> on feature icon when in view.

<AnimatedContent direction="horizontal" distance={100}>
  <Bounce><h2>Smart Summaries</h2></Bounce>
  <Pulse><img src="/icons/summary.svg" alt="" /></Pulse>
</AnimatedContent>

1.2.3 Study Flow Demo

Goal: Demonstrate Quiz & Flashcard interactions live.

Quiz Button: <ClickSpark> on “Try Quiz” button.

Flashcard Flip: <FlipCard> for term-definition.

<ClickSpark sparkColor="#667eea">
  <button>Try Quiz</button>
</ClickSpark>
<FlipCard front="What is AI?" back="Artificial Intelligence..." />

1.2.4 Progress Feedback

Goal: Celebrate user milestones.

Confetti: Custom <Confetti> component triggered on streak milestones.

Toast: <ToastContainer> with sliding in messages “You hit a 7-day streak!”.

1.3 Implementation Notes

Framer Motion: Core for custom keyframe sequences.

React Bits: Use primitives (FadeContent, Bounce, AnimatedContent, ClickSpark, FlipCard).

Tailwind CSS: Utility classes for responsive breakpoints, theme tokens.

Performance: shouldReduceMotion hook to disable non-essential animations.

2. Software Requirements Specification (SRS)

Project Title: Learningly AI – AI-Powered Learning PlatformDate: Aug 2025Version: 1.0Prepared by: Learningly AI Product Team

2.1 Introduction

2.1.1 Purpose: Define functional and non-functional requirements for Learningly AI, which transforms learning content into interactive study aids.

2.1.2 Scope: Covers document ingestion, AI generation (summaries, quizzes, flashcards), chat assistant, study tools, analytics, and platform integrations.

2.1.3 Definitions:

AI: Artificial Intelligence

SRS: Software Requirements Specification

FR: Functional Requirement

UI: User Interface

UX: User Experience

2.2 Overall Description

2.2.1 Product Perspective: Web-based platform (Next.js + Node.js), integrating OpenAI, Google Gemini, Novita.ai.

2.2.2 User Classes:

Students (HS–Uni)

Self-learners

Educators

Institutions / Corporate L&D

2.2.3 Assumptions & Dependencies:

Internet required

Third-party AI APIs availability

Supabase for storage, Redis for caching

2.3 System Features

2.3.1 Document Processing & Upload

FR-1: Support PDF, DOCX, PPTX, TXT (≤50 MB). Extraction latency ≤20 s.

FR-2: YouTube transcript import with captions or ASR fallback.

2.3.2 Smart Summaries

FR-3: Styles: Outline, ELI6, Key Points. Diagram block via Mermaid. Export PDF.

2.3.3 Interactive Quizzes

FR-4: 10–50 Q; difficulty bands; MCQ/TF/Short Answer. Adaptive filter.

FR-5: Score analytics & review.

2.3.4 Smart Flashcards

FR-6: Auto-generated cards; cloze support; SRS scheduling; retention curves.

2.3.5 AI Chat Assistant

FR-7: Context-aware chat over uploaded content; inline citations.

2.3.6 Study Tools

FR-8: Quick Notes (3-min recap).

FR-9: Meme Generation (toggleable).

FR-10: Personalized study plans & mock tests.

2.4 External Interface Requirements

UI: Responsive web dashboard, modals, chat interface.

API: OpenAI, YouTube Transcript, ConvertAPI.

Storage: Supabase, Redis.

2.5 Non-Functional Requirements

Performance: p95 gen latency ≤30 s.

Availability: 99.9% uptime.

Security: AES-256 encryption; GDPR/CCPA compliance.

Accessibility: WCAG 2.1 AA.

2.6 Future Enhancements

Mobile apps (iOS/Android)

Collaborative study sessions

LMS connectors

Multilingual UI

2.7 Appendices

A: Sample user flows

B: Data retention policy

3. UI Documentation for Learningly AI

3.1 Overview

Clean, intuitive two-column layout with collapsible sidebar and main content area. Built with Next.js, Tailwind CSS, Radix UI.

3.2 Responsive Layout

Desktop: Sidebar (250px) + Main content (auto).

Tablet: Sidebar collapsible to icons (50px).

Mobile: Top nav + hamburger menu.

3.3 Global Components

3.3.1 Side Panel

Width: 250px (expanded), 50px (collapsed).

Items: Dashboard, Upload, My Progress, Chat, Settings.

Hover/bg: #764ba2 → lighten by 10%. Transition 300 ms ease.

3.3.2 Header

Height: 64px.

Left: Logo (120×32).

Center: Nav links spaced 24px.

Right: Profile avatar (40px) → dropdown.

3.3.3 Footer

Height: 80px.

Links: Terms, Privacy, Help.

Bounce animation on brand tagline.

3.4 Pages & Key Elements

3.4.1 Dashboard

Hero banner with Aurora + CTA.

Stats cards (DAU, Sessions, Streaks) in grid (min-w: 280px).

Recent items carousel (3 visible).

3.4.2 Upload/Import Modals

Drag-drop zone (dashed border, #667eea) 360×180.

URL input (full width) + Fetch button (50×150).

3.4.3 Generation Screen

Toggles: Summary, Quiz, Flashcards, Notes (Radix Switch).

Sliders: #Quiz Q, Difficulty (Track height: 4px).

Generate CTA (disabled until at least one toggle).

3.4.4 Results Grid

Responsive grid, gap: 20px.

Card: shadow-md, rounded-lg. Header: icon + title. Body: preview text. Footer: Open/Edit/Export.

3.4.5 Study Flows

Quiz: Full-screen modal, progress bar (height: 6px), Next/Skip icons.

Flashcards: StackCarousel, FlipCard on click, SRS buttons below.

Chat: Message list with Typewriter effect; input field (height: 48px).

3.5 Theming & Tokens

Colors: Primary: #667eea; Secondary: #764ba2; Accent: #ff6b6b; Neutral-100: #f5f5f5; Neutral-900: #111.

Spacing: base unit = 8px; multipliers (x2, x4).

Border Radius: md = 8px; lg = 16px.

Typography: Headings: Inter 600; Body: Roboto 400.

3.6 Interaction Patterns

Transitions: 200 ms ease for hover/focus.

Focus Rings: 2px solid accent.

Modals: Centered, width: 400px, backdrop opacity: 50%.

End of document.

