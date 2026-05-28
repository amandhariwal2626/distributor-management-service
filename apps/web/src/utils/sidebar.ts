import { SidebarItem } from "@/types/sidebar";

const OWNER_PERMISSION = "settings.owner";

function checkPermission(permissions: string[], required: string | undefined) {
  if (!required) return true;
  if (permissions.includes(OWNER_PERMISSION)) return true;
  return permissions.includes(required);
}

export const filterSidebarByPermissions = (
  items: SidebarItem[],
  permissions: string[],
) => {
  return items
    .map((item) => ({
      ...item,
      items: item.items?.filter(
        (subItem) => checkPermission(permissions, subItem.permission),
      ),
    }))
    .filter((item) => checkPermission(permissions, item.permission));
};
