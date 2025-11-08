import { createAccessControl } from "better-auth/plugins/access";
import { defaultStatements, adminAc } from "better-auth/plugins/admin/access";

// Define custom permissions (must match server-side)
export const statement = {
  ...defaultStatements,
  product: ["create", "update", "delete", "view", "publish"],
  order: ["view", "update", "cancel", "refund"],
  customRequest: ["view", "update", "approve", "reject"],
  category: ["create", "update", "delete"],
  review: ["view", "delete", "moderate"],
  analytics: ["view"],
} as const;

// Create access controller
export const ac = createAccessControl(statement);

// Define roles (must match server-side)
export const admin = ac.newRole({
  ...adminAc.statements,
  product: ["create", "update", "delete", "view", "publish"],
  order: ["view", "update", "cancel", "refund"],
  customRequest: ["view", "update", "approve", "reject"],
  category: ["create", "update", "delete"],
  review: ["view", "delete", "moderate"],
  analytics: ["view"],
});

export const user = ac.newRole({
  product: ["view"],
  order: ["view"],
  customRequest: ["view"],
  review: ["view"],
});

export const roles = {
  admin,
  user,
};
