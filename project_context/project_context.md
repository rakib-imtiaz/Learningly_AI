
---

## project_context.md  
```markdown
# Software Requirements Specification (SRS)  
## Project: Learningly AI – AI-Powered Learning Platform  
**Date:** Aug 2025   |   **Version:** 1.0   |   **Authored by:** Learningly AI Product Team

---

### 1. Introduction

**1.1 Purpose**  
This SRS defines functional and non-functional requirements for Learningly AI, a web platform that auto-generates interactive study materials (summaries, quizzes, flashcards, chat tutoring) from user-provided content.

**1.2 Scope**  
Learningly AI supports document/video ingestion, AI content generation, study flows, and analytics for students, self-learners, and educators.

**1.3 Definitions**  
- **AI Tutor:** Context-aware chat assistant  
- **SRS:** Software Requirements Specification  
- **OCR:** Optical Character Recognition  
- **SRS:** Software Requirements Specification

---

### 2. Overall Description

**2.1 Product Perspective**  
Modular web app built with Next.js frontend, Node.js/API backend, Supabase storage, integrating OpenAI/Gemini/Novita.ai.

**2.2 User Classes**  
- **Students:** Generation → practice → track  
- **Self-learners:** Content mixing → structured paths  
- **Educators:** Bulk generation → assignment → monitoring  
- **Admins:** Platform management

**2.3 Assumptions**  
Stable Internet, 3rd-party AI APIs, GDPR-compliant data handling.

---

### 3. System Features

#### 3.1 Document & Video Ingestion  
- **FR-3.1.1**: Upload PDF/DOCX/PPTX/TXT ≤50 MB in ≤20 s  
- **FR-3.1.2**: YouTube URL import → caption transcript in ≤30 s  

#### 3.2 Summaries  
- **FR-3.2.1**: Outline, ELI6, Key-Points modes with citations  
- **FR-3.2.2**: Export PDF in ≤5 s  

#### 3.3 Quizzes  
- **FR-3.3.1**: Generate 10-50 Qs with difficulty levels  
- **FR-3.3.2**: Adaptive selection by past performance  

#### 3.4 Flashcards  
- **FR-3.4.1**: Auto-generate term↔definition with cloze  
- **FR-3.4.2**: Spaced repetition scheduler  

#### 3.5 AI Tutor Chat  
- **FR-3.5.1**: Context-grounded responses, ≥90% citation rate  
- **FR-3.5.2**: Suggested follow-up prompts  

#### 3.6 Analytics & Reporting  
- **FR-3.6.1**: DAU/WAU metrics, quiz accuracy trends  
- **FR-3.6.2**: Export CSV/PDF reports  

---

### 4. External Interfaces

**4.1 UI:** Responsive web dashboard  
**4.2 APIs:** OpenAI, Google Gemini, Novita.ai, YouTube Transcript  
**4.3 Storage:** Supabase DB + Storage, Upstash Redis  

---

### 5. Non-Functional Requirements

- **Performance:** p95 latency <30 s for generation flows  
- **Availability:** 99.9% uptime  
- **Security:** AES-256 at-rest/in-transit, role-based access  
- **Accessibility:** WCAG 2.1 AA compliance  
- **Scalability:** Support 10k concurrent users  

---

### 6. Future Enhancements

- Collaborative study rooms  
- Mobile native apps (iOS/Android)  
- LMS integrations (Canvas, Moodle)  
- Custom model training

---

## Appendix

**A. Sample Quiz Flow**  
**B. SRS Change Log**  
