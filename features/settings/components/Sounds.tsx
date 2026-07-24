import { Volume2 } from "lucide-react";
import React from "react";

const Sounds = () => {
  return (
    <div>
      <h2 className="text-sm font-bold text-text-primary flex items-center gap-2 mb-4">
        <Volume2 className="w-5 h-5" /> Sound Settings
      </h2>
    </div>
  );
};

export default Sounds;
