import ThemeSelector from "@/features/theme/components/ThemeSelector";
import Timer from "@/features/timer";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-background font-sans">
      <div className="absolute top-4 right-4">
        <ThemeSelector />
      </div>
      <Timer />
    </div>
  );
}
