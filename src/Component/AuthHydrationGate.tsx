import React, { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { authKeys, AuthUser, getAuthFromStorage } from "@/utils/lib";

export default function AuthHydrationGate({
  children,
}: {
  children: React.ReactNode;
}) {
  const queryClient = useQueryClient();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const storedAuth = getAuthFromStorage();

    if (storedAuth) {
      queryClient.setQueryData<AuthUser>(authKeys.me, storedAuth);
    }

    setReady(true);
  }, [queryClient]);

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 text-gray-900 dark:bg-gray-950 dark:text-white">
        Loading...
      </div>
    );
  }

  return <>{children}</>;
}