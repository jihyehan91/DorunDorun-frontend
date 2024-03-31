interface TabButtonProps {
  label: string;
  onClick: () => void;
  isActive: boolean;
}

export default function TabButton({
  label,
  onClick,
  isActive,
}: TabButtonProps) {
  return (
    <button
      type='button'
      className={`tab-btn ${
        isActive
          ? 'rounded-none border-[var(--highlight-color)] border-b-4 text-[var(--main-font-color)]'
          : ''
      }`}
      onClick={onClick}
    >
      {label}
    </button>
  );
}
