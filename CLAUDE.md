# Editorial Task Manager

## Project Overview
A feature-rich editorial task manager built with React, TypeScript, and Dexie.js (IndexedDB). Trello-class project management with a paper/editorial design aesthetic.

## Tech Stack
- **React 19** + TypeScript 5.9
- **Vite 7** — build tooling
- **Dexie.js** — IndexedDB wrapper with `useLiveQuery` reactivity
- **Tailwind CSS 3** — utility-first styling with custom design tokens
- **Framer Motion** — animations
- **@hello-pangea/dnd** — drag and drop
- **Lucide React** — icons
- **date-fns** — date formatting

## Architecture

### Data Layer
All data is persisted in IndexedDB via Dexie.js. The database singleton is in `src/database/db.ts`. First-load seeding happens in `src/database/seed.ts` (inside a transaction to prevent React StrictMode double-seeding).

Entity types are defined in `src/types/database.ts`:
- Projects > Boards > Columns > Tasks (hierarchical)
- Labels, Attachments, ChecklistItems, Comments, Activities, Notifications, Templates

### Hooks
Each entity has a repository hook in `src/hooks/`:
- `useProjects`, `useBoards`, `useColumns`, `useTasksDB` — CRUD + reorder
- `useLabels`, `useAttachments`, `useChecklist`, `useComments` — task relations
- `useActivities`, `useNotifications`, `useTemplates` — supporting features
- `useKeyboardShortcuts` — global keyboard handling

### Key Pattern: useLiveQuery Type Annotations
When `useLiveQuery` can return `Promise.resolve([])` (empty fallback), you MUST annotate the return type to avoid `never[]` inference:
```ts
// CORRECT
const items = useLiveQuery(
  (): Promise<DBItem[]> => {
    if (!id) return Promise.resolve([])
    return db.items.where('parentId').equals(id).toArray()
  },
  [id]
) ?? []

// WRONG - results in never[] type
const items = useLiveQuery(
  () => {
    if (!id) return Promise.resolve([])
    return db.items.where('parentId').equals(id).toArray()
  },
  [id]
) ?? []
```

### Components
- **Views**: KanbanBoard, ListView, CalendarView, TimelineView
- **Task Detail**: Tabbed panel (Overview, Checklist, Attachments, Comments, Activity)
- **Sidebar**: Project accordions with nested boards, navigation links
- **Header**: Breadcrumb, 4-view switcher, search, sort, filter
- **Overlays**: AddTaskModal, LabelEditorModal, KeyboardShortcutsOverlay

### Styling
Custom design tokens in `tailwind.config.js` and `src/index.css`:
- Backgrounds: `primary`, `secondary`, `tertiary`, `card-bg`
- Text: `text-primary`, `text-secondary`, `text-muted`, `text-hint`, `text-ghost`
- Accent colors: 5 themes (vermillion, ocean, amethyst, rose, emerald)
- Light/dark mode with system preference detection

## Commands
```bash
npm run dev      # Start dev server (Vite)
npm run build    # TypeScript check + Vite build
npm run preview  # Preview production build
```

## File Structure
```
src/
  App.tsx                    # Root: state management, view switching
  main.tsx                   # Entry: ThemeProvider + ToastProvider
  index.css                  # Design tokens, theme variables
  types/
    index.ts                 # Priority, TaskStatus, ViewMode
    database.ts              # All DB entity types
    theme.ts                 # Theme types + accent configs
  database/
    db.ts                    # Dexie schema + singleton
    seed.ts                  # Initial data seeding
  hooks/                     # 14 repository hooks
  components/                # 20+ components
  context/
    ThemeContext.tsx          # Light/dark/system + accent
    ToastContext.tsx          # Toast notifications
  utils/
    priorities.ts            # Priority display config
  data/
    mockData.ts              # Legacy (kept for reference)
```
