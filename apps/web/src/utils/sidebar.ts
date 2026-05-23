import { SidebarItem } from "@/types/sidebar";

export const filterSidebarByPermissions = (
  items: SidebarItem[],
  permissions: string[],
) => {
  return items.filter((item) => {
    // Parent permission check
    if (item.permission && !permissions.includes(item.permission)) {
      return false;
    }

    // Nested items filtering
    if (item.items) {
      item.items = item.items.filter(
        (subItem) =>
          !subItem.permission || permissions.includes(subItem.permission),
      );
    }

    return true;
  });
};
