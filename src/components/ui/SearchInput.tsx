import { useState, useCallback, useRef, useEffect } from "react";
import { useNavigate } from "react-router";
import { MdSearch, MdArrowBack } from "react-icons/md";
import useDebounce from "@/hooks/useDebounce";
import { useSearchUsers } from "@/hooks/useSearchUsers";
import { getAvatarByUserId } from "@/utils/avatar";

interface SearchInputProps {
  placeholder?: string;
  delay?: number;
  autoFocus?: boolean;
  hideSearchIcon?: boolean;
  onBack?: () => void;
}

function SearchInput({
  placeholder = "Search...",
  delay = 500,
  autoFocus = false,
  hideSearchIcon = false,
  onBack,
}: SearchInputProps) {
  const [panelOpen, setPanelOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const debounce = useDebounce();
  const navigate = useNavigate();

  const { results, isLoading, hasQuery } = useSearchUsers(query);

  const handleClose = () => {
    if (onBack) {
      onBack();
    } else {
      setPanelOpen(false);
    }
  };

  useEffect(() => {
    if (autoFocus) {
      setTimeout(() => {
        inputRef.current?.focus();
        setPanelOpen(true);
      }, 100);
    }
  }, [autoFocus]);

  useEffect(() => {
    if (panelOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [panelOpen]);

  useEffect(() => {
    if (!panelOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        handleClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [panelOpen]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      setInputValue(val);
      debounce(() => setQuery(val), delay);
    },
    [debounce, delay],
  );

  const handleSelect = (userId: number) => {
    handleClose();
    navigate(`/users/${userId}`);
  };

  return (
    <div className="relative" ref={panelRef}>
      <div className="flex w-full items-center gap-2 rounded-full bg-[#fde8e0] px-4 py-3">
        {!hideSearchIcon && (
          panelOpen ? (
            <button
              onClick={handleClose}
              className="cursor-pointer rounded-full p-0.5 transition-colors hover:bg-[#f5cfc2]"
            >
              <MdArrowBack className="text-[#e8837c]" size={20} />
            </button>
          ) : (
            <MdSearch className="text-[#e8837c]" size={20} />
          )
        )}
        <input
          ref={inputRef}
          value={inputValue}
          onChange={handleChange}
          onFocus={() => setPanelOpen(true)}
          placeholder={placeholder}
          className="flex-1 bg-transparent text-sm font-medium text-[#d4645e] outline-none placeholder:text-[#e8837c]"
        />
      </div>

      {panelOpen && (
        <>
          <div className="fixed inset-0 z-99" onMouseDown={handleClose} />
          <div className="absolute top-full left-0 z-100 mt-2 w-full overflow-hidden rounded-xl border border-gray-100 bg-white shadow-xl">
            <div className="max-h-80 overflow-y-auto">
              {isLoading && hasQuery && (
                <div className="px-4 py-3 text-sm text-gray-400">
                  Searching...
                </div>
              )}

              {!isLoading && hasQuery && results.length === 0 && (
                <div className="px-4 py-3 text-sm text-gray-400">
                  No users found.
                </div>
              )}

              {!isLoading && results.length > 0 && (
                <ul className="py-1">
                  {results.map((user) => (
                    <li key={user.id}>
                      <button
                        onClick={() => handleSelect(user.id)}
                        className="flex w-full cursor-pointer items-center gap-3 px-4 py-2.5 text-left transition-colors hover:bg-gray-50"
                      >
                        <img
                          src={getAvatarByUserId(user.id)}
                          alt={user.name}
                          className="h-9 w-9 rounded-full object-cover"
                        />
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-gray-900">
                            {user.name}
                          </p>
                          <p className="truncate text-xs text-gray-500">
                            @{user.username}
                          </p>
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
              )}

              {!hasQuery && (
                <div className="px-4 py-3 text-sm text-gray-400">
                  Type to search users...
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default SearchInput;
