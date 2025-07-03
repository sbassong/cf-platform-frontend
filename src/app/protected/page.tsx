'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function ProtectedPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/signin');
    }
  }, [user, isLoading, router]);

  if (isLoading || !user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Alert className="max-w-sm">
          <Loader2 className="h-4 w-4 animate-spin" />
          <AlertTitle>Loading...</AlertTitle>
          <AlertDescription>
            Verifying authentication status. Please wait.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl py-12">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl">Protected Dashboard</CardTitle>
          <CardDescription>
            This page is protected. Only authenticated users can see it.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-xl font-semibold">
              Welcome, {user.profile.displayName}!
            </h2>
            <p className="text-sm text-muted-foreground">
              @{user.profile.username}
            </p>
          </div>

          <Card className="bg-muted/50">
            <CardHeader>
              <CardTitle>Your Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p>
                <span className="font-semibold">Email:</span> {user.email}
              </p>
              <p>
                <span className="font-semibold">User Role:</span> {user.role}
              </p>
              <p>
                <span className="font-semibold">Profile ID:</span> {user.profile._id}
              </p>
              <p>
                <span className="font-semibold">User ID:</span> {user._id}
              </p>
            </CardContent>
          </Card>

          <div>
            <h3 className="text-lg font-semibold mb-2">Raw User Object:</h3>
            <pre className="bg-foreground/5 text-foreground/90 p-4 rounded-md text-xs overflow-x-auto">
              {JSON.stringify(user, null, 2)}
            </pre>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}