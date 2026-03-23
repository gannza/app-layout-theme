# @ippis/app-layout-theme

A modern, feature-rich React component library built with TypeScript, Tailwind CSS, and Radix UI. This library provides a complete application shell (`AppShell`) with sidebar navigation, top bar, user menu, and more.

## Features

- 🎨 **Modern Design**: Built with Tailwind CSS and Radix UI primitives
- 📱 **Responsive**: Mobile-first design with responsive sidebar
- 🌓 **Theme Support**: Built-in light/dark mode toggle
- ♿ **Accessible**: Built on Radix UI for full accessibility support
- 🔧 **TypeScript**: Fully typed for better developer experience
- 🎯 **Customizable**: Highly configurable with props and theming options

## Installation

```bash
npm install @ippis/app-layout-theme
# or
yarn add @ippis/app-layout-theme
# or
pnpm add @ippis/app-layout-theme
```

## Peer Dependencies

This library requires the following peer dependencies:

```bash
npm install react react-dom react-router-dom
```

## Quick Start

### 1. Install Tailwind CSS

This library uses Tailwind CSS. Make sure you have Tailwind configured in your project:

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### 2. Configure Tailwind

Add the library's styles to your `tailwind.config.js`:

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@ippis/app-layout-theme/dist/**/*.{js,ts,jsx,tsx}", // Add this
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

### 3. Import Styles

Import the library's CSS in your main entry file:

```tsx
// src/main.tsx or src/index.tsx
import "@ippis/app-layout-theme/dist/style.css";
// or if using a CSS bundler
import "@ippis/app-layout-theme/dist/index.css";
```

### 4. Use the AppShell Component

```tsx
import { AppShell, ShellMenuItem } from "@ippis/app-layout-theme";
import { LayoutDashboard, Users, Settings } from "lucide-react";
import { BrowserRouter } from "react-router-dom";

function App() {
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
      to: "/users",
    },
    {
      id: "settings",
      label: "Settings",
      icon: Settings,
      to: "/settings",
    },
  ];

  return (
    <BrowserRouter>
      <AppShell
        title="My App"
        subtitle="Application Description"
        menus={menus}
        user={{
          name: "John Doe",
          email: "john.doe@example.com",
        }}
        theme={{ initialMode: "light" }}
      >
        <div className="p-6">
          <h1>Welcome to My App</h1>
          {/* Your app content */}
        </div>
      </AppShell>
    </BrowserRouter>
  );
}

export default App;
```

## API Reference

### AppShell

The main component that provides the application shell layout with sidebar, top bar, and footer.

#### Props

All available properties for the `AppShell` component:

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `children` | `ReactNode` | ✅ **Yes** | - | Main content area rendered inside the shell |
| `menus` | `ShellMenuItem[]` | ✅ **Yes** | - | Array of menu items for sidebar navigation. See [ShellMenuItem](#shellmenuitem) type below. |
| `title` | `string` | No | - | Application title displayed in the sidebar header |
| `subtitle` | `string` | No | - | Application subtitle displayed below the title |
| `logo` | `ReactNode` | No | - | Custom logo component to display in the sidebar. Can be an image, SVG, or any React component |
| `user` | `ShellUser` | No | - | User information object for the user menu in the top bar. See [ShellUser](#shelluser) type below |
| `search` | `ShellSearchConfig` | No | - | Search configuration object. When provided, enables the search bar in the top bar. See [ShellSearchConfig](#shellsearchconfig) type below |
| `showSearch` | `boolean` | No | `true` | Show or hide the search bar. Set to `false` to hide search even if `search` prop is provided |
| `institutions` | `ShellInstitution[]` | No | - | Array of institution objects for the institution selector dropdown. See [ShellInstitution](#shellinstitution) type below |
| `selectedInstitutionId` | `string` | No | - | ID of the currently selected institution. Must match one of the IDs in the `institutions` array |
| `onInstitutionChange` | `(institutionId: string) => void` | No | - | Callback function called when user selects a different institution. Receives the new institution ID |
| `institutionPlaceholder` | `string` | No | - | Placeholder text for the institution selector when no institution is selected |
| `showInstitutionSelector` | `boolean` | No | `true` | Show or hide the institution selector in the top bar |
| `quickActions` | `QuickAction[]` | No | - | Array of quick action buttons displayed in the top bar. See [QuickAction](#quickaction) type below |
| `appLauncherItems` | `AppLauncherItem[]` | No | - | Array of items for the app launcher menu. See [AppLauncherItem](#applauncheritem) type below |
| `sidebarHeader` | `ReactNode` | No | - | Custom content to display in the sidebar header. Overrides the default header with title/subtitle |
| `sidebarFooter` | `ReactNode` | No | - | Custom content to display in the sidebar footer (below menu items) |
| `footer` | `ReactNode` | No | - | Custom footer content. **Note:** Use `footerContent` instead for better control |
| `footerContent` | `ReactNode` | No | - | Custom footer content that replaces the default footer. If not provided, shows default footer with copyright and links |
| `showFooter` | `boolean` | No | `true` | Show or hide the footer at the bottom of the shell |
| `pagination` | `PaginationConfig` | No | - | Pagination configuration object. When provided, displays pagination controls above the footer. See [PaginationConfig](#paginationconfig) type below |
| `theme` | `ShellThemeOptions` | No | - | Theme configuration object for light/dark mode. See [ShellThemeOptions](#shellthemeoptions) type below |
| `actions` | `ReactNode` | No | - | Custom action buttons or components to display in the top bar (next to quick actions) |
| `linkComponent` | `ComponentType<ShellLinkComponentProps>` | No | - | Custom link component for menu navigation. Useful if you're using a different routing library. See [ShellLinkComponentProps](#shelllinkcomponentprops) type below |
| `onMenuSelect` | `(item: ShellMenuItem) => void` | No | - | Callback function called when a menu item is clicked. Receives the clicked menu item object |
| `className` | `string` | No | - | Additional CSS classes to apply to the root AppShell container |

### Type Definitions

#### ShellMenuItem

Menu item configuration for sidebar navigation. Supports nested menus with children.

```tsx
type ShellMenuItem = {
  id: string;                    // Unique identifier for the menu item (required)
  label: string;                 // Display text for the menu item (required)
  description?: string;          // Optional description text shown below the label
  icon?: ComponentType<{ className?: string }>; // Optional icon component (e.g., from lucide-react)
  to?: string;                   // React Router path for internal navigation
  href?: string;                 // External URL for external links
  onSelect?: () => void;         // Callback function called when item is clicked
  badge?: ReactNode;             // Optional badge component (e.g., notification count)
  disabled?: boolean;            // Disable the menu item (default: false)
  children?: ShellMenuItem[];    // Nested menu items for sub-menus
  meta?: Record<string, unknown>; // Optional metadata object for custom data
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
      {
        id: "settings-profile",
        label: "Profile",
        to: "/settings/profile",
      },
      {
        id: "settings-account",
        label: "Account",
        to: "/settings/account",
      },
    ],
  },
];
```

#### ShellUser

User information object for the user menu in the top bar.

```tsx
type ShellUser = {
  name: string;                  // User's full name (required)
  email?: string;                // User's email address
  avatarUrl?: string;            // URL to user's avatar image
  extras?: ReactNode;            // Additional content to display in user menu header
  menuItems?: ShellUserMenuItem[]; // Custom menu items for the user dropdown
};
```

**Example:**
```tsx
const user: ShellUser = {
  name: "John Doe",
  email: "john.doe@example.com",
  avatarUrl: "/avatars/john.jpg",
  menuItems: [
    {
      id: "profile",
      label: "Profile",
      icon: User,
      href: "/profile",
    },
    {
      id: "logout",
      label: "Log out",
      icon: LogOut,
      onSelect: () => handleLogout(),
      danger: true,
    },
  ],
};
```

#### ShellUserMenuItem

Menu item for the user dropdown menu.

```tsx
type ShellUserMenuItem = {
  id: string;                    // Unique identifier (required)
  label: string;                 // Display text (required)
  icon?: ComponentType<{ className?: string }>; // Optional icon
  description?: string;          // Optional description
  href?: string;                 // External URL
  onSelect?: () => void;         // Callback when clicked
  danger?: boolean;              // Style as dangerous action (red text)
};
```

#### ShellSearchConfig

Configuration object for the search functionality.

```tsx
type ShellSearchConfig = {
  placeholder?: string;          // Placeholder text for search input (default: "Search...")
  value?: string;                // Controlled search value
  defaultValue?: string;         // Uncontrolled default value
  debounceMs?: number;           // Debounce delay for onChange in milliseconds
  onChange?: (value: string) => void; // Callback when search value changes
  onSubmit?: (value: string) => void;  // Callback when user submits search (Enter key)
  render?: (props: ShellSearchRenderProps) => ReactNode; // Custom render function
};
```

**Example:**
```tsx
const searchConfig: ShellSearchConfig = {
  placeholder: "Search modules, actions or pages",
  value: searchTerm,
  onChange: (value) => setSearchTerm(value),
  onSubmit: (value) => {
    console.log("Searching for:", value);
    // Perform search
  },
  debounceMs: 300,
};
```

#### ShellInstitution

Institution object for the institution selector.

```tsx
type ShellInstitution = {
  id: string;                    // Unique identifier (required)
  name: string;                  // Full institution name (required)
  acronym: string;               // Short acronym (required)
};
```

**Example:**
```tsx
const institutions: ShellInstitution[] = [
  {
    id: "1",
    name: "Ministry of Public Service and Labour",
    acronym: "MIFOTRA",
  },
  {
    id: "2",
    name: "Ministry of Finance and Economic Planning",
    acronym: "MINECOFIN",
  },
];
```

#### QuickAction

Quick action button configuration for the top bar.

```tsx
type QuickAction = {
  id: string;                    // Unique identifier (required)
  icon: ComponentType<{ className?: string }>; // Icon component (required)
  label?: string;                // Optional label text
  tooltip?: string;              // Tooltip text shown on hover
  onSelect?: () => void;         // Callback when clicked
  panel?: ReactNode;             // Panel content shown when action is clicked (sheet/modal)
  variant?: "default" | "primary"; // Visual variant (default: "default")
};
```

**Example:**
```tsx
const quickActions: QuickAction[] = [
  {
    id: "notifications",
    icon: Bell,
    label: "Notifications",
    tooltip: "View notifications",
    panel: <NotificationsPanel />,
  },
  {
    id: "help",
    icon: HelpCircle,
    label: "Help",
    tooltip: "Get help",
    panel: <HelpPanel />,
    variant: "primary",
  },
];
```

#### AppLauncherItem

Item for the app launcher menu.

```tsx
type AppLauncherItem = {
  id: string;                    // Unique identifier (required)
  label: string;                 // Display text (required)
  icon?: ComponentType<{ className?: string }>; // Optional icon
  description?: string;          // Optional description
  href?: string;                 // URL to navigate to
  onSelect?: () => void;         // Callback when clicked
};
```

**Example:**
```tsx
const appLauncherItems: AppLauncherItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard",
  },
  {
    id: "analytics",
    label: "Analytics",
    icon: BarChart,
    description: "View analytics and reports",
    href: "/analytics",
  },
];
```

#### PaginationConfig

Pagination configuration object.

```tsx
type PaginationConfig = {
  page: number;                        // Current page number (1-indexed)
  totalPages: number;                  // Total number of pages
  onChange: (page: number) => void;    // Callback when page changes
  label?: string;                      // Optional label text
  pageSize?: number;                   // Current page size
  pageSizeOptions?: number[];          // Available page sizes
  onPageSizeChange?: (size: number) => void; // Callback when size changes
  totalItems?: number;                 // Total number of records
  showNumbers?: boolean;               // Toggle numbered buttons
  isLoading?: boolean;                 // Disable controls + show spinner
};
```

**Example:**
```tsx
const pagination: PaginationConfig = {
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
};
```

#### Using `useShellPagination`

For most screens, you can register pagination controls via the `useShellPagination`
hook instead of manually passing `pagination` props to `AppShell`.

```tsx
import { useEffect, useState } from "react";
import { useShellPagination } from "@/theme/shell";

export const ApplicationsScreen = () => {
  const [rows, setRows] = useState([]);

  const {
    page,
    pageSize,
    setTotalItems,
    setLoading,
    isLoading,
  } = useShellPagination({
    initialPageSize: 20,
    pageSizeOptions: [10, 20, 50],
    onPageChange: (nextPage, size) => {
      fetchApplications(nextPage, size);
    },
    onPageSizeChange: (_, size) => {
      fetchApplications(1, size);
    },
  });

  const fetchApplications = async (nextPage = page, size = pageSize) => {
    setLoading(true);
    try {
      const response = await api.getApplications({ page: nextPage, size });
      setRows(response.items);
      setTotalItems(response.total);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications(page, pageSize);
  }, [page, pageSize]);

  return <ApplicationsTable data={rows} loading={isLoading} />;
};
```

Key tips:
- Mounting `useShellPagination` automatically renders the footer controls; unmounting removes them.
- Call `setTotalItems` when the backend returns the total count so the footer can display the range.
- Use `setLoading` (or pass the `loading` option) to show the spinner and temporarily disable controls during fetches.

#### ShellThemeOptions

Theme configuration for light/dark mode.

```tsx
type ShellThemeOptions = {
  initialMode?: "light" | "dark"; // Initial theme mode (default: "light")
  onModeChange?: (mode: "light" | "dark") => void; // Callback when theme changes
};
```

**Updated theme input note:** `ShellThemeOptions` still controls only mode (`light` / `dark`).  
Surface colors are now controlled with CSS variables (see [Styling](#styling)).

**Example:**
```tsx
const theme: ShellThemeOptions = {
  initialMode: "dark",
  onModeChange: (mode) => {
    console.log("Theme changed to:", mode);
    // Save theme preference
    localStorage.setItem("theme", mode);
  },
};
```

#### ShellLinkComponentProps

Props for custom link components.

```tsx
type ShellLinkComponentProps = {
  to?: string;                   // React Router path
  href?: string;                 // External URL
  className?: string;            // CSS classes
  children: ReactNode;           // Link content (required)
  onClick?: (event: MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => void; // Click handler
};
```

**Example:**
```tsx
// Custom link component for Next.js
const CustomLink = ({ to, href, className, children, onClick }: ShellLinkComponentProps) => {
  if (to) {
    return (
      <Link href={to} className={className} onClick={onClick}>
        {children}
      </Link>
    );
  }
  return (
    <a href={href} className={className} onClick={onClick}>
      {children}
    </a>
  );
};
```

## Examples

### Complete Example with All Properties

Here's a comprehensive example showing all available properties:

```tsx
import { useState } from "react";
import { AppShell, ShellMenuItem } from "@ippis/app-layout-theme";
import { 
  LayoutDashboard, 
  Users, 
  Settings, 
  FileText,
  Bell,
  HelpCircle,
  User,
  LogOut,
  BarChart
} from "lucide-react";
import { BrowserRouter } from "react-router-dom";
import { Button } from "@/components/ui/button"; // Adjust import path as needed

function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedInstitution, setSelectedInstitution] = useState("1");

  // Menu configuration
  const menus: ShellMenuItem[] = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      to: "/dashboard",
      badge: "New",
    },
    {
      id: "users",
      label: "Users",
      icon: Users,
      to: "/users",
      children: [
        {
          id: "users-active",
          label: "Active Users",
          to: "/users/active",
        },
        {
          id: "users-pending",
          label: "Pending",
          to: "/users/pending",
          badge: 5,
        },
      ],
    },
    {
      id: "documents",
      label: "Documents",
      icon: FileText,
      to: "/documents",
    },
    {
      id: "settings",
      label: "Settings",
      icon: Settings,
      to: "/settings",
      disabled: false,
    },
  ];

  // Institution configuration
  const institutions = [
    {
      id: "1",
      name: "Ministry of Public Service and Labour",
      acronym: "MIFOTRA",
    },
    {
      id: "2",
      name: "Ministry of Finance and Economic Planning",
      acronym: "MINECOFIN",
    },
  ];

  // User configuration
  const user = {
    name: "John Doe",
    email: "john.doe@example.com",
    avatarUrl: "/avatars/john.jpg",
    menuItems: [
      {
        id: "profile",
        label: "Profile",
        icon: User,
        href: "/profile",
      },
      {
        id: "logout",
        label: "Log out",
        icon: LogOut,
        onSelect: () => {
          console.log("Logging out...");
          // Handle logout
        },
        danger: true,
      },
    ],
  };

  // Quick actions configuration
  const quickActions = [
    {
      id: "notifications",
      icon: Bell,
      label: "Notifications",
      tooltip: "View notifications",
      panel: (
        <div className="p-4 space-y-2">
          <h3 className="font-semibold mb-2">Notifications</h3>
          <div className="space-y-2">
            <div className="p-2 bg-slate-100 dark:bg-[var(--ds-surface-overlay,#2B2C2F)] rounded">
              <p className="text-sm">New message received</p>
              <p className="text-xs text-slate-500">2 minutes ago</p>
            </div>
            <div className="p-2 bg-slate-100 dark:bg-[var(--ds-surface-overlay,#2B2C2F)] rounded">
              <p className="text-sm">Task assigned to you</p>
              <p className="text-xs text-slate-500">1 hour ago</p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "help",
      icon: HelpCircle,
      label: "Help",
      tooltip: "Get help and support",
      panel: (
        <div className="p-4">
          <h3 className="font-semibold mb-2">Help & Support</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Need assistance? Contact our support team or check the documentation.
          </p>
          <Button className="mt-4" variant="outline">
            Contact Support
          </Button>
        </div>
      ),
      variant: "primary" as const,
    },
  ];

  // App launcher items
  const appLauncherItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      href: "/dashboard",
    },
    {
      id: "analytics",
      label: "Analytics",
      icon: BarChart,
      description: "View analytics",
      href: "/analytics",
    },
  ];

  return (
    <BrowserRouter>
      <AppShell
        // Required props
        menus={menus}
        
        // Basic configuration
        title="My Application"
        subtitle="Application Description"
        logo={<img src="/logo.png" alt="Logo" />}
        
        // User configuration
        user={user}
        
        // Search configuration
        search={{
          placeholder: "Search modules, actions or pages",
          value: searchTerm,
          onChange: setSearchTerm,
          onSubmit: (value) => {
            console.log("Searching for:", value);
            // Perform search
          },
          debounceMs: 300,
        }}
        showSearch={true}
        
        // Institution selector
        institutions={institutions}
        selectedInstitutionId={selectedInstitution}
        onInstitutionChange={(id) => {
          setSelectedInstitution(id);
          console.log("Institution changed to:", id);
        }}
        institutionPlaceholder="Select institution"
        showInstitutionSelector={true}
        
        // Quick actions
        quickActions={quickActions}
        
        // App launcher
        appLauncherItems={appLauncherItems}
        
        // Custom sidebar content
        sidebarHeader={
          <div className="p-4 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
                ALT
              </div>
              <div>
                <h2 className="font-semibold text-sm">App Layout Theme</h2>
                <p className="text-xs text-slate-500">Custom Header</p>
              </div>
            </div>
          </div>
        }
        sidebarFooter={
          <div className="p-4 space-y-2">
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-center gap-2"
              onClick={() => window.open("https://github.com", "_blank")}
            >
              <HelpCircle className="h-4 w-4" />
              Support
            </Button>
          </div>
        }
        
        // Footer configuration
        footerContent={
          <footer className="text-sm text-center py-3 text-slate-600 dark:text-slate-400">
            © 2025 @ippis/app-layout-theme |{" "}
            <a
              href="#"
              className="hover:underline text-blue-600 dark:text-blue-400"
              onClick={(e) => {
                e.preventDefault();
                alert("Privacy policy");
              }}
            >
              Privacy
            </a>{" "}
            |{" "}
            <a
              href="#"
              className="hover:underline text-blue-600 dark:text-blue-400"
              onClick={(e) => {
                e.preventDefault();
                alert("Terms of service");
              }}
            >
              Terms
            </a>
          </footer>
        }
        showFooter={true}
        
        // Pagination
        pagination={{
          page: currentPage,
          totalPages: 10,
          onChange: (page) => {
            setCurrentPage(page);
            // Fetch data for new page
          },
          label: "Page",
        }}
        
        // Theme configuration
        theme={{
          initialMode: "light",
          onModeChange: (mode) => {
            console.log("Theme changed to:", mode);
            localStorage.setItem("theme", mode);
          },
        }}
        
        // Custom actions
        actions={
          <Button
            variant="secondary"
            size="sm"
            onClick={() => alert("Custom action clicked!")}
          >
            Quick Action
          </Button>
        }
        
        // Menu callbacks
        onMenuSelect={(item) => {
          console.log("Menu item selected:", item);
        }}
        
        // Styling
        className="custom-app-shell"
      >
        <div className="p-6 space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome to My Application</h1>
            <p className="text-slate-600 dark:text-slate-400">
              This is a comprehensive demonstration of all AppShell properties.
              The AppShell component provides a complete application shell with sidebar,
              top bar, user menu, search, and more.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-6 bg-white dark:bg-[var(--ds-surface-overlay,#2B2C2F)] rounded-lg shadow border border-slate-200 dark:border-[var(--ds-border,#E3E4F21F)]">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                  <LayoutDashboard className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <h2 className="text-xl font-semibold">Dashboard</h2>
              </div>
              <p className="text-slate-600 dark:text-slate-400">
                View your application dashboard with key metrics and insights.
              </p>
            </div>

            <div className="p-6 bg-white dark:bg-[var(--ds-surface-overlay,#2B2C2F)] rounded-lg shadow border border-slate-200 dark:border-[var(--ds-border,#E3E4F21F)]">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                  <Users className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <h2 className="text-xl font-semibold">User Management</h2>
              </div>
              <p className="text-slate-600 dark:text-slate-400">
                Manage users, roles, and permissions with ease.
              </p>
            </div>

            <div className="p-6 bg-white dark:bg-[var(--ds-surface-overlay,#2B2C2F)] rounded-lg shadow border border-slate-200 dark:border-[var(--ds-border,#E3E4F21F)]">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                  <FileText className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <h2 className="text-xl font-semibold">Documents</h2>
              </div>
              <p className="text-slate-600 dark:text-slate-400">
                Access and manage your documents and files.
              </p>
            </div>
          </div>

          <div className="p-6 bg-white dark:bg-[var(--ds-surface-overlay,#2B2C2F)] rounded-lg shadow border border-slate-200 dark:border-[var(--ds-border,#E3E4F21F)]">
            <h2 className="text-xl font-semibold mb-4">Features Demonstrated</h2>
            <ul className="space-y-2 text-slate-600 dark:text-slate-400">
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                Sidebar navigation with nested menus and badges
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                Institution selector in the top bar
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                Search functionality with debouncing
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                User menu with custom menu items
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                Quick actions with panels (notifications, help)
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                App launcher menu
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                Pagination controls
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                Light/dark theme toggle
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                Custom sidebar header and footer
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                Custom footer content
              </li>
            </ul>
          </div>
        </div>
      </AppShell>
    </BrowserRouter>
  );
}

export default App;
```

### Basic Usage

```tsx
import { AppShell } from "@ippis/app-layout-theme";

<AppShell
  title="My App"
  menus={menus}
  user={{ name: "John Doe", email: "john@example.com" }}
>
  <div>Your content here</div>
</AppShell>
```

### With Custom Logo

```tsx
<AppShell
  title="My App"
  logo={<img src="/logo.png" alt="Logo" />}
  menus={menus}
>
  <div>Content</div>
</AppShell>
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
  selectedInstitutionId="1"
  onInstitutionChange={(id) => console.log("Changed to:", id)}
>
  <div>Content</div>
</AppShell>
```

### With Search

```tsx
<AppShell
  title="My App"
  menus={menus}
  search={{
    placeholder: "Search...",
    value: searchTerm,
    onChange: setSearchTerm,
    onSubmit: (value) => {
      console.log("Searching for:", value);
    },
  }}
>
  <div>Content</div>
</AppShell>
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
      label: "Notifications",
      tooltip: "View notifications",
      panel: <NotificationsPanel />,
    },
    {
      id: "help",
      icon: HelpCircle,
      label: "Help",
      tooltip: "Get help",
      panel: <HelpPanel />,
    },
  ]}
>
  <div>Content</div>
</AppShell>
```

### With Pagination

```tsx
<AppShell
  title="My App"
  menus={menus}
  pagination={{
    page: currentPage,
    totalPages: 10,
    onChange: (page) => setCurrentPage(page),
  }}
>
  <div>Content</div>
</AppShell>
```

### Custom Link Component

If you're using a different routing library:

```tsx
import { Link } from "your-router-library";

const CustomLink = ({ to, href, className, children, onClick }) => {
  if (to) {
    return (
      <Link to={to} className={className} onClick={onClick}>
        {children}
      </Link>
    );
  }
  return (
    <a href={href} className={className} onClick={onClick}>
      {children}
    </a>
  );
};

<AppShell
  title="My App"
  menus={menus}
  linkComponent={CustomLink}
>
  <div>Content</div>
</AppShell>
```

## Styling

The library uses Tailwind CSS for styling. You can customize the appearance by:

1. **CSS Variables**: Override CSS variables in your global CSS:

```css
:root {
  --ds-surface: #ffffff;
  --ds-surface-overlay: #ffffff;
  --ds-text: #172b4d;
  --ds-border: #E3E4F21F;
  --ds-link: #669DF1;
}

.dark {
  --ds-surface: #1F1F21;
  --ds-surface-overlay: #2B2C2F; /* primary dark surface for cards/tables/modals */
  --ds-text: #CECFD2;
  --ds-border: #E3E4F21F;
  --ds-link: #669DF1;

  --primary: 226.6667 66.0550% 42.7451%;
  --primary-foreground: 0 0% 100%;
  /* ... other variables */
}
```

2. **Use the overlay surface in custom content** (recommended for dark mode cards/tables/modals):

```tsx
<div className="bg-white dark:bg-[var(--ds-surface-overlay,#2B2C2F)]" />
<div className="border-slate-200 dark:border-[var(--ds-border,#E3E4F21F)]" />
```

3. **Tailwind Config**: Extend the theme in your `tailwind.config.js`:

```js
export default {
  theme: {
    extend: {
      colors: {
        primary: "hsl(var(--primary))",
        // ... other colors
      },
    },
  },
}
```

## TypeScript

The library is fully typed. Import types as needed:

```tsx
import type {
  ShellMenuItem,
  ShellUser,
  ShellSearchConfig,
  AppShellProps,
} from "@ippis/app-layout-theme";
```

## Browser Support

- Chrome (last 2 versions)
- Firefox (last 2 versions)
- Safari (last 2 versions)
- Edge (last 2 versions)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT

## Publishing

If you want to publish this library to npm, see [PUBLISHING.md](./PUBLISHING.md) for detailed instructions.

Quick steps:
1. Update `package.json` with your repository URLs
2. Build the library: `npm run build:lib`
3. Test: `npm publish --dry-run`
4. Publish: `npm publish`

## Support

For issues and questions, please open an issue on the GitHub repository.
