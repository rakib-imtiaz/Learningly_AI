# Learningly – Product Specification Document

## 1. Product Overview

Learningly is an AI-based all-in-one academic platform that replaces fragmented study resources with a unified platform. It includes tools for reading, writing, problem-solving, custom search, and exam preparation—all designed to be affordable, fast, and accessible.

**Core modules:**
- Reading tools
- Writing assistant tools
- Solver (problem-solving tools)
- Customized AI search
- Exam preparation & test generation
- User account system with subscription packages
- Admin dashboard for platform management

---

## 2. Target Platforms

- **Web app** (initial version)—mobile-friendly
- **Future:** Mobile apps (iOS, Android)

---

## 3. User Roles

- **Free user:** limited features & daily usage caps
- **Premium user:** full access to all features, higher limits
- **Admin:** manage users, subscriptions, and content

---

## 4. Feature Breakdown

### 4.1 Reading Module

**Purpose:** Help users consume study materials faster and retain more.

**What will it do?**  
You can upload any type of content (files), like PDF, DOCX, DOC, a link to Google articles, or a YouTube video link, and it will generate smart summaries, notes, flashcards, quizzes, and memes.

**Features:**
- PDF/Links/Document Reader with highlighting
- AI-powered summarization (short/medium/detailed summaries)
- Note generation
- Flashcard generation (auto-create Q&A flashcards from document)
- Quizzes from text (MCQ, short answer)
- AI explanations for highlighted sections
- Citation generator

**Inputs:**  
PDF, DOCX, etc., pasted text, or URL

**Outputs:**
- Summary (with Flowchart)
- Notes
- Flashcards
- Quiz sets
- Memes

> **Difference Between Summaries & Notes:**  
> Summaries are just summaries of the entire files. You will even get annotations and flowcharts as well; however, notes will be one line long, and the things mostly not covered in the summary parts (like a formula, date, simple definition, etc.)

---

### 4.2 Writing Module

**Purpose:** Assist with academic writing and editing. Any type!

**Action:**  
A person can solve all the writing-related problems in the writing part. The grammar checking part must be like Grammarly (you can clone that too!). You will upload/paste your writings, and it will give you suggestions with a bit of explanation, which you can accept or deny. In the paraphrasing part, it should be like QuillBot; you can paraphrase based on your preferences (formal, fluent, academic, standard, etc.). After getting the paraphrased version, you can still modify a sentence or word with synonyms (it will give you the options).

**Features:**
- Grammar & spelling checker
- Paraphraser (multiple tone options: academic, casual, concise, expanded—Check QuillBot for options.)
- Humanizer (rewrite AI-sounding text to human-like style)
- AI & Plagiarism checker
- Personalized Essay writer (draft generation—you’ll upload)

---

### 4.3 Solver Module

**Purpose:** Help students solve problems step-by-step.

**It will have:**
- Math problem solver (with LaTeX rendering)
- Science problem solver
- Step-by-step explanations (It will not exaggerate like ChatGPT—Just step-by-step solutions with short notes on the right side.)
- Multiple-choice question solver (shows reasoning)
- Equation plotting
- Homework help (pasted question → detailed answer)

---

### 4.4 Customized AI Search

**Purpose:** Replace generic Google searches with customized AI answers.

**Features:**
- Search bar trained day by day by the way someone wants their content (like ChatGPT)
- Filter by subject
- Source citation (It will generate links to the sources)
- Follow-up question handling
- Quick facts mode (short answers)
- Deep dive mode (detailed explanations)

> _It will have all the features like ChatGPT; it will also have a project option like ChatGPT that will allow you to separate specific searches._

---

### 4.5 Exam Preparation

**Purpose:** Let users prepare for exams quickly and efficiently with more full-length practice questions like the ones the professors give before the midterms and finals.

**Action:**  
The users will upload all the lecture files of the professors, and then they will upload sample/past questions given by professors (professors give 1/2/3 sample questions before exams). The model will understand the professor's teaching style and question-making style. It will then produce 10-20 full-length PDF questions. (Give the students the option to choose how many PDFs they want.)

**Features:**
- Custom test generator (choose topic, types (MCQ/CQ/etc.), number of questions)
- AI solutions for each question
- Study plan generator
- Progress tracking dashboard

---

### 4.6 Home Bar

The Home Bar will have two things:

- **Dashboard:** Tracks your weak points (e.g., mistakes in quizzes or repeated questions about a particular topic). It will understand this and provide resources for this. It will also show your weekly study report (with gamification).
- **Calendar:** Save all your things. For example, you can upload your syllabus for the 4 courses you are taking this semester, and it will make your class routines for every day of the semester—you don’t need to manually add this! (You can connect Google Calendar with this calendar as well!)

---

## 5. Business Logic (Packages & Limitations)

### 5.1 Free Plan

- Limited uploads (e.g., 3 documents/week)
- Reading part access is limited to 2 per week (e.g., 1000 words per request)
- Writing part (3/week for every section)
- Limited AI search queries/day (20/week)
- Ads in UI (optional—got from ChatGPT)

### 5.2 Premium Plan

- Unlimited usage
- Priority AI processing
- Access to advanced tools (e.g., plagiarism checker, mock exams)

### 5.3 Admin Features

- Add/edit subscription packages
- Monitor user activity
- Manage content & AI models
- Change feature access per plan
- Export analytics

---

## 6. Integrations

- **Supabase:** Auth, database, storage
- **OpenAI API:** Core AI processing (GPT models)
- **Third-party APIs:** Plagiarism detection, citation formatting
- **Stripe:** Payments & subscription management

---

## 7. Data Structure

**Database tables:**
- Users
- Subscriptions
- Documents
- Generated content (summaries, flashcards, quizzes, essays)
- Test results
- Admin actions

---

## 8. UI/UX Flow

1. User signs up (email/password, Google login, or Apple login)
2. Dashboard – shows modules
3. User clicks Home, Reading, Writing, Solver, Search, or Exam Prep
4. Upload text/file or type prompt
5. AI processes → Result displayed → Save to account
6. User can review saved work anytime
7. Premium upsell prompts for free users
8. Admin can log in to separate dashboard

---

## 9. Security

- Role-based access control
- Data encryption at rest & in transit
- API key security
- Rate limiting to prevent abuse

---

## 10. Future Features

- Collaborative study rooms
- Mobile app with offline mode
- AI tutor chatbot
- Speech-to-text lecture note converter
- Video-to-notes tool
