import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import "@/index.css";
import { BrowserRouter } from "react-router-dom";
import { AppShell, ShellMenuItem } from "@/theme";
import {
  LayoutDashboard,
  Users,
  Settings,
  FileText,
  Bell,
  HelpCircle,
  User,
  LogOut,
  BarChart,
} from "lucide-react";
import { Button } from "@/components/ui/button";

// Comprehensive demo component showcasing all AppShell properties
const DemoApp = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedInstitution, setSelectedInstitution] = useState("1");

  // Menu configuration with nested items and badges
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
      children: [
        {
          id: "settings-profile",
          label: "Profile Settings",
          to: "/settings/profile",
        },
        {
          id: "settings-account",
          label: "Account Settings",
          to: "/settings/account",
        },
      ],
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
    {
      id: "3",
      name: "Rwanda Social Security Board",
      acronym: "RSSB",
    },
  ];

  // User configuration with custom menu items
  const user = {
    name: "John Doe",
    email: "john.doe@example.com",
    avatarUrl: undefined, // Will use generated avatar
    menuItems: [
      {
        id: "profile",
        label: "Profile",
        icon: User,
        href: "/profile",
      },
      {
        id: "settings",
        label: "Account Settings",
        icon: Settings,
        href: "/settings",
      },
      {
        id: "logout",
        label: "Log out",
        icon: LogOut,
        onSelect: () => {
          console.log("Logging out...");
          alert("Logout functionality would be implemented here");
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
            <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded">
              <p className="text-sm">New message received</p>
              <p className="text-xs text-slate-500">2 minutes ago</p>
            </div>
            <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded">
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
      description: "View analytics and reports",
      href: "/analytics",
    },
    {
      id: "documents",
      label: "Documents",
      icon: FileText,
      href: "/documents",
    },
  ];

  return (
    <AppShell
      // Required props
      menus={menus}
      
      // Basic configuration
      title="App Layout Theme Demo"
      subtitle="A comprehensive demonstration of all AppShell properties"
      logo={
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
            ALT
          </div>
          <span className="font-semibold">App Layout</span>
        </div>
      }
      
      // User configuration
      user={user}
      
      // Search configuration
      search={{
        placeholder: "Search modules, actions or pages...",
        value: searchTerm,
        onChange: setSearchTerm,
        onSubmit: (value) => {
          console.log("Searching for:", value);
          alert(`Searching for: ${value}`);
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
          <div className="flex items-center gap-2 mb-2">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
              ALT
            </div>
            <div>
              <h2 className="font-semibold text-sm">App Layout Theme</h2>
              <p className="text-xs text-slate-500">Demo Application</p>
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
          console.log("Page changed to:", page);
        },
        label: "Page",
      }}
      
      // Theme configuration
      theme={{
        initialMode: "light",
        onModeChange: (mode) => {
          console.log("Theme changed to:", mode);
          // In a real app, you might save this to localStorage
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
      className="demo-app-shell"
    >
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Welcome to App Layout Theme</h1>
          <p className="text-slate-600 dark:text-slate-400">
            This is a comprehensive demonstration of the @ippis/app-layout-theme library.
            The AppShell component provides a complete application shell with sidebar,
            top bar, user menu, search, and more.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-6 bg-white dark:bg-slate-800 rounded-lg shadow border border-slate-200 dark:border-slate-700">
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

          <div className="p-6 bg-white dark:bg-slate-800 rounded-lg shadow border border-slate-200 dark:border-slate-700">
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

          <div className="p-6 bg-white dark:bg-slate-800 rounded-lg shadow border border-slate-200 dark:border-slate-700">
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

        <div className="p-6 bg-white dark:bg-slate-800 rounded-lg shadow border border-slate-200 dark:border-slate-700">
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

        <div className="p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
            📚 Documentation
          </h3>
          <p className="text-sm text-blue-800 dark:text-blue-200">
            Check the README.md file for complete API documentation and usage examples.
            All properties are fully documented with types, descriptions, and examples.
          </p>
        </div>
      </div>
    </AppShell>
  );
};

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
      <BrowserRouter>
      <DemoApp />
      </BrowserRouter>
  </React.StrictMode>
);
