import { Menu } from "lucide-react";
import React from "react";
import { Sheet, SheetContent, SheetTrigger } from "./sheet";
import { Button } from "./button";
import NavigationSidebar from "../navigation/NavigationSidebar";
import ServerSideBar from "../server/server-sidebar";

function MobileToggle({ serverId }: { serverId: string }) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button className="md:hidden" size="icon" variant="ghost">
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0 flex gap-0">
        <div className="w-[72px]">
          <NavigationSidebar />
        </div>
        <ServerSideBar serverId={serverId} />
      </SheetContent>
    </Sheet>
  );
}

export default MobileToggle;
