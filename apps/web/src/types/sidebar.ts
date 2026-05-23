export type SidebarItem = {
  title: string;
  url: string;
  icon?: React.ElementType;
  permission?: string;
  items?: SidebarItem[];
};
