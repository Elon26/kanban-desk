# Kanban Task Manager (Client App)

A modern, high-performance client application for task planning and project organization using a Kanban board approach.

---

## 🗂 About the Project

The application is designed for users who prefer visual task management using a flexible Kanban workflow, allowing them to organize tasks into columns, manage custom statuses, and track progress interactively.

The project focuses on complex UI/UX interactions, smooth drag-and-drop mechanics, and predictable state management.

---

## 🧰 Tech Stack

**Framework & Core**
- React Native / Component-Driven Architecture
- TypeScript

**State & Local Storage**
- react-native-mmkv (local-first storage, no backend)

**Infrastructure & Services**
- Firebase (Storage, Remote Config)
- Sentry, Apphud

**UI & Styling**
- Tailwind CSS (NativeWind)
- react-native-reanimated
- i18n (localization)

**Tooling**
- ESLint, Prettier

---

## ✨ Key Features & Highlights

- **Task & Workflow Management:** Create, edit, and organize tasks with custom statuses, tags, and multi-level filtering.
- **Interactive Kanban Board:** Fluid column-based workspace with drag-and-drop task movement.
- **Smart Reminders:** Scheduled notifications and time-based tracking.
- **Advanced Filtering & Search:** Instant search and multi-section filtering across dense data sets.
- **Offline-First Architecture:** Fast local data persistence using MMKV without relying on a remote backend.
- **Monetization & Analytics:** Integrated subscriptions (Apphud), crash reporting (Sentry), and feature flags (Remote Config).

---

## 👨‍💻 Role & Engineering Contributions

- Designed and implemented the complete application architecture from scratch.
- Developed complex Kanban board interactions, custom column logic, and fluid drag-and-drop mechanics.
- Built performance-optimized UI components capable of handling frequent state updates and gesture handling.
- Integrated third-party SDKs for analytics, monitoring, and in-app purchases.

---

## 🚀 Local Setup

Clone the repository and install dependencies to run the project locally:

```bash
# Clone the repository
git clone https://github.com/Elon26/kanban-desk.git

# Install dependencies
npm install

# Run the project
npm run start
