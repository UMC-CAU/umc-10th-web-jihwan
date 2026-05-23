// src/components/HamburgerButton.tsx
interface HamburgerProps {
  onClick: () => void;
  isOpen: boolean;
}

export const HamburgerButton = ({ onClick, isOpen }: HamburgerProps) => {
  return (
    <button onClick={onClick} className="relative z-50 p-2 rounded-lg hover:bg-gray-100 transition-colors">
      <div className="w-6 h-5 flex flex-col justify-between">
        <span className={`block h-0.5 w-full bg-gray-900 rounded transition-all duration-300
        ${isOpen ? 'rotate-45 translate-y-1.5' : ''}`}/>
        <span className={`block h-0.5 w-full bg-gray-900 rounded transition-all duration-300
        ${isOpen ? 'opacity-0' : ''}`}/>
        <span className={`block h-0.5 w-full bg-gray-900 rounded transition-all duration-300
        ${isOpen ? '-rotate-45 -translate-y-3' : ''}`}/>
      </div>
    </button>
  );
};