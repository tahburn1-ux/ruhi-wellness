import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";

export function useAdminAuth() {
  const { data: admin, isLoading } = trpc.adminAuth.check.useQuery(undefined, {
    retry: false,
    staleTime: 30_000,
  });
  const logoutMutation = trpc.adminAuth.logout.useMutation();
  const [, setLocation] = useLocation();

  const logout = async () => {
    await logoutMutation.mutateAsync();
    setLocation("/admin/login");
  };

  return {
    admin,
    isLoading,
    isAuthenticated: !!admin,
    logout,
  };
}
