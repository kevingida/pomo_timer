"use client";
import Button from "@/components/Button";
import Tooltip from "@/components/Tooltip";
import { Settings as SettingsIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Timer from "./components/Timer";
import Themes from "./components/Themes";
import Sounds from "./components/Sounds";

interface SettingsProps {
  toggleDropdown: (type: string) => void;
  isSettingsOpen: boolean;
}

const Settings = ({ toggleDropdown, isSettingsOpen }: SettingsProps) => {
  const [tab, setTab] = useState("timer");

  const renderTabContent = () => {
    switch (tab) {
      case "timer":
        return <Timer />;
      case "theme":
        return <Themes />;
      case "sounds":
        return <Sounds />;
      default:
        return <Timer />;
    }
  };

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isSettingsOpen) return; // only listen while open
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        toggleDropdown("settings");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSettingsOpen, toggleDropdown]);

  return (
    <div ref={containerRef} className="relative">
      <Tooltip content="Settings">
        <Button onClick={() => toggleDropdown("settings")}>
          <SettingsIcon />
        </Button>
      </Tooltip>
      {isSettingsOpen && (
        <div className="absolute top-full right-0 mt-2 w-100 flex p-4 flex-col gap-2 rounded-[20px] transition-all duration-500 backdrop-blur-lg bg-transparent shadow-lg overflow-visible">
          <div className="flex flex-row justify-between items-center h-5 mb-4">
            <h2 className="text-lg font-bold text-text-primary">Settings</h2>
          </div>
          <div className="flex gap-2 w-full border border-border-primary rounded-full mb-4">
            {[
              { id: "timer", label: "Timer" },
              { id: "theme", label: "Theme" },
              { id: "sounds", label: "Sounds" },
            ].map(({ id, label }) => (
              <Button
                key={id}
                onClick={() => setTab(id)}
                variant={"primary"}
                active={tab === id}
                size="sm"
                className="flex-1"
              >
                {label}
              </Button>
            ))}
          </div>
          <div className="flex-1 w-full rounded-[20px] p-4 overflow-vissible bg-black/10 border border-border-primary">
            {renderTabContent()}
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
