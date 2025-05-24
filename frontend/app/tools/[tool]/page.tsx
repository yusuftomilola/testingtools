"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Lock } from "lucide-react";
import { useAuth } from "@/components/auth-provider";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ToolComponents } from "@/components/tool-components";

export default function ToolPage({ params }: { params: { tool: string } }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const toolSlug = params.tool;

  // Get tool component based on slug
  const ToolComponent = ToolComponents[toolSlug];

  // Redirect if tool doesn't exist
  useEffect(() => {
    if (!isLoading && !ToolComponent) {
      router.push("/tools");
    }
  }, [isLoading, ToolComponent, router]);

  if (isLoading) {
    return (
      <div className="container flex h-[calc(100vh-4rem)] items-center justify-center">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (!ToolComponent) {
    return null;
  }

  // If user is not logged in, show locked view
  if (!user) {
    return (
      <div className="container py-8">
        <Card className="mx-auto max-w-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5" />
              Tool Locked
            </CardTitle>
            <CardDescription>
              You need to be logged in to use this tool
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center p-12">
            <div className="mb-6 text-center text-muted-foreground">
              <p>This tool is only available to registered users.</p>
              <p>Please sign in or create an account to continue.</p>
            </div>
            <div className="flex gap-4">
              <Button asChild>
                <Link href="/login">Sign In</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/login?tab=register">Create Account</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // User is logged in, show the tool
  return (
    <div className="container py-8">
      <ToolComponent />
    </div>
  );
}
