# @ippis/app-layout-theme

A modern, feature-rich React component library built with TypeScript, Tailwind CSS, and Radix UI. This library provides a complete application shell (`AppShell`) with sidebar navigation, top bar, user menu, and more.

## Features

- **Modern Design**: Built with Tailwind CSS and Radix UI primitives
- **Responsive**: Mobile-first design with responsive sidebar
- **Theme Support**: Built-in light / dark / white mode toggle
- **Accessible**: Built on Radix UI for full accessibility support
- **TypeScript**: Fully typed for a better developer experience
- **Customizable**: Highly configurable with props and theming options

---

## Table of Contents

- [Installation](#installation)
- [Tailwind CSS & shadcn — What You Need to Know](#tailwind-css--shadcn--what-you-need-to-know)
- [Quick Start](#quick-start)
- [API Reference](#api-reference)
  - [AppShell Props](#appshell-props)
  - [Type Definitions](#type-definitions)
- [DemoBlock](#demoblock)
- [Examples](#examples)
- [Styling](#styling)
- [TypeScript](#typescript)
- [Browser Support](#browser-support)
- [Publishing](#publishing)

---

## Installation

```bash
npm install @ippis/app-layout-theme
# or
yarn add @ippis/app-layout-theme
# or
pnpm add @ippis/app-layout-theme
```

### Peer Dependencies

```bash
npm install react react-dom react-router-dom
```

Supported versions: React 18+, React Router DOM 6 or 7.

---

## Tailwind CSS & shadcn — What You Need to Know

### Do I need Tailwind CSS?

**Short answer: yes, if you want to extend or customize the design tokens in your own components.**

The library ships a pre-compiled stylesheet (`dist/style.css`) that contains all component styles. If you only use the shell and UI components as-is, you just need to import that file — no Tailwind installation required in your own project.

However, if you want to:
- Use the library's design tokens (e.g. `bg-primary`, `text-foreground`, `text-ds-sm`) inside your own components
- Override colors via Tailwind config
- Write Tailwind classes that pick up the library's CSS variable system

…then you **must** have Tailwind CSS configured in your project and include the library's `dist/` folder in the `content` array so the JIT compiler scans it.

### Do I need shadcn/ui?

**No. This library does not use or require shadcn/ui.**

All UI primitives are built directly on top of **Radix UI** with custom Tailwind styling. You do not need to run `npx shadcn@latest init` or install the shadcn CLI. Everything is bundled inside `@ippis/app-layout-theme`.

If your project already uses shadcn/ui, the two libraries can coexist without conflict because the component names are scoped inside this package.

---

## Quick Start

### 1. Import the Stylesheet

In your app's entry file, import the library's compiled CSS **before** your own styles:

```tsx
// src/main.tsx or src/index.tsx
import "@ippis/app-layout-theme/dist/style.css";
```

This single import brings in all component styles, design tokens (CSS custom properties), and theme support. No additional configuration is needed if you are not using Tailwind.

### 2. (Optional) Configure Tailwind

If you want to use the library's design tokens inside your own Tailwind-powered components, install and configure Tailwind first:

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

Then add the library's `dist/` folder to the `content` array so Tailwind scans it:

```js
// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    // Add this so Tailwind picks up tokens used inside the library
    "./node_modules/@ippis/app-layout-theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Extend with the library's color tokens if needed
      colors: {
        primary:    "hsl(var(--primary))",
        secondary:  "hsl(var(--secondary))",
        foreground: "hsl(var(--foreground))",
        background: "hsl(var(--background))",
      },
    },
  },
  plugins: [],
};
```

> You do **not** need `tailwindcss-animate` or any plugin the library uses internally — those are compiled into `dist/style.css` already.

### 3. Wrap Your App in BrowserRouter

The shell uses React Router for active-link detection. Wrap your app in a `BrowserRouter` (or your own router):

```tsx
// src/main.tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "@ippis/app-layout-theme/dist/style.css";
import App from "./App";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
```

### 4. Use the AppShell Component

```tsx
import { AppShell } from "@ippis/app-layout-theme";
import type { ShellMenuItem } from "@ippis/app-layout-theme";
import { LayoutDashboard, Users, Settings } from "lucide-react";

function App() {
  const menus: ShellMenuItem[] = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, to: "/dashboard" },
    { id: "users",     label: "Users",     icon: Users,           to: "/users" },
    { id: "settings",  label: "Settings",  icon: Settings,        to: "/settings" },
  ];

  return (
    <AppShell
      title="My App"
      subtitle="Application Description"
      menus={menus}
      user={{ name: "John Doe", email: "john.doe@example.com" }}
      theme={{ initialMode: "light" }}
    >
      <div className="p-6">
        <h1>Welcome to My App</h1>
      </div>
    </AppShell>
  );
}

export default App;
```

---

## API Reference

### AppShell Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `children` | `ReactNode` | Yes | — | Main content area rendered inside the shell |
| `menus` | `ShellMenuItem[]` | Yes | — | Array of menu items for sidebar navigation |
| `title` | `string` | No | — | Application title in the sidebar header |
| `subtitle` | `string` | No | — | Application subtitle below the title |
| `logo` | `ReactNode` | No | — | Custom logo (image, SVG, or React component) |
| `user` | `ShellUser` | No | — | User info for the user menu in the top bar |
| `search` | `ShellSearchConfig` | No | — | Search configuration; enables the search bar when provided |
| `showSearch` | `boolean` | No | `true` | Show or hide the search bar |
| `institutions` | `ShellInstitution[]` | No | — | Institutions for the institution selector dropdown |
| `selectedInstitutionId` | `string` | No | — | ID of the currently selected institution |
| `onInstitutionChange` | `(id: string) => void` | No | — | Callback when the user selects a different institution |
| `institutionPlaceholder` | `string` | No | — | Placeholder text when no institution is selected |
| `showInstitutionSelector` | `boolean` | No | `true` | Show or hide the institution selector |
| `quickActions` | `QuickAction[]` | No | — | Quick action buttons displayed in the top bar |
| `appLauncherItems` | `AppLauncherItem[]` | No | — | Items for the app-launcher menu |
| `sidebarHeader` | `ReactNode` | No | — | Custom sidebar header (replaces the default title/logo block) |
| `sidebarFooter` | `ReactNode` | No | — | Custom content at the bottom of the sidebar |
| `footer` | `ReactNode` | No | — | Legacy footer slot; prefer `footerContent` |
| `footerContent` | `ReactNode` | No | — | Replaces the default copyright footer |
| `showFooter` | `boolean` | No | `true` | Show or hide the bottom footer bar |
| `pagination` | `ShellPaginationConfig` | No | — | Pagination controls rendered above the footer |
| `theme` | `ShellThemeOptions` | No | — | Theme mode configuration |
| `actions` | `ReactNode` | No | — | Custom action area in the top bar |
| `linkComponent` | `ComponentType<ShellLinkComponentProps>` | No | — | Custom link component (useful for non-React Router setups) |
| `onMenuSelect` | `(item: ShellMenuItem) => void` | No | — | Callback when a menu item is clicked |
| `className` | `string` | No | — | Additional CSS classes on the root container |

---

### Type Definitions

#### ShellMenuItem

Represents a single item in the sidebar. Supports nested children for sub-menus.

```tsx
type ShellMenuItem = {
  id: string;
  label: string;
  description?: string;
  icon?: ComponentType<{ className?: string }>;
  to?: string;                    // React Router path
  href?: string;                  // External link
  onSelect?: () => void;
  badge?: ReactNode;
  disabled?: boolean;
  children?: ShellMenuItem[];     // Nested sub-menu items
  meta?: Record<string, unknown>;
};
```

**Example:**

```tsx
const menus: ShellMenuItem[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, to: "/dashboard" },
  {
    id: "settings",
    label: "Settings",
    icon: Settings,
    children: [
      { id: "settings-profile", label: "Profile",  to: "/settings/profile" },
      { id: "settings-account", label: "Account",  to: "/settings/account" },
    ],
  },
];
```

#### ShellUser

```tsx
type ShellUser = {
  name: string;
  email?: string;
  subtitle?: string;
  avatarUrl?: string;
  extras?: ReactNode;
  menuItems?: ShellUserMenuItem[];
};
```

**Example:**

```tsx
const user: ShellUser = {
  name: "John Doe",
  email: "john.doe@example.com",
  avatarUrl: "/avatars/john.jpg",
  menuItems: [
    { id: "profile", label: "Profile",  icon: User,   href: "/profile" },
    { id: "logout",  label: "Log out",  icon: LogOut, onSelect: handleLogout, danger: true },
  ],
};
```

#### ShellUserMenuItem

```tsx
type ShellUserMenuItem = {
  id: string;
  label: string;
  icon?: ComponentType<{ className?: string }>;
  description?: string;
  href?: string;
  onSelect?: () => void;
  danger?: boolean;               // Renders in red; use for destructive actions
};
```

#### ShellSearchConfig

```tsx
type ShellSearchConfig = {
  placeholder?: string;
  value?: string;
  defaultValue?: string;
  debounceMs?: number;
  onChange?: (value: string) => void;
  onSubmit?: (value: string) => void;
  render?: (props: ShellSearchRenderProps) => ReactNode;
};
```

**Example:**

```tsx
search={{
  placeholder: "Search modules, actions or pages",
  value: searchTerm,
  onChange: setSearchTerm,
  onSubmit: (value) => console.log("Searching for:", value),
  debounceMs: 300,
}}
```

#### ShellInstitution

```tsx
type ShellInstitution = {
  id: string;
  name: string;
  acronym: string;
};
```

**Example:**

```tsx
const institutions: ShellInstitution[] = [
  { id: "1", name: "Ministry of Public Service and Labour",       acronym: "MIFOTRA"   },
  { id: "2", name: "Ministry of Finance and Economic Planning",   acronym: "MINECOFIN" },
];
```

#### QuickAction

```tsx
type QuickAction = {
  id: string;
  icon: ComponentType<{ className?: string }>;
  label?: string;
  tooltip?: string;
  onSelect?: () => void;
  panel?: ReactNode;              // Slide-out panel shown when the action is clicked
  variant?: "default" | "primary";
};
```

**Example:**

```tsx
const quickActions: QuickAction[] = [
  {
    id: "notifications",
    icon: Bell,
    tooltip: "View notifications",
    panel: <NotificationsPanel />,
  },
  {
    id: "help",
    icon: HelpCircle,
    tooltip: "Get help",
    panel: <HelpPanel />,
    variant: "primary",
  },
];
```

#### AppLauncherItem

```tsx
type AppLauncherItem = {
  id: string;
  label: string;
  icon?: ComponentType<{ className?: string }>;
  description?: string;
  href?: string;
  onSelect?: () => void;
  openInNewTab?: boolean;
};
```

#### ShellPaginationConfig

```tsx
type ShellPaginationConfig = {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
  label?: string;
  pageSize?: number;
  pageSizeOptions?: number[];
  onPageSizeChange?: (size: number) => void;
  totalItems?: number;
  showNumbers?: boolean;
  isLoading?: boolean;
};
```

**Example:**

```tsx
pagination={{
  page: currentPage,
  totalPages,
  onChange: (page) => {
    setCurrentPage(page);
    fetchData({ page, size: pageSize });
  },
  label: "Applications",
  pageSize,
  pageSizeOptions: [10, 25, 50],
  onPageSizeChange: (size) => {
    setPageSize(size);
    fetchData({ page: 1, size });
  },
  totalItems,
  isLoading,
}}
```

#### Using `useShellPagination`

For page-level components, use the `useShellPagination` hook to register pagination controls automatically. Mounting the hook renders the footer controls; unmounting removes them.

```tsx
import { useShellPagination } from "@ippis/app-layout-theme";

export const ApplicationsScreen = () => {
  const { page, pageSize, setTotalItems, setLoading, isLoading } =
    useShellPagination({
      initialPageSize: 20,
      pageSizeOptions: [10, 20, 50],
      onPageChange: (nextPage, size) => fetchApplications(nextPage, size),
      onPageSizeChange: (_, size) => fetchApplications(1, size),
    });

  const fetchApplications = async (p = page, s = pageSize) => {
    setLoading(true);
    try {
      const res = await api.getApplications({ page: p, size: s });
      setRows(res.items);
      setTotalItems(res.total);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchApplications(); }, [page, pageSize]);

  return <ApplicationsTable data={rows} loading={isLoading} />;
};
```

#### ShellThemeOptions

```tsx
type ShellThemeOptions = {
  initialMode?: "light" | "dark" | "white";
  onModeChange?: (mode: "light" | "dark" | "white") => void;
};
```

The built-in toggle cycles through `light → dark → white`. Surface colors can be overridden with CSS variables (see [Styling](#styling)).

**Example:**

```tsx
theme={{
  initialMode: "dark",
  onModeChange: (mode) => localStorage.setItem("theme", mode),
}}
```

#### ShellLinkComponentProps

Use this to replace the default React Router `<Link>` with your own router's link component.

```tsx
type ShellLinkComponentProps = {
  to?: string;
  href?: string;
  className?: string;
  children: ReactNode;
  onClick?: (event: MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => void;
};
```

**Example (Next.js):**

```tsx
import NextLink from "next/link";
import type { ShellLinkComponentProps } from "@ippis/app-layout-theme";

const CustomLink = ({ to, href, className, children, onClick }: ShellLinkComponentProps) => (
  <NextLink href={to ?? href ?? "#"} className={className} onClick={onClick}>
    {children}
  </NextLink>
);

<AppShell menus={menus} linkComponent={CustomLink}>
  ...
</AppShell>
```

---

## DemoBlock

`DemoBlock` is a **demo utility component** used internally by the library's component showcase (`src/main.tsx`). It renders a labelled preview box above a syntax-highlighted code snippet, making it easy to document components side-by-side with their usage code.

> **Important:** `DemoBlock` is not exported from `@ippis/app-layout-theme`. It is a lightweight internal helper. Copy the snippet below directly into your own project if you need the same pattern.

### What it does

```
┌─────────────────────────────────────┐
│ Label text                          │
│ ┌──────────────────────────────┐    │
│ │  Live component preview       │    │
│ └──────────────────────────────┘    │
│ <pre> code snippet </pre>           │
└─────────────────────────────────────┘
```

### Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `label` | `string` | Yes | Title shown above the preview box |
| `code` | `string` | Yes | Code string displayed in the monospace block |
| `children` | `ReactNode` | Yes | Live component(s) rendered in the preview area |

### Source (copy into your project)

`DemoBlock` depends on a `Code` helper for the syntax block:

```tsx
// Monospace code block
const Code = ({ children }: { children: string }) => (
  <pre className="bg-muted/60 dark:bg-muted/30 border border-border rounded-lg px-4 py-3 text-ds-xs font-mono text-foreground overflow-x-auto whitespace-pre leading-relaxed">
    <code>{children}</code>
  </pre>
);

// Demo + code two-column block
const DemoBlock = ({
  label,
  code,
  children,
}: {
  label: string;
  code: string;
  children: React.ReactNode;
}) => (
  <div className="space-y-3">
    <p className="text-ds-sm font-medium text-foreground">{label}</p>
    <div className="rounded-xl border border-border bg-background p-4">
      {children}
    </div>
    <Code>{code}</Code>
  </div>
);
```

> The Tailwind classes used here (`text-ds-sm`, `text-ds-xs`, `bg-muted/60`, `border-border`, etc.) are part of the library's design-token system. They are available when you have imported `dist/style.css` and have Tailwind configured with the library's `dist/` folder in `content` (see [Configure Tailwind](#2-optional-configure-tailwind)).

### Usage example

```tsx
import { Button } from "@ippis/app-layout-theme";

// After copying DemoBlock and Code from above:

<DemoBlock
  label="Primary and secondary buttons"
  code={`<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>`}
>
  <div className="flex gap-2">
    <Button variant="primary">Primary</Button>
    <Button variant="secondary">Secondary</Button>
  </div>
</DemoBlock>
```

### Rendering multiple demos in a section

Pair `DemoBlock` with a simple `Section` wrapper to build a full component showcase:

```tsx
import { Box } from "lucide-react";

const Section = ({
  id,
  icon: Icon,
  title,
  description,
  children,
}: {
  id: string;
  icon: React.ElementType;
  title: string;
  description: string;
  children: React.ReactNode;
}) => (
  <section id={id} className="scroll-mt-20 rounded-xl border border-border bg-card overflow-hidden">
    <div className="flex items-start gap-4 px-6 py-4 border-b border-border bg-muted/20">
      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <Icon className="h-4 w-4" />
      </span>
      <div>
        <h2 className="text-ds-base font-semibold text-foreground">{title}</h2>
        <p className="mt-0.5 text-ds-sm text-muted-foreground">{description}</p>
      </div>
    </div>
    <div className="px-6 py-6 space-y-8">{children}</div>
  </section>
);

// Then use them together:
<Section id="buttons" icon={Box} title="Button" description="Action triggers with multiple variants.">
  <DemoBlock label="Solid variants" code={`<Button variant="primary">Primary</Button>`}>
    <Button variant="primary">Primary</Button>
  </DemoBlock>
</Section>
```

---

## Examples

### Basic Setup

```tsx
import { AppShell } from "@ippis/app-layout-theme";
import type { ShellMenuItem } from "@ippis/app-layout-theme";
import { LayoutDashboard, Settings } from "lucide-react";

const menus: ShellMenuItem[] = [
  { id: "home",     label: "Dashboard", icon: LayoutDashboard, to: "/" },
  { id: "settings", label: "Settings",  icon: Settings,        to: "/settings" },
];

export default function App() {
  return (
    <AppShell title="My App" menus={menus}>
      <div className="p-6">Your content here</div>
    </AppShell>
  );
}
```

### With Institution Selector

```tsx
<AppShell
  title="My App"
  menus={menus}
  institutions={[
    { id: "1", name: "Organization 1", acronym: "ORG1" },
    { id: "2", name: "Organization 2", acronym: "ORG2" },
  ]}
  selectedInstitutionId={selectedId}
  onInstitutionChange={setSelectedId}
>
  <div>Content</div>
</AppShell>
```

### With Search

```tsx
const [searchTerm, setSearchTerm] = useState("");

<AppShell
  title="My App"
  menus={menus}
  search={{
    placeholder: "Search modules, actions or pages",
    value: searchTerm,
    onChange: setSearchTerm,
    onSubmit: (value) => console.log("Searching:", value),
    debounceMs: 300,
  }}
>
  <div>Content</div>
</AppShell>
```

### With Quick Actions (e.g. Notifications panel)

```tsx
import { Bell, HelpCircle } from "lucide-react";

<AppShell
  title="My App"
  menus={menus}
  quickActions={[
    {
      id: "notifications",
      icon: Bell,
      tooltip: "Notifications",
      panel: <NotificationsPanel />,
    },
    {
      id: "help",
      icon: HelpCircle,
      tooltip: "Get help",
      panel: <HelpPanel />,
      variant: "primary",
    },
  ]}
>
  <div>Content</div>
</AppShell>
```

### Custom Link Component (e.g. for Next.js)

```tsx
import NextLink from "next/link";
import type { ShellLinkComponentProps } from "@ippis/app-layout-theme";

const CustomLink = ({ to, href, className, children, onClick }: ShellLinkComponentProps) => (
  <NextLink href={to ?? href ?? "#"} className={className} onClick={onClick}>
    {children}
  </NextLink>
);

<AppShell menus={menus} linkComponent={CustomLink}>
  <div>Content</div>
</AppShell>
```

### Complete Example

```tsx
import { useState } from "react";
import { BrowserRouter } from "react-router-dom";
import { AppShell } from "@ippis/app-layout-theme";
import type { ShellMenuItem } from "@ippis/app-layout-theme";
import {
  LayoutDashboard, Users, Settings, FileText,
  Bell, HelpCircle, User, LogOut, BarChart,
} from "lucide-react";

export default function App() {
  const [searchTerm, setSearchTerm]             = useState("");
  const [currentPage, setCurrentPage]           = useState(1);
  const [selectedInstitution, setSelectedInstitution] = useState("1");

  const menus: ShellMenuItem[] = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, to: "/dashboard" },
    {
      id: "users", label: "Users", icon: Users,
      children: [
        { id: "users-active",  label: "Active Users", to: "/users/active" },
        { id: "users-pending", label: "Pending",       to: "/users/pending" },
      ],
    },
    { id: "documents", label: "Documents", icon: FileText,  to: "/documents" },
    { id: "settings",  label: "Settings",  icon: Settings,  to: "/settings" },
  ];

  return (
    <BrowserRouter>
      <AppShell
        menus={menus}
        title="My Application"
        subtitle="Enterprise Portal"
        user={{
          name: "John Doe",
          email: "john.doe@example.com",
          menuItems: [
            { id: "profile", label: "Profile", icon: User,   href: "/profile" },
            { id: "logout",  label: "Log out", icon: LogOut, onSelect: () => {}, danger: true },
          ],
        }}
        search={{
          placeholder: "Search modules, actions or pages",
          value: searchTerm,
          onChange: setSearchTerm,
          debounceMs: 300,
        }}
        institutions={[
          { id: "1", name: "Ministry of Public Service and Labour",     acronym: "MIFOTRA"   },
          { id: "2", name: "Ministry of Finance and Economic Planning", acronym: "MINECOFIN" },
        ]}
        selectedInstitutionId={selectedInstitution}
        onInstitutionChange={setSelectedInstitution}
        quickActions={[
          { id: "notifications", icon: Bell,        tooltip: "Notifications", panel: <div className="p-4">Notifications panel</div> },
          { id: "help",          icon: HelpCircle,  tooltip: "Help",          panel: <div className="p-4">Help panel</div>, variant: "primary" },
        ]}
        appLauncherItems={[
          { id: "analytics", label: "Analytics", icon: BarChart, href: "/analytics" },
        ]}
        pagination={{
          page: currentPage,
          totalPages: 10,
          onChange: setCurrentPage,
          label: "Applications",
        }}
        theme={{
          initialMode: "light",
          onModeChange: (mode) => localStorage.setItem("theme", mode),
        }}
      >
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-4">Welcome</h1>
          <p className="text-muted-foreground">Your application content goes here.</p>
        </div>
      </AppShell>
    </BrowserRouter>
  );
}
```

---

## Styling

### 1. Import the Stylesheet

Always import the compiled stylesheet. This provides all component styles and CSS custom properties:

```tsx
import "@ippis/app-layout-theme/dist/style.css";
```

### 2. Override CSS Variables

Surface colors and semantic tokens can be overridden in your global CSS:

```css
:root {
  --ds-surface:         #ffffff;
  --ds-surface-overlay: #ffffff;
  --ds-text:            #172b4d;
  --ds-border:          rgba(227, 228, 242, 0.122);
  --ds-link:            #669DF1;
}

.dark {
  --ds-surface:         #1F1F21;
  --ds-surface-overlay: #2B2C2F;   /* cards, tables, modals in dark mode */
  --ds-text:            #CECFD2;
  --ds-border:          rgba(227, 228, 242, 0.122);
  --ds-link:            #669DF1;
}
```

### 3. Dark Mode in Custom Content

Use these patterns inside your own content for consistent dark mode behavior:

```tsx
// Elevated surface (cards, tables, modals)
<div className="bg-white dark:bg-[var(--ds-surface-overlay,#2B2C2F)]" />

// Borders
<div className="border-slate-200 dark:border-[var(--ds-border,#E3E4F21F)]" />

// Muted text
<p className="text-slate-500 dark:text-[var(--ds-text,#CECFD2)]/60" />
```

### 4. Extend Tailwind Theme (optional)

If you're writing Tailwind-powered components and want first-class access to the design tokens:

```js
// tailwind.config.js
export default {
  darkMode: ["class"],
  theme: {
    extend: {
      colors: {
        primary:    { DEFAULT: "hsl(var(--primary))", foreground: "hsl(var(--primary-foreground))" },
        secondary:  { DEFAULT: "hsl(var(--secondary))", foreground: "hsl(var(--secondary-foreground))" },
        foreground: "hsl(var(--foreground))",
        background: "hsl(var(--background))",
        muted:      { DEFAULT: "hsl(var(--muted))", foreground: "hsl(var(--muted-foreground))" },
        border:     "hsl(var(--border))",
        card:       { DEFAULT: "hsl(var(--card))", foreground: "hsl(var(--card-foreground))" },
      },
      fontSize: {
        "ds-xs":   ["var(--text-xs)",   { lineHeight: "var(--leading-xs)"   }],
        "ds-sm":   ["var(--text-sm)",   { lineHeight: "var(--leading-sm)"   }],
        "ds-base": ["var(--text-base)", { lineHeight: "var(--leading-base)" }],
        "ds-lg":   ["var(--text-lg)",   { lineHeight: "var(--leading-lg)"   }],
      },
    },
  },
};
```

---

## TypeScript

All props and types are exported. Import only what you need:

```tsx
import type {
  AppShellProps,
  ShellMenuItem,
  ShellUser,
  ShellUserMenuItem,
  ShellSearchConfig,
  ShellInstitution,
  ShellThemeMode,
  ShellThemeOptions,
  ShellPaginationConfig,
  ShellLinkComponentProps,
  QuickAction,
  AppLauncherItem,
  LucideIcon,
} from "@ippis/app-layout-theme";
```

### Icons

Lucide icons are re-exported from the library under the `Icons` namespace to avoid name conflicts with same-named UI components (e.g. `Badge`, `Calendar`, `Command`):

```tsx
import { Icons } from "@ippis/app-layout-theme";

<Icons.Bell className="h-4 w-4" />
<Icons.User className="h-4 w-4" />
```

Or import `LucideIcon` for prop typing:

```tsx
import type { LucideIcon } from "@ippis/app-layout-theme";

type Props = { icon: LucideIcon };
```

---

## Browser Support

- Chrome (last 2 versions)
- Firefox (last 2 versions)
- Safari (last 2 versions)
- Edge (last 2 versions)

---

## Contributing

Contributions are welcome. Please open an issue or submit a pull request on the [GitHub repository](https://github.com/gannza/app-layout-theme).

---

## License

MIT

---

## Publishing

Quick steps:
1. Update `package.json` with your repository URLs
2. Build the library: `npm run build:lib`
3. Dry run: `npm publish --dry-run`
4. Publish: `npm publish`

For detailed instructions see [PUBLISHING.md](./PUBLISHING.md).

---

## Support

Open an issue on [GitHub](https://github.com/gannza/app-layout-theme/issues).
