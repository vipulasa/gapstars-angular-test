# GS Angular Test

This project is a fully functional **Todo Management Application** built using **Angular 19**.  
It demonstrates clean architecture, reusable components, form handling, filtering via pipes, and reactive UI updates using Angular best practices.

---

## ⚙️ Tech Stack

- **Framework:** Angular 19.2.7
- **Language:** TypeScript
- **UI Styling:** TailwindCSS
- **State Management:** Local component state + BehaviorSubject
- **Forms:** Template-driven forms using `NgForm`
- **Testing:** Jasmine + Karma
- **Architecture:** Standalone components, modular services, custom pipes

---

## 📁 Project Structure Overview

```
src/
├── app/
│   ├── models/               # Interfaces like TodoModel
│   ├── services/             # TodoService - handles data and persistence
│   ├── filters/              # todoFilter.pipe.ts - filters & sorts todos
│   ├── add-todo/             # Reusable modal component to add a task
│   ├── todo/                 # Main UI for listing, searching, sorting
│   └── app.component.ts      # Root shell
├── assets/
└── index.html
```

---

## ✅ Features Completed

### 📋 Todo Management

- Add, delete, update tasks
- Mark tasks as complete/incomplete
- Each task includes:
  - Title
  - Priority (Low/Medium/High)
  - Recurrence (None/Daily/Weekly/Monthly)
  - Dependencies (a task can depend on others)

### 🔍 Filtering & Sorting

- Search tasks by title
- Sort by:
  - Priority (High → Low)
  - Completion Status (Incomplete → Complete)
- Custom pipe `todoFilter` used for filtering + sorting

### ♻️ Dependency Handling

- A task **cannot be completed** unless all its dependencies are done
- A task **cannot be deleted** if it's a dependency of another task

### 🧠 Persistent State

- Tasks are **persisted in localStorage**
- State is auto-restored on page refresh

---

## 🔪 Testing

### Unit Tests

- Services tested with mocked localStorage
- Component logic tested (add, delete, toggle)
- Custom pipes tested for edge cases and behavior

To run tests:

```bash
ng test
```

> Ensure you have Chrome installed (used by Karma test runner)

---

## 🏗️ How to Set Up the Project (Step-by-Step)

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/gapstars-angular-test.git
cd gapstars-angular-test
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Run the App

```bash
ng serve
```

Navigate to: [http://localhost:4200](http://localhost:4200)

### 4. Run Unit Tests

```bash
ng test
```

---

## 🧱️ Angular Architectural Highlights

### ✅ Standalone Components

- Angular 15+ standalone component structure used
- Example: `AddTodoComponent` is standalone and can be reused elsewhere

### ✅ Service with BehaviorSubject

- `TodoService` uses `BehaviorSubject` to manage and broadcast todo state reactively

### ✅ Custom Pipe

- `TodoFilterPipe` filters by search string and sorts by priority/status

### ✅ LocalStorage Integration

- Safe checks for browser environment
- Fallback to sample data if localStorage is unavailable

---

## 📌 Notes for Developers

- Priority colors:
  - High: 🔴 Red
  - Medium: 🟡 Yellow
  - Low: 🟢 Green
- Completed tasks are styled with a strikethrough and gray background
- Confirmation dialogs used to prevent accidental deletions
- Modular architecture makes this easy to extend into a larger productivity app

---

## 📚 Resources

- [Angular Docs](https://angular.dev/)
- [Angular CLI](https://angular.dev/tools/cli)
- [TailwindCSS](https://tailwindcss.com/)
- [RxJS Docs](https://rxjs.dev/)

