import useLocalStorage from "@/hooks/useLocalStorage";
import SidebarItem from "./sidebar/SidebarItem";
import sidebar_items from "./sidebar/menu";
import ClickOutside from "@/utils/ClickOutside";
import ConnectWallet from "./sidebar/ConnectWallet";
import Icon from "@/components/Icons";

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
}

const Sidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
  const [pageName, setPageName] = useLocalStorage("selectedMenu", "Homw");
  const sb_items = sidebar_items();

  return (
    <ClickOutside onClick={() => setSidebarOpen(false)}>
      <aside
        className={`fixed left-0 top-0 z-9999 flex h-screen w-72.5 flex-col overflow-y-hidden duration-300 ease-linear bg-neutral-950/70 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-center gap-2 px-6 py-5.5 lg:py-6.5">
          <Icon icon="logo" extra_class="size-8"/>
          <h3 className="text-3xl font-bold text-neutral-200">
            Unity
          </h3>
        </div>

        <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear py-6">
          <nav className="mt-2 px-4 pb-4 lg:mt-4 lg:px-6">

            {sb_items.map((group, groupIndex) => (
              <div key={groupIndex}>
                <h3 className="mb-4 ml-4 text-sm font-semibold">
                  {group.name}
                </h3>

                <ul className="mb-6 flex flex-col gap-1.5">
                  {group.menu_items.map((item, i) => (
                    <SidebarItem
                      key={i}
                      item={item}
                      pageName={pageName}
                      setPageName={setPageName}
                    />
                  ))}
                </ul>
              </div>
            ))}

          </nav>
          <ConnectWallet/>
        </div>

        <div className="flex-grow"/>
      </aside>
    </ClickOutside>
  );
};

export default Sidebar;
