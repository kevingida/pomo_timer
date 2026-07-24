import { KeyboardEvent } from "react";

interface NumberInputProps {
  value: number;
  min: number;
  max: number;
  unit?: string;
  onCommit: (value: number) => void;
  onChange?: (value: number) => void;
}

const NumberInput = ({
  value,
  min,
  max,
  unit,
  onCommit,
  onChange,
}: NumberInputProps) => {
  const clamp = (value: number) => Math.min(Math.max(value, min), max);
  return (
    <span className="text-sm font-semibold text-text-primary">
      <input
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        value={value}
        className="
          w-10 text-center bg-transparent 
          focus:outline-none focus:ring-2 focus:ring-surface-active
          border-none hover:cursor-pointer
          [appearance:textfield]
          [&::-webkit-inner-spin-button]:appearance-none
          [&::-webkit-outer-spin-button]:appearance-none
        "
        onChange={(e) => {
          const raw = e.target.value.replace(/\D/g, "");

          if (onChange) {
            onChange(Number(raw));
          }
        }}
        onBlur={(e) => {
          onCommit(clamp(Number(e.target.value)));
        }}
        onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
          if (e.key === "Enter") {
            e.currentTarget.blur();
          }
        }}
      />

      {unit}
    </span>
  );
};

export default NumberInput;
