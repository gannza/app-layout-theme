# @ippis/app-layout-theme

A modern, feature-rich React component library built with TypeScript, Tailwind CSS, and Radix UI. This library provides a complete application shell (`AppShell`) with sidebar navigation, top bar, user menu, and built-in SSO authentication.

## Features

- **Modern Design**: Built with Tailwind CSS and Radix UI primitives
- **Responsive**: Mobile-first design with responsive sidebar
- **Theme Support**: Built-in light / dark / white mode toggle
- **Accessible**: Built on Radix UI for full accessibility support
- **TypeScript**: Fully typed for a better developer experience
- **Customizable**: Highly configurable with props and theming options
- **SSO Auth**: Built-in HMAC-signed SSO integration with automatic token refresh, institution switching, and logout redirect

---

## Table of Contents

- [Installation](#installation)
- [Tailwind CSS & shadcn — What You Need to Know](#tailwind-css--shadcn--what-you-need-to-know)
- [Quick Start](#quick-start)
- [SSO Authentication](#sso-authentication)
  - [How it Works](#how-it-works)
  - [Environment Variables](#environment-variables)
  - [Minimal Setup](#minimal-setup)
  - [Auth Props on AppShell](#auth-props-on-appshell)
  - [What verify-me Returns](#what-verify-me-returns)
  - [Institution Switching](#institution-switching)
  - [Auth Hooks](#auth-hooks)
  - [Auth Type Definitions](#auth-type-definitions)
  - [Using AuthProvider Standalone](#using-authprovider-standalone)
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
      colors: {
        primary: "hsl(var(--primary))",
        secondary: "hsl(var(--secondary))",
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
  </StrictMode>,
);
```

### 4. Use the AppShell Component

```tsx
import { AppShell } from "@ippis/app-layout-theme";
import type { ShellMenuItem } from "@ippis/app-layout-theme";
import { LayoutDashboard, Users, Settings } from "lucide-react";

function App() {
  const menus: ShellMenuItem[] = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      to: "/dashboard",
    },
    { id: "users", label: "Users", icon: Users, to: "/users" },
    { id: "settings", label: "Settings", icon: Settings, to: "/settings" },
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

## SSO Authentication

`AppShell` has built-in SSO support powered by RTK Query. Pass `ssoBaseUrl` and `serviceName` to activate it — the shell handles the entire auth lifecycle automatically.

### How it Works

```
App loads
   │
   ▼
GET /api/auth/verify-me
   │
   ├─ 200 ──► Map user + institutions into shell → render app
   │
   └─ 401 ──► POST /api/auth/refresh
                  │
                  ├─ 200 ──► Retry verify-me → render app
                  │
                  └─ 401 ──► clearUser() → redirect to SSO login page
                             {ssoBaseUrl}signin/?service=…&continue={origin}
```

When auth is active every request is HMAC-signed with `X-Client-ID`, `X-Timestamp`, and `X-Signature` headers. Responses can optionally be pako-decompressed.

### Environment Variables

Set these in your app's `.env` file. The library reads them at runtime via `import.meta.env`:

```env
# HMAC signing
VITE_API_SIGNING_SECRET=your-hmac-secret
VITE_APP_ID=IPPIS_AUTH

# Optional: enable pako decompression of SSO responses
VITE_API_ENCRYPTION_ENABLED=true
```

You can also pass these values as props directly on `AppShell` (props take priority over env vars).

### Minimal Setup

```tsx
// src/App.tsx
import { AppShell } from "@ippis/app-layout-theme";
import type { ShellMenuItem } from "@ippis/app-layout-theme";

const menus: ShellMenuItem[] = [
  { id: "dashboard", label: "Dashboard", to: "/dashboard" },
];

export default function App() {
  return (
    <AppShell
      ssoBaseUrl="http://sso.localtest.me:8000/"
      serviceName="Internship Portal"
      menus={menus}
      signingSecret="your-secret"
      clientId="IPPIS_AUTH"
      encryptionEnabled={false}
    >
      <YourPageContent />
    </AppShell>
  );
}
```

That is all that is needed. `AppShell` will:

1. Call `GET /api/auth/verify-me` on mount
2. Populate the top-bar user menu and institution selector from the response
3. Automatically refresh and retry on `401`
4. Redirect to the SSO login page on auth failure

### Auth Props on AppShell

| Prop                | Type      | Required | Description                                                                                                                   |
| ------------------- | --------- | -------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `ssoBaseUrl`        | `string`  | —        | Base URL of the SSO server, e.g. `http://sso.localtest.me:8000/`. **Enables auth when provided together with `serviceName`.** |
| `serviceName`       | `string`  | —        | Human-readable service name passed as the `service` query param on the SSO redirect, e.g. `"Internship Portal"`.              |
| `signingSecret`     | `string`  | —        | HMAC secret used to sign requests. Falls back to `VITE_API_SIGNING_SECRET`.                                                   |
| `clientId`          | `string`  | —        | App identifier sent as `X-Client-ID`. Falls back to `VITE_APP_ID`.                                                            |
| `encryptionEnabled` | `boolean` | —        | Decompress pako-encoded SSO responses. Falls back to `VITE_API_ENCRYPTION_ENABLED === "true"`.                                |

> Both `ssoBaseUrl` **and** `serviceName` must be present to activate auth. If only one is provided the shell falls back to manual props (`user`, `institutions`, etc.).

### What verify-me Returns

The `GET /api/auth/verify-me` endpoint returns a `VerifyMeResponse` object. The library maps it automatically:

| verify-me field                                | Shell output               |
| ---------------------------------------------- | -------------------------- |
| `firstName` + `lastName`                       | `ShellUser.name`           |
| `email`                                        | `ShellUser.email`          |
| `selectedEntitySector.name`                    | `ShellUser.subtitle`       |
| `assignedEntitySectors[].id`                   | `ShellInstitution.id`      |
| `assignedEntitySectors[].name`                 | `ShellInstitution.name`    |
| acronym extracted from `name` e.g. `(MIFOTRA)` | `ShellInstitution.acronym` |
| `selectedEntitySector.id`                      | `selectedInstitutionId`    |

A **"Sign out"** menu item is injected automatically into the user menu. Clicking it calls `POST /api/auth/logout` then redirects to the SSO login page.

### Institution Switching

When the user selects a different institution from the top-bar selector, the library calls:

```
PUT /api/auth/switch-entity-sector?selectedEntitySectorId={id}
```

The response updates the shell state immediately — no page reload is required.

You can also hook into the switch event at the `AppShell` level:

```tsx
<AppShell
  ssoBaseUrl="http://sso.localtest.me:8000/"
  serviceName="Internship Portal"
  menus={menus}
  onInstitutionChange={(id) => {
    // Called after the library switches the entity sector
    console.log("Switched to:", id);
  }}
>
  ...
</AppShell>
```

### Auth Hooks

When you need to access auth state deep in your component tree, import the hooks. They must be rendered inside an `AppShell` that has `ssoBaseUrl` set (or inside a standalone `AuthProvider`).

```tsx
import {
  useAuthUser,
  useAuthInstitutions,
  useSelectedInstitutionId,
  useRawSsoUser,
  useAuthLoading,
  useSsoLogout,
  useSwitchInstitution,
} from "@ippis/app-layout-theme";
```

| Hook                         | Returns                    | Description                                                                                                    |
| ---------------------------- | -------------------------- | -------------------------------------------------------------------------------------------------------------- |
| `useAuthUser()`              | `ShellUser \| null`        | Mapped user object ready for the shell. `null` while loading or unauthenticated.                               |
| `useAuthInstitutions()`      | `ShellInstitution[]`       | List of all assigned entity sectors mapped to `ShellInstitution`.                                              |
| `useSelectedInstitutionId()` | `string \| null`           | ID of the currently active entity sector.                                                                      |
| `useRawSsoUser()`            | `VerifyMeResponse \| null` | Full unmodified response from `verify-me`. Useful when you need `permissions`, `modules`, or `budgetEntities`. |
| `useAuthLoading()`           | `boolean`                  | `true` while the initial `verify-me` call is in-flight.                                                        |
| `useSsoLogout()`             | `() => void`               | Callback that calls logout API then redirects to SSO.                                                          |
| `useSwitchInstitution()`     | `(id: string) => void`     | Callback that calls the switch-entity-sector API.                                                              |

**Example — guard a route based on a permission:**

```tsx
import { useRawSsoUser } from "@ippis/app-layout-theme";

export function RecruitmentPage() {
  const ssoUser = useRawSsoUser();
  const selected = ssoUser?.selectedEntitySector;

  if (!selected?.permissions.CAN_ACCESS_RECRUITMENT_MODULE) {
    return <p>You do not have access to this module.</p>;
  }

  return <RecruitmentContent />;
}
```

**Example — show a logout button anywhere:**

```tsx
import { useSsoLogout } from "@ippis/app-layout-theme";

export function LogoutButton() {
  const logout = useSsoLogout();
  return <button onClick={logout}>Sign out</button>;
}
```

### Auth Type Definitions

```tsx
import type {
  VerifyMeResponse,
  AssignedEntitySector,
  SelectedBudgetEntity,
  AppModule,
  BudgetEntity,
  Role,
  SsoAuthConfig,
  SigningConfig,
} from "@ippis/app-layout-theme";
```

#### VerifyMeResponse

Full shape of the `/api/auth/verify-me` response:

```tsx
interface VerifyMeResponse {
  userId: string;
  lastName: string;
  firstName: string;
  email: string;
  phoneNumber: string;
  nid: string;
  passportNumber: string | null;
  rssbNumber: string;
  dn: string;
  assignedEntitySectors: AssignedEntitySector[];
  selectedEntitySector: AssignedEntitySector | null;
}
```

#### AssignedEntitySector

Each item in `assignedEntitySectors` represents one institution/entity the user belongs to:

```tsx
interface AssignedEntitySector {
  id: string; // Used as ShellInstitution.id and for switching
  sectorId: number;
  sector: string; // e.g. "Ministry", "Agency", "Board"
  name: string; // e.g. "Ministry of Public Service (MIFOTRA) / Ministry"
  entityId: string;
  unitId: string;
  isLocked: boolean;
  canUseTrainingModule: boolean;
  permissions: Record<string, boolean>; // e.g. { CAN_ACCESS_RECRUITMENT_MODULE: true }
  budgetEntities: BudgetEntity[];
  selectedBudgetEntity: SelectedBudgetEntity[];
}
```

#### SsoAuthConfig

Props accepted by both `AppShell` and the standalone `AuthProvider`:

```tsx
interface SsoAuthConfig {
  ssoBaseUrl: string;
  serviceName: string;
  signingSecret?: string;
  clientId?: string;
  encryptionEnabled?: boolean;
}
```

### Using AuthProvider Standalone

If you want SSO auth without `AppShell` — or need to wrap a custom layout — use `AuthProvider` directly:

```tsx
import {
  AuthProvider,
  useAuthUser,
  useRawSsoUser,
} from "@ippis/app-layout-theme";

function Root() {
  return (
    <AuthProvider
      ssoBaseUrl="http://sso.localtest.me:8000/"
      serviceName="Internship Portal"
    >
      <MyCustomLayout />
    </AuthProvider>
  );
}

function MyCustomLayout() {
  const user = useAuthUser(); // ShellUser | null
  const raw = useRawSsoUser(); // VerifyMeResponse | null

  return (
    <div>
      <header>{user?.name}</header>
      <main>
        {raw?.selectedEntitySector?.permissions.IS_ADMIN && <AdminPanel />}
      </main>
    </div>
  );
}
```

---

## API Reference

### AppShell Props

| Prop                      | Type                                     | Required | Default                       | Description                                                                         |
| ------------------------- | ---------------------------------------- | -------- | ----------------------------- | ----------------------------------------------------------------------------------- |
| `children`                | `ReactNode`                              | Yes      | —                             | Main content area rendered inside the shell                                         |
| `menus`                   | `ShellMenuItem[]`                        | Yes      | —                             | Array of menu items for sidebar navigation                                          |
| `title`                   | `string`                                 | No       | —                             | Application title in the sidebar header                                             |
| `subtitle`                | `string`                                 | No       | —                             | Application subtitle below the title                                                |
| `logo`                    | `ReactNode`                              | No       | —                             | Custom logo (image, SVG, or React component)                                        |
| `user`                    | `ShellUser`                              | No       | —                             | User info for the user menu. Overridden by SSO data when `ssoBaseUrl` is set.       |
| `search`                  | `ShellSearchConfig`                      | No       | —                             | Search configuration; enables the search bar when provided                          |
| `showSearch`              | `boolean`                                | No       | `true`                        | Show or hide the search bar                                                         |
| `institutions`            | `ShellInstitution[]`                     | No       | —                             | Institution list. Overridden by SSO data when `ssoBaseUrl` is set.                  |
| `selectedInstitutionId`   | `string`                                 | No       | —                             | Active institution ID. Overridden by SSO data.                                      |
| `onInstitutionChange`     | `(id: string) => void`                   | No       | —                             | Called after institution switch (also fires the SSO switch API when auth is active) |
| `institutionPlaceholder`  | `string`                                 | No       | —                             | Placeholder text when no institution is selected                                    |
| `showInstitutionSelector` | `boolean`                                | No       | `true`                        | Show or hide the institution selector                                               |
| `quickActions`            | `QuickAction[]`                          | No       | —                             | Quick action buttons displayed in the top bar                                       |
| `appLauncherItems`        | `AppLauncherItem[]`                      | No       | —                             | Items for the app-launcher menu                                                     |
| `sidebarHeader`           | `ReactNode`                              | No       | —                             | Custom sidebar header (replaces the default title/logo block)                       |
| `sidebarFooter`           | `ReactNode`                              | No       | —                             | Custom content at the bottom of the sidebar                                         |
| `footer`                  | `ReactNode`                              | No       | —                             | Legacy footer slot; prefer `footerContent`                                          |
| `footerContent`           | `ReactNode`                              | No       | —                             | Replaces the default copyright footer                                               |
| `showFooter`              | `boolean`                                | No       | `true`                        | Show or hide the bottom footer bar                                                  |
| `pagination`              | `ShellPaginationConfig`                  | No       | —                             | Pagination controls rendered above the footer                                       |
| `theme`                   | `ShellThemeOptions`                      | No       | —                             | Theme mode configuration                                                            |
| `actions`                 | `ReactNode`                              | No       | —                             | Custom action area in the top bar                                                   |
| `linkComponent`           | `ComponentType<ShellLinkComponentProps>` | No       | —                             | Custom link component (useful for non-React Router setups)                          |
| `onMenuSelect`            | `(item: ShellMenuItem) => void`          | No       | —                             | Callback when a menu item is clicked                                                |
| `className`               | `string`                                 | No       | —                             | Additional CSS classes on the root container                                        |
| `ssoBaseUrl`              | `string`                                 | No       | —                             | SSO base URL. **Activates built-in auth when set with `serviceName`.**              |
| `serviceName`             | `string`                                 | No       | —                             | SSO service name used in the login redirect URL                                     |
| `signingSecret`           | `string`                                 | No       | `VITE_API_SIGNING_SECRET`     | HMAC signing secret. Falls back to env var.                                         |
| `clientId`                | `string`                                 | No       | `VITE_APP_ID`                 | App client ID sent as `X-Client-ID`. Falls back to env var.                         |
| `encryptionEnabled`       | `boolean`                                | No       | `VITE_API_ENCRYPTION_ENABLED` | Enable pako decompression of SSO responses. Falls back to env var.                  |

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
  to?: string; // React Router path
  href?: string; // External link
  onSelect?: () => void;
  badge?: ReactNode;
  disabled?: boolean;
  children?: ShellMenuItem[]; // Nested sub-menu items
  meta?: Record<string, unknown>;
};
```

**Example:**

```tsx
const menus: ShellMenuItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    to: "/dashboard",
  },
  {
    id: "settings",
    label: "Settings",
    icon: Settings,
    children: [
      { id: "settings-profile", label: "Profile", to: "/settings/profile" },
      { id: "settings-account", label: "Account", to: "/settings/account" },
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
    { id: "profile", label: "Profile", icon: User, href: "/profile" },
    {
      id: "logout",
      label: "Log out",
      icon: LogOut,
      onSelect: handleLogout,
      danger: true,
    },
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
  danger?: boolean; // Renders in red; use for destructive actions
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

#### QuickAction

```tsx
type QuickAction = {
  id: string;
  icon: ComponentType<{ className?: string }>;
  label?: string;
  tooltip?: string;
  onSelect?: () => void;
  panel?: ReactNode; // Slide-out panel shown when the action is clicked
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

  useEffect(() => {
    fetchApplications();
  }, [page, pageSize]);

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

const CustomLink = ({
  to,
  href,
  className,
  children,
  onClick,
}: ShellLinkComponentProps) => (
  <NextLink href={to ?? href ?? "#"} className={className} onClick={onClick}>
    {children}
  </NextLink>
);

<AppShell menus={menus} linkComponent={CustomLink}>
  ...
</AppShell>;
```

---

## DemoBlock

`DemoBlock` is a **demo utility component** used internally by the library's component showcase (`src/main.tsx`). It renders a labelled preview box above a syntax-highlighted code snippet, making it easy to document components side-by-side with their usage code.

> **Important:** `DemoBlock` is not exported from `@ippis/app-layout-theme`. Copy the snippet below directly into your own project if you need the same pattern.

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

| Prop       | Type        | Required | Description                                    |
| ---------- | ----------- | -------- | ---------------------------------------------- |
| `label`    | `string`    | Yes      | Title shown above the preview box              |
| `code`     | `string`    | Yes      | Code string displayed in the monospace block   |
| `children` | `ReactNode` | Yes      | Live component(s) rendered in the preview area |

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
</DemoBlock>;
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
  <section
    id={id}
    className="scroll-mt-20 rounded-xl border border-border bg-card overflow-hidden"
  >
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
<Section
  id="buttons"
  icon={Box}
  title="Button"
  description="Action triggers with multiple variants."
>
  <DemoBlock
    label="Solid variants"
    code={`<Button variant="primary">Primary</Button>`}
  >
    <Button variant="primary">Primary</Button>
  </DemoBlock>
</Section>;
```

---

## Examples

### Basic Setup (no auth)

```tsx
import { AppShell } from "@ippis/app-layout-theme";
import type { ShellMenuItem } from "@ippis/app-layout-theme";
import { LayoutDashboard, Settings } from "lucide-react";

const menus: ShellMenuItem[] = [
  { id: "home", label: "Dashboard", icon: LayoutDashboard, to: "/" },
  { id: "settings", label: "Settings", icon: Settings, to: "/settings" },
];

export default function App() {
  return (
    <AppShell title="My App" menus={menus}>
      <div className="p-6">Your content here</div>
    </AppShell>
  );
}
```

### With SSO Auth (recommended)

```tsx
// .env
// VITE_API_SIGNING_SECRET=your-secret
// VITE_APP_ID=IPPIS_AUTH

import { AppShell } from "@ippis/app-layout-theme";
import type { ShellMenuItem } from "@ippis/app-layout-theme";

const menus: ShellMenuItem[] = [
  { id: "dashboard", label: "Dashboard", to: "/dashboard" },
  { id: "settings", label: "Settings", to: "/settings" },
];

export default function App() {
  return (
    <AppShell
      ssoBaseUrl="http://sso.localtest.me:8000/"
      serviceName="Internship Portal"
      menus={menus}
    >
      <div className="p-6">
        Content — user and institutions are loaded from SSO
      </div>
    </AppShell>
  );
}
```

### Accessing Permissions Inside a Page

```tsx
import { useRawSsoUser, useAuthLoading } from "@ippis/app-layout-theme";

export function RecruitmentPage() {
  const ssoUser = useRawSsoUser();
  const isLoading = useAuthLoading();

  if (isLoading) return <Spinner />;

  const canAccess =
    ssoUser?.selectedEntitySector?.permissions.CAN_ACCESS_RECRUITMENT_MODULE;

  if (!canAccess) {
    return <p>You do not have access to this module.</p>;
  }

  return <RecruitmentContent />;
}
```

### Accessing Available Modules

```tsx
import { useRawSsoUser } from "@ippis/app-layout-theme";

export function ModuleList() {
  const ssoUser = useRawSsoUser();
  const modules =
    ssoUser?.selectedEntitySector?.selectedBudgetEntity[0]?.modules ?? [];

  return (
    <ul>
      {modules.map((mod) => (
        <li key={mod.moduleId}>
          <a href={mod.to}>{mod.fullName}</a>
        </li>
      ))}
    </ul>
  );
}
```

### With Institution Selector (manual, no SSO)

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
</AppShell>;
```

### With Quick Actions

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
</AppShell>;
```

### Custom Link Component (e.g. for Next.js)

```tsx
import NextLink from "next/link";
import type { ShellLinkComponentProps } from "@ippis/app-layout-theme";

const CustomLink = ({
  to,
  href,
  className,
  children,
  onClick,
}: ShellLinkComponentProps) => (
  <NextLink href={to ?? href ?? "#"} className={className} onClick={onClick}>
    {children}
  </NextLink>
);

<AppShell menus={menus} linkComponent={CustomLink}>
  <div>Content</div>
</AppShell>;
```

### Complete Example with SSO

```tsx
import { BrowserRouter } from "react-router-dom";
import { AppShell } from "@ippis/app-layout-theme";
import type { ShellMenuItem } from "@ippis/app-layout-theme";
import {
  LayoutDashboard,
  Users,
  Settings,
  FileText,
  Bell,
  HelpCircle,
} from "lucide-react";

const menus: ShellMenuItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    to: "/dashboard",
  },
  {
    id: "users",
    label: "Users",
    icon: Users,
    children: [
      { id: "users-active", label: "Active Users", to: "/users/active" },
      { id: "users-pending", label: "Pending", to: "/users/pending" },
    ],
  },
  { id: "documents", label: "Documents", icon: FileText, to: "/documents" },
  { id: "settings", label: "Settings", icon: Settings, to: "/settings" },
];

export default function App() {
  return (
    <BrowserRouter>
      <AppShell
        // SSO — user, institutions, and logout are handled automatically
        ssoBaseUrl="http://sso.localtest.me:8000/"
        serviceName="Internship Portal"
        // Layout
        menus={menus}
        title="IPPIS"
        subtitle="Integrated Personnel and Payroll Information System"
        // Search
        search={{
          placeholder: "Search modules, actions or pages",
          debounceMs: 300,
        }}
        // Quick actions
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
            tooltip: "Help",
            panel: <HelpPanel />,
            variant: "primary",
          },
        ]}
        // Theme
        theme={{
          initialMode: "light",
          onModeChange: (mode) => localStorage.setItem("theme", mode),
        }}
      >
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-4">Welcome</h1>
          <p className="text-muted-foreground">
            Your application content goes here.
          </p>
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
  --ds-surface: #ffffff;
  --ds-surface-overlay: #ffffff;
  --ds-text: #172b4d;
  --ds-border: rgba(227, 228, 242, 0.122);
  --ds-link: #669df1;
}

.dark {
  --ds-surface: #1f1f21;
  --ds-surface-overlay: #2b2c2f; /* cards, tables, modals in dark mode */
  --ds-text: #cecfd2;
  --ds-border: rgba(227, 228, 242, 0.122);
  --ds-link: #669df1;
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
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        foreground: "hsl(var(--foreground))",
        background: "hsl(var(--background))",
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        border: "hsl(var(--border))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      fontSize: {
        "ds-xs": ["var(--text-xs)", { lineHeight: "var(--leading-xs)" }],
        "ds-sm": ["var(--text-sm)", { lineHeight: "var(--leading-sm)" }],
        "ds-base": ["var(--text-base)", { lineHeight: "var(--leading-base)" }],
        "ds-lg": ["var(--text-lg)", { lineHeight: "var(--leading-lg)" }],
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
  // Shell
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
  // SSO Auth
  SsoAuthConfig,
  VerifyMeResponse,
  AssignedEntitySector,
  SelectedBudgetEntity,
  AppModule,
  // Icons
  LucideIcon,
} from "@ippis/app-layout-theme";
```

### Icons

Lucide icons are re-exported under the `Icons` namespace to avoid name conflicts with same-named UI components (e.g. `Badge`, `Calendar`, `Command`):

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

> The HMAC signing uses the [Web Crypto API](https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto) which requires a secure context (HTTPS or localhost).

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
