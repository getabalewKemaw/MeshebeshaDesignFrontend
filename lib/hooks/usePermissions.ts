import { authClient } from "@/lib/auth-client";
import { useAuth } from "./useAuth";

export function usePermissions() {
  const { user } = useAuth();

  const checkPermission = (resource: string, actions: string[]) => {
    if (!user || !user.role) return false;
    
    return authClient.admin.checkRolePermission({
      permissions: {
        [resource]: actions,
      },
      role: user.role as "user" | "admin",
    });
  };

  const hasPermission = async (resource: string, actions: string[]) => {
    const { data } = await authClient.admin.hasPermission({
      permissions: {
        [resource]: actions,
      },
    });
    return data;
  };

  return {
    checkPermission,
    hasPermission,
    canCreateProduct: checkPermission("product", ["create"]),
    canUpdateProduct: checkPermission("product", ["update"]),
    canDeleteProduct: checkPermission("product", ["delete"]),
    canViewAnalytics: checkPermission("analytics", ["view"]),
    canManageUsers: checkPermission("user", ["create", "delete"]),
  };
}
