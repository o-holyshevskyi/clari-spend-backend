// app/help/page.tsx
"use client";

import { useState } from 'react';
import { Card, CardBody, CardHeader, Accordion, AccordionItem, Button, Input } from '@heroui/react';
import Link from 'next/link';
import { 
  UserPlus, 
  PlusCircle, 
  PieChart, 
  Lock, 
  UserCircle, 
  Bell, 
  Calculator, 
  BarChart3, 
  Grid3X3, 
  RotateCcw, 
  AlertTriangle, 
  LogIn,
  ChevronRight,
  Search,
  Mail,
  Book,
  Play,
  HelpCircle
} from 'lucide-react';

export default function HelpCenter() {
  const [searchQuery, setSearchQuery] = useState('');

  const quickActions = [
    {
      id: 'contact_support',
      title: 'Contact Support',
      icon: Mail,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      href: '/help/contact'
    },
    {
      id: 'user_guide',
      title: 'User Guide',
      icon: Book,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      href: '/help/user-guide'
    },
    {
      id: 'video_tutorials',
      title: 'Video Tutorials',
      icon: Play,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      href: '/help/tutorials'
    },
    {
      id: 'faq',
      title: 'FAQ',
      icon: HelpCircle,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      href: '/help/faq'
    }
  ];

  const helpSections = [
    {
      id: 'getting_started',
      title: 'Getting Started',
      items: [
        {
          id: 'setup_account',
          title: 'Set Up Your Account',
          subtitle: 'Learn how to create and configure your ClariSpend account',
          icon: UserPlus,
          color: 'text-blue-600',
          bgColor: 'bg-blue-50',
          href: '/help/setup-account'
        },
        {
          id: 'first_transaction',
          title: 'Add Your First Transaction',
          subtitle: 'Step-by-step guide to recording your first expense or income',
          icon: PlusCircle,
          color: 'text-green-600',
          bgColor: 'bg-green-50',
          href: '/help/first-transaction'
        },
        {
          id: 'create_budget',
          title: 'Create Your First Budget',
          subtitle: 'Set up budgets to track and control your spending',
          icon: PieChart,
          color: 'text-orange-600',
          bgColor: 'bg-orange-50',
          href: '/help/create-budget'
        }
      ]
    },
    {
      id: 'account_management',
      title: 'Account Management',
      items: [
        {
          id: 'change_password',
          title: 'Change Your Password',
          subtitle: 'Keep your account secure with a strong password',
          icon: Lock,
          color: 'text-gray-600',
          bgColor: 'bg-gray-50',
          href: '/help/change-password'
        },
        {
          id: 'update_profile',
          title: 'Update Your Profile',
          subtitle: 'Manage your personal information and preferences',
          icon: UserCircle,
          color: 'text-purple-600',
          bgColor: 'bg-purple-50',
          href: '/help/update-profile'
        },
        {
          id: 'notifications',
          title: 'Notification Settings',
          subtitle: 'Control how and when you receive notifications',
          icon: Bell,
          color: 'text-orange-600',
          bgColor: 'bg-orange-50',
          href: '/help/notifications'
        }
      ]
    },
    {
      id: 'features',
      title: 'Features',
      items: [
        {
          id: 'budgeting',
          title: 'Budgeting Tools',
          subtitle: 'Master the art of budgeting with ClariSpend',
          icon: Calculator,
          color: 'text-blue-600',
          bgColor: 'bg-blue-50',
          href: '/help/budgeting'
        },
        {
          id: 'reports',
          title: 'Reports & Analytics',
          subtitle: 'Understand your spending patterns with detailed reports',
          icon: BarChart3,
          color: 'text-green-600',
          bgColor: 'bg-green-50',
          href: '/help/reports'
        },
        {
          id: 'categories',
          title: 'Managing Categories',
          subtitle: 'Organize your transactions with custom categories',
          icon: Grid3X3,
          color: 'text-orange-600',
          bgColor: 'bg-orange-50',
          href: '/help/categories'
        }
      ]
    },
    {
      id: 'troubleshooting',
      title: 'Troubleshooting',
      items: [
        {
          id: 'sync_issues',
          title: 'Sync Issues',
          subtitle: 'Fix problems with data synchronization',
          icon: RotateCcw,
          color: 'text-red-600',
          bgColor: 'bg-red-50',
          href: '/help/sync-issues'
        },
        {
          id: 'app_crashes',
          title: 'App Crashes',
          subtitle: 'Resolve app stability and performance issues',
          icon: AlertTriangle,
          color: 'text-orange-600',
          bgColor: 'bg-orange-50',
          href: '/help/app-crashes'
        },
        {
          id: 'login_problems',
          title: 'Login Problems',
          subtitle: 'Troubleshoot authentication and login issues',
          icon: LogIn,
          color: 'text-purple-600',
          bgColor: 'bg-purple-50',
          href: '/help/login-problems'
        }
      ]
    }
  ];

  const filteredSections = helpSections.map(section => ({
    ...section,
    items: section.items.filter(item => 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.subtitle.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(section => section.items.length > 0);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">How can we help you?</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Find answers to your questions, learn how to use ClariSpend features, and get the most out of your financial management experience.
        </p>
      </div>

      {/* Search Bar */}
      <div className="max-w-lg mx-auto">
        <Input
          type="text"
          placeholder="Search help articles..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          startContent={<Search className="w-4 h-4 text-gray-400" />}
          size="lg"
          className="w-full"
        />
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold text-gray-900">Quick Actions</h2>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Link key={action.id} href={action.href}>
                  <Card className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardBody className="text-center p-6">
                      <div className={`w-12 h-12 ${action.bgColor} rounded-lg flex items-center justify-center mx-auto mb-3`}>
                        <Icon className={`w-6 h-6 ${action.color}`} />
                      </div>
                      <h3 className="font-medium text-gray-900">{action.title}</h3>
                    </CardBody>
                  </Card>
                </Link>
              );
            })}
          </div>
        </CardBody>
      </Card>

      {/* Help Sections */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold text-gray-900">Browse by Topic</h2>
        </CardHeader>
        <CardBody>
          <Accordion variant="splitted" defaultExpandedKeys={['getting_started']}>
            {filteredSections.map((section) => (
              <AccordionItem key={section.id} title={section.title}>
                <div className="space-y-3">
                  {section.items.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link key={item.id} href={item.href}>
                        <div className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors group">
                          <div className={`w-8 h-8 ${item.bgColor} rounded-lg flex items-center justify-center mr-3`}>
                            <Icon className={`w-4 h-4 ${item.color}`} />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900 group-hover:text-blue-600">
                              {item.title}
                            </h4>
                            <p className="text-sm text-gray-500">{item.subtitle}</p>
                          </div>
                          <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600" />
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </AccordionItem>
            ))}
          </Accordion>
        </CardBody>
      </Card>

      {/* Search Help */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardBody className="text-center p-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Can't find what you're looking for?
          </h3>
          <p className="text-gray-600 mb-6">
            Try our advanced search or browse all help articles
          </p>
          <div className="flex justify-center space-x-4">
            <Button 
              as={Link} 
              href="/help/search" 
              color="primary" 
              variant="solid"
              startContent={<Search className="w-4 h-4" />}
            >
              Advanced Search
            </Button>
            <Button 
              as={Link} 
              href="/help/contact" 
              color="primary" 
              variant="bordered"
              startContent={<Mail className="w-4 h-4" />}
            >
              Contact Support
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}