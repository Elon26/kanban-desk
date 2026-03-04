# kanban-desk

A commercial mobile application for task planning using a Kanban board approach.  
The app allows users to manage tasks with custom statuses and tags, schedule reminders, and visually track progress via drag-and-drop.

> Commercial project. Published on the App Store under a different name by the client’s request (public link is not available).

---

## 🗂 About the Project

The project is designed for users who prefer visual task management using a Kanban workflow.  
Users can create their own task statuses and tags, organize tasks into columns, and move tasks between statuses with drag-and-drop interactions.

The app focuses on smooth UI/UX, interactive task management, and offline-first data storage.

---

## 🧰 Tech Stack

**Framework / Platform**
- React Native  
- TypeScript  

**State / Storage**
- react-native-mmkv (local storage, no backend)

**Infrastructure & Services**
- Firebase Storage
- Firebase Remote Config
- Sentry  
- Apphud  
- Facebook SDK  

**UI / UX**
- Tailwind (NativeWind)  
- react-native-reanimated  
- i18n (localization)

**Tooling**
- ESLint  
- Prettier  

---

## ✨ Key Features

- 📝 Task management:
  - create and edit tasks  
  - assign custom statuses and tags  
- 🗃 Visual grouping:
  - group tasks by status and tags  
  - customizable status columns  
- 🧲 Kanban board:
  - drag-and-drop to change task status  
  - visual columns for each status  
- ⏰ Reminders:
  - notifications for scheduled task time  
- 🖼 Device cleanup:
  - detect low-quality photos  
  - find duplicate photos  
  - clean up storage directly from the app  
- 👥 Duplicate contacts detection:
  - find contacts with similar names  
  - find contacts with duplicate phone numbers  
  - remove duplicates from the device  
- 🔐 Secure local vault:
  - store images, videos, and contacts  
  - restrict access from other apps  
- 🔑 Password generator & manager:
  - synced with the system password storage  
- 🌐 Internet speed test  
- 🔍 Search and filtering across multiple sections  
- 🎞 Smooth UI transitions and animated charts  
- 💾 Local-first data storage using MMKV (no backend)

---

## 👨‍💻 Role & Responsibilities

The project was implemented entirely by me:
- designed the application architecture;  
- implemented task management logic and Kanban board interactions;  
- built drag-and-drop UI and complex animations;  
- integrated notifications and local storage;  
- connected third-party services (analytics, crash reporting, monetization);  
- prepared the app for production release.

---

## 🧠 Challenges & Technical Decisions

- Implemented complex Kanban board interactions with smooth drag-and-drop animations.  
- Designed and implemented custom data visualizations and charts based on complex UI designs.  
- Ensured UI performance while handling a large number of task cards and frequent state updates.  
- Paid special attention to gesture handling and animation synchronization.

---

## 🚀 Local Setup

The project cannot be started without a .env file because it contains confidential keys and tokens.

Installation and run:

- npm install
- npm run start

---

## 🧪 Code Quality

- ESLint and Prettier are configured  
- No automated tests (manual QA by a dedicated tester)  
- Multiple environment variables are used for service configuration  

---

## 📌 Notes

This repository is intended to demonstrate architecture, UI complexity, and development approach.  
The production version is published in the App Store under a different name according to the client’s requirements.
