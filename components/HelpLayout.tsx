import { Divider } from "@heroui/react";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import Head from "next/head";
import { JSX } from "react";

interface HelpLayoutProps {
    title: string;
    header: string;
    subHeader: string;
    content: JSX.Element
}

function HelpLayout({ title, header, subHeader, content }: HelpLayoutProps) {
  return (
    <div>
      <Head>
        <title>{title}</title>
        <meta
          name="description"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <div className="flex items-center gap-2 mb-6">
        <ArrowLeft className="w-4 h-4 text-muted-foreground" />
        <Link href="/help" className="text-sm text-muted-foreground hover:underline">
          Back to Help Center
        </Link>
      </div>

      <h1 className="text-2xl font-semibold mb-1">{header}</h1>
      <p className="text-sm text-muted-foreground mb-4">
        {subHeader}
      </p>

      <Divider className="mb-6" />

      {content}
    </div>
  );
}

export default HelpLayout;