import { Button, Divider } from "@heroui/react";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import Head from "next/head";
import HelpLayout from "../../../components/HelpLayout";

export default function SetupAccountPage() {
  return (
    <div className="max-w-md mx-auto px-4 py-8 text-gray-900">
        <HelpLayout
            title="Set Up Your Account U+002d ClariSpend Help"
            header="Set Up Your Account"
            subHeader="Follow these simple steps to get started with ClariSpend."
            content={
                <div className="space-y-6 text-sm leading-relaxed">
                    <div>
                    <h2 className="text-base font-medium mb-1">1. Tap "Sign Up"</h2>
                    <p className="text-muted-foreground">
                        On the welcome screen of the app, tap the button labeled <strong>"Sign Up"</strong> to begin the
                        registration process.
                    </p>
                    </div>

                    <div>
                    <h2 className="text-base font-medium mb-1">2. Enter your details</h2>
                    <p className="text-muted-foreground">
                        Fill in your <strong>full name</strong>, <strong>email</strong>, and create a <strong>secure password</strong>.
                        Once complete, tap <strong>Continue</strong> to proceed.
                    </p>
                    </div>

                    <div>
                    <h2 className="text-base font-medium mb-1">3. Confirm your email</h2>
                    <p className="text-muted-foreground">
                        Check your inbox for a confirmation email. Tap the verification link to activate your account. If you don't
                        see it, check your spam or junk folder.
                    </p>
                    </div>

                    <div>
                    <h2 className="text-base font-medium mb-1">4. Log in</h2>
                    <p className="text-muted-foreground">
                        Return to the app and log in using your newly created email and password. You’ll be taken to onboarding.
                    </p>
                    </div>

                    <div>
                    <h2 className="text-base font-medium mb-1">5. Set up preferences</h2>
                    <p className="text-muted-foreground">
                        Choose your preferred <strong>currency</strong>, enter your <strong>monthly income</strong>, and select the{" "}
                        <strong>spending categories</strong> you care about most.
                    </p>
                    </div>

                    <div className="text-muted-foreground">
                    That’s it — your ClariSpend account is ready. Need help logging in?{" "}
                    <Link href="/help/login-problems" className="text-blue-600 hover:underline">
                        Troubleshoot here
                    </Link>
                    .
                    </div>
                </div>
            }
        />
    </div>
  );
}
