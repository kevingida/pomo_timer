"use client";
import Button from "@/components/Button";
import Tooltip from "@/components/Tooltip";
import { Settings as SettingsIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Timer from "./components/Timer";
import ThemeSettings from "./components/ThemeSettings";
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
        return <ThemeSettings />;
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
      const target = event.target as Node;
      if (
        containerRef.current &&
        !containerRef.current.contains(target)
      ) {
        // Check if click is on another dropdown button, if so, let them handle it
        const clickedElement = event.target as HTMLElement;
        if (!clickedElement.closest('button[class*="group"]')) {
          toggleDropdown("settings");
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSettingsOpen, toggleDropdown]);

  return (
    <div ref={containerRef} className="sm:relative">
      <Tooltip content="Settings">
        <Button
          aria-label="Settings"
          aria-expanded={isSettingsOpen}
          onClick={() => toggleDropdown("settings")}
        >
          <SettingsIcon />
        </Button>
      </Tooltip>
      {isSettingsOpen && (
        <div className="absolute top-full right-0 mt-2 w-87.5 lg:w-100 flex flex-col gap-2 rounded-[20px] transition-all duration-500 backdrop-blur-lg bg-transparent p-4 shadow-lg overflow-hidden max-h-[90vh] z-50">
          <div className=" shrink-0">
            <div className="flex flex-row justify-between items-center h-5 mb-4">
              <h2 className="text-lg font-bold text-text-primary">Settings</h2>
            </div>
            <div
              role="tablist"
              aria-label="Settings sections"
              className="flex gap-2 w-full border border-border-primary rounded-full"
            >
              {[
                { id: "timer", label: "Timer" },
                { id: "sounds", label: "Sounds" },
                { id: "theme", label: "Theme" },
              ].map(({ id, label }) => (
                <Button
                  key={id}
                  role="tab"
                  aria-selected={tab === id}
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
          </div>
          <div className="flex-1 w-full rounded-[20px] p-4 overflow-y-auto bg-black/10 border border-border-primary">
            {renderTabContent()}
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
