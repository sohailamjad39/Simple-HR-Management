# Simple HR Management System

A modern, full-stack HR Management System built with **React**, **Node.js**, **Express**, and **MongoDB**. Designed for small to medium-sized organizations, this application streamlines employee management, attendance tracking, leave processing, payroll, and system settings with a clean, intuitive, and responsive UI.

## 🌟 Overview

This HRMS provides a centralized platform for managing core HR operations with a focus on **real-time user experience**, **instant data loading**, and **seamless navigation**. The system eliminates unnecessary page reloads and ensures that all data updates are reflected instantly across the application.

## 🔧 Key Features

### 📊 Dashboard
- Real-time overview of total employees, active/inactive status, upcoming leaves, and quick actions.
- Dynamic recent activity feed showing actual system events (employee additions, leave approvals, etc.).
- Auto-refreshes in the background when data changes elsewhere.

### 👥 Employee Management
- Full CRUD operations for employees.
- Search, filter by department/status, and sort capabilities.
- Instant load with background sync using `localStorage` caching.
- Responsive table with quick actions (view, edit).

### 🕒 Attendance Tracking
- Daily attendance logging with manual entry support.
- Monthly attendance reports with export to CSV.
- Real-time updates — changes reflect instantly without refresh.
- Grace period, shift timings, and holiday management.

### 📅 Leave Management
- Apply, approve, and manage employee leaves.
- Filter by employee, status, date range, and leave type.
- Delete confirmation via modal.
- Auto-syncs with dashboard and attendance.

### 💰 Payroll System
- View salary details (basic, allowances, deductions).
- Generate and manage payslips per employee.
- Export payslip history to CSV.
- Real-time updates when salary rules or attendance changes.

### ⚙️ Settings
- **Department & Designation Management**: Add, edit, delete departments and job titles.
- **Leave Types**: Configure paid/unpaid leave types with annual limits and carry-forward rules.
- All settings use **instant load + background refresh** pattern.

## 🚀 User Experience

- **No Page Reloads**: Navigate freely — data stays fresh.
- **Instant Load**: Cached data shows immediately; fresh data loads in background.
- **Event-Driven Updates**: Uses `window.dispatchEvent("data-updated")` to sync components.
- **Offline-Friendly**: Critical data cached in `localStorage`.
- **Responsive Design**: Works seamlessly on desktop and mobile.
- **Glassmorphic UI**: Modern, clean interface with backdrop blur and subtle shadows.

## 🛠️ Technology Stack

- **Frontend**: React (Vite), Tailwind CSS, React Router
- **Backend**: Node.js, Express
- **Database**: MongoDB (Mongoose)
- **Authentication**: JWT (JSON Web Tokens)
- **State Management**: React Hooks (`useState`, `useEffect`)
- **API Client**: Axios with interceptors for auth
- **UI Components**: Custom modals, toast notifications, confirmation dialogs

## 🔄 Real-Time Data Flow

Instead of polling or WebSockets, the system uses a lightweight **event-driven architecture**:
- After any data change (add employee, approve leave, etc.), `window.dispatchEvent(new Event("data-updated"))` is fired.
- All relevant components listen for this event and refresh their data silently.
- This ensures **real-time feeling UX** without complexity.

## 📦 Data Persistence

- All critical lists (employees, leaves, attendance, settings) are cached in `localStorage`.
- On revisit, cached data is shown instantly while fresh data is fetched in the background.
- Ensures fast load times and offline usability.

## 🧩 Reusable Components

- `SuccessToast` / `ErrorToast`: Non-blocking feedback.
- `ConfirmModal`: Replaces `window.confirm()` with styled modal.
- `Add/Edit Modals`: Consistent UX across modules.
- `SearchFilterBar`: Unified search and filter interface.

## 🎯 Target Users

- HR Managers

## 📄 License

MIT License — Free to use, modify, and distribute.

## 🙌 Final Note

This HRMS is built for **simplicity**, **speed**, and **reliability**. It’s not just a CRUD app — it’s a production-ready tool that feels fast, stays in sync, and respects the user’s time.