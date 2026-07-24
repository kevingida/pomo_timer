interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  id?: string;
  label?: string;
}
const Switch = ({ checked, onChange, disabled, id, label }: SwitchProps) => {
  return (
    <button
      id={id}
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={`
        relative inline-flex h-6 w-11 shrink-0 items-center rounded-full
        border border-border-primary transition-colors duration-200 ease-in-out
        focus:outline-none focus:ring-2 focus:ring-surface-active focus:ring-offset-2 focus:ring-offset-transparent
        disabled:opacity-40 disabled:cursor-not-allowed
        ${checked ? "bg-surface-active" : "bg-white/5"}
      `}
    >
      <span
        className={`
          inline-block h-4 w-4 transform rounded-full bg-text-primary
          shadow transition-transform duration-200 ease-in-out
          ${checked ? "translate-x-5" : "translate-x-1"}
        `}
      />
    </button>
  );
};

export default Switch;
