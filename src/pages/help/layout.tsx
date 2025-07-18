// app/help/layout.tsx

import Link from 'next/link';
import { ArrowLeft, Home, Search, Mail, Book, Play, HelpCircle } from 'lucide-react';

export default function HelpLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-4">
                <Link href="/" className="flex items-center text-blue-600 hover:text-blue-700">
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  <span className="font-medium">Back to App</span>
                </Link>
                <div className="hidden sm:block w-px h-6 bg-gray-300" />
                <Link href="/help" className="flex items-center text-gray-700 hover:text-gray-900">
                  <Home className="w-5 h-5 mr-2" />
                  <span className="font-medium">Help Center</span>
                </Link>
              </div>
              
              <div className="flex items-center space-x-4">
                <Link href="/help/search" className="flex items-center text-gray-600 hover:text-gray-900">
                  <Search className="w-5 h-5 mr-2" />
                  <span className="hidden sm:inline">Search</span>
                </Link>
                <Link href="/help/contact" className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                  <Mail className="w-4 h-4 mr-2" />
                  <span>Contact Support</span>
                </Link>
              </div>
            </div>
          </div>
        </header>

        {/* Quick Actions Bar */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex flex-wrap gap-4 justify-center sm:justify-start">
              <Link href="/help/contact" className="flex items-center text-blue-600 hover:text-blue-700 px-3 py-2 rounded-lg hover:bg-blue-50">
                <Mail className="w-4 h-4 mr-2" />
                <span className="text-sm font-medium">Contact Support</span>
              </Link>
              <Link href="/help/user-guide" className="flex items-center text-green-600 hover:text-green-700 px-3 py-2 rounded-lg hover:bg-green-50">
                <Book className="w-4 h-4 mr-2" />
                <span className="text-sm font-medium">User Guide</span>
              </Link>
              <Link href="/help/tutorials" className="flex items-center text-orange-600 hover:text-orange-700 px-3 py-2 rounded-lg hover:bg-orange-50">
                <Play className="w-4 h-4 mr-2" />
                <span className="text-sm font-medium">Video Tutorials</span>
              </Link>
              <Link href="/help/faq" className="flex items-center text-purple-600 hover:text-purple-700 px-3 py-2 rounded-lg hover:bg-purple-50">
                <HelpCircle className="w-4 h-4 mr-2" />
                <span className="text-sm font-medium">FAQ</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 mt-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">ClariSpend</h3>
              <p className="text-gray-600 mb-4">
                Your personal finance companion for smart money management
              </p>
              <div className="flex justify-center space-x-6">
                <Link href="/help/contact" className="text-blue-600 hover:text-blue-700">
                  Contact Support
                </Link>
                <Link href="/help/privacy" className="text-blue-600 hover:text-blue-700">
                  Privacy Policy
                </Link>
                <Link href="/help/terms" className="text-blue-600 hover:text-blue-700">
                  Terms of Service
                </Link>
              </div>
            </div>
          </div>
        </footer>
    </div>
  );
}