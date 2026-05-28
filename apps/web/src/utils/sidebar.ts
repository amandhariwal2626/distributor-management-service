import { SidebarItem } from "@/types/sidebar";

export const filterSidebarByPermissions = (
  items: SidebarItem[],
  permissions: string[],
) => {
  return items
    .map((item) => ({
      ...item,
      items: item.items?.filter(
        (subItem) => !subItem.permission || permissions.includes(subItem.permission),
      ),
    }))
    .filter((item) => !item.permission || permissions.includes(item.permission));
};
