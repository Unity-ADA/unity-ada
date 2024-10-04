
interface MenuItem {
  label: string;
  route: string;
  children?: MenuItem[];
}

interface SidebarItem {
  name: string;
  menu_items: MenuItem[];
}

const SidebarItems = () => {

  const sidebar_items: SidebarItem[] = [
    {
      name: "",
      menu_items: [
        {
          label: "Home",
          route: "/",
        },
        {
          label: "Forums",
          route: "/forums",
        },
        {
          label: "Unity",
          route: "",
          children: [
            { label: "Tokens", route: "/tokens" },
            { label: "Apps", route: "/apps" },
            { label: "Curators", route: "/curators" },
          ]
        },
        {
          label: "Development",
          route: "/development",
        },
      ],
    },
  ];

  return sidebar_items;
};

export default SidebarItems;
