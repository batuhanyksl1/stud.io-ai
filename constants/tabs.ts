import { createTabIcon } from "@/components/tabs/TabIcon";

export type TabName = "index" | "creationPage" | "profile";

export type TabConfig = {
  name: TabName;
  title: string;
  href?: string | null;
  tabBarIcon?: ReturnType<typeof createTabIcon>;
};

export const tabConfigs = [
  {
    name: "index" as const,
    title: "Create",
    tabBarIcon: createTabIcon("hammer", "hammer-outline"),
  },
  {
    name: "creationPage" as const,
    title: "creationPage",
    href: null, //href null ise tabBarIcon gösterilmez
  },
  {
    name: "profile" as const,
    title: "Profile",
    tabBarIcon: createTabIcon("person", "person-outline"),
  },
] satisfies TabConfig[];
