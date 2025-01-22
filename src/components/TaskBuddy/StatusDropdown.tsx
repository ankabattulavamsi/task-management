import { AiOutlinePlusCircle } from "react-icons/ai";

interface DropdownProps {
  isOpen: boolean;
  options: string[];
  onClick: () => void;
  onSelect: (value: string) => void;
}

export const StatusDropdown: React.FC<DropdownProps> = ({
  isOpen,
  options,
  onClick,
  onSelect,
}) => (
  <div className="relative col-span-2">
    <button
      onClick={onClick}
      className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100"
    >
      <AiOutlinePlusCircle size={20} />
    </button>
    {isOpen && (
      <div className="absolute mt-1 py-1 w-40 bg-white rounded-lg shadow-lg z-50 border border-gray-100">
        {options.map((option) => (
          <button
            key={option}
            onClick={() => onSelect(option)}
            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50"
          >
            {option}
          </button>
        ))}
      </div>
    )}
  </div>
);
