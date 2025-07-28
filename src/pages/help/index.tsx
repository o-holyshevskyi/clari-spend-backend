import { useState } from "react";
import { useRouter } from "next/router";
import { Input, Card, CardBody, Button, Divider } from "@heroui/react";
import { ChevronRight, ChevronDown, HelpCircle } from "lucide-react";
import Link from "next/link";

type HelpItem = {
  id: string;
  title: string;
  subtitle?: string;
  route: string;
};

type HelpSection = {
  id: string;
  title: string;
  items: HelpItem[];
};

const helpSections: HelpSection[] = [
  {
    id: "getting_started",
    title: "Getting Started",
    items: [
      {
        id: "setup_account",
        title: "Set up your account",
        subtitle: "Create and configure your profile",
        route: "/help/setup-account",
      },
      {
        id: "first_transaction",
        title: "Add your first transaction",
        subtitle: "Start tracking expenses easily",
        route: "/help/first-transaction",
      },
      {
        id: "create_budget",
        title: "Create a budget",
        subtitle: "Plan your monthly spending",
        route: "/help/create-budget",
      },
    ],
  },
  {
    id: "account_management",
    title: "Account Management",
    items: [
      {
        id: "change_password",
        title: "Change password",
        subtitle: "Update your login credentials",
        route: "/help/change-password",
      },
      {
        id: "update_profile",
        title: "Update profile",
        subtitle: "Edit personal information",
        route: "/help/update-profile",
      },
      {
        id: "notifications",
        title: "Manage notifications",
        subtitle: "Customize app alerts",
        route: "/help/notifications",
      },
    ],
  },
  {
    id: "features",
    title: "App Features",
    items: [
      {
        id: "budgeting",
        title: "Budgeting tools",
        subtitle: "How to set and manage budgets",
        route: "/help/budgeting",
      },
      {
        id: "reports",
        title: "Reports",
        subtitle: "Visualize your spending data",
        route: "/help/reports",
      },
      {
        id: "categories",
        title: "Categories",
        subtitle: "Organize your expenses",
        route: "/help/categories",
      },
    ],
  },
  {
    id: "troubleshooting",
    title: "Troubleshooting",
    items: [
      {
        id: "sync_issues",
        title: "Sync issues",
        subtitle: "Resolve data syncing problems",
        route: "/help/sync-issues",
      },
      {
        id: "app_crashes",
        title: "App crashes",
        subtitle: "What to do when the app fails",
        route: "/help/app-crashes",
      },
      {
        id: "login_problems",
        title: "Login problems",
        subtitle: "Recover your access",
        route: "/help/login-problems",
      },
    ],
  },
];

export default function HelpCenterPage() {
  const [expanded, setExpanded] = useState<string[]>(helpSections.map(s => s.id));
  const toggleSection = (id: string) => {
    setExpanded(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-10">
      {/* Page Title */}
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-2">Help Center</h1>
        <p className="text-gray-600">Find answers and guidance for using our app</p>
      </div>

      {/* Search */}
      <div className="flex justify-center">
        <Input placeholder="Search help topics..." className="max-w-md" />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="hover:shadow-md transition">
          <CardBody className="p-4 text-center space-y-2">
            <HelpCircle className="mx-auto h-6 w-6 text-blue-500" />
            <Button variant="faded" >
              <Link href="/user-guide">User Guide</Link>
            </Button>
          </CardBody>
        </Card>
        <Card className="hover:shadow-md transition">
          <CardBody className="p-4 text-center space-y-2">
            <HelpCircle className="mx-auto h-6 w-6 text-green-500" />
            <Button variant="faded" >
              <Link href="/tutorials">Video Tutorials</Link>
            </Button>
          </CardBody>
        </Card>
        <Card className="hover:shadow-md transition">
          <CardBody className="p-4 text-center space-y-2">
            <HelpCircle className="mx-auto h-6 w-6 text-yellow-500" />
            <Button variant="faded" >
              <Link href="/faq">FAQ</Link>
            </Button>
          </CardBody>
        </Card>
        <Card className="hover:shadow-md transition">
          <CardBody className="p-4 text-center space-y-2">
            <HelpCircle className="mx-auto h-6 w-6 text-red-500" />
            <Button variant="faded" >
              <Link href="/support">Contact Support</Link>
            </Button>
          </CardBody>
        </Card>
      </div>

      {/* Sections */}
      <div className="space-y-6">
        {helpSections.map((section) => (
          <div key={section.id}>
            <div
              className="flex items-center justify-between cursor-pointer group"
              onClick={() => toggleSection(section.id)}
            >
              <h2 className="text-xl font-semibold">{section.title}</h2>
              {expanded.includes(section.id) ? (
                <ChevronDown className="w-5 h-5 text-gray-400 group-hover:text-black" />
              ) : (
                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-black" />
              )}
            </div>

            {expanded.includes(section.id) && (
              <div className="mt-4 space-y-3">
                {section.items.map((item) => (
                  <Link
                    key={item.id}
                    href={item.route}
                    className="block border rounded-lg p-4 hover:bg-gray-50 transition"
                  >
                    <div className="font-medium text-gray-900">{item.title}</div>
                    {item.subtitle && (
                      <div className="text-sm text-gray-500">{item.subtitle}</div>
                    )}
                  </Link>
                ))}
              </div>
            )}

            <Divider className="my-6" />
          </div>
        ))}
      </div>
    </div>
  );
}
