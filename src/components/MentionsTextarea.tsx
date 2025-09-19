import React, { useState, useRef, useCallback } from "react";
import { UserIcon } from "@heroicons/react/24/outline";

interface Mention {
  id: string;
  name: string;
  email: string;
}

interface MentionsTextareaProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  mentions: Mention[];
  className?: string;
}

interface MentionSuggestion {
  id: string;
  name: string;
  email: string;
  displayText: string;
}

const MentionsTextarea: React.FC<MentionsTextareaProps> = ({
  value,
  onChange,
  placeholder = "Add a note...",
  mentions,
  className = "",
}) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<MentionSuggestion[]>([]);
  const [suggestionIndex, setSuggestionIndex] = useState(0);
  const [mentionStartPos, setMentionStartPos] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Create mention suggestions with display text
  const createSuggestions = useCallback(
    (query: string): MentionSuggestion[] => {
      if (!query) return [];

      return mentions
        .filter(
          (mention) =>
            mention.name.toLowerCase().includes(query.toLowerCase()) ||
            mention.email.toLowerCase().includes(query.toLowerCase())
        )
        .slice(0, 5)
        .map((mention) => ({
          ...mention,
          displayText: `${mention.name} (${mention.email})`,
        }));
    },
    [mentions]
  );

  // Handle text change
  const handleTextChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newValue = e.target.value;
      const cursorPos = e.target.selectionStart;

      onChange(newValue);

      // Check if we're typing a mention
      const textBeforeCursor = newValue.substring(0, cursorPos);
      const mentionMatch = textBeforeCursor.match(/@(\w*)$/);

      if (mentionMatch) {
        const query = mentionMatch[1];
        const startPos = cursorPos - mentionMatch[0].length;

        setMentionStartPos(startPos);
        const newSuggestions = createSuggestions(query);
        setSuggestions(newSuggestions);
        setShowSuggestions(newSuggestions.length > 0);
        setSuggestionIndex(0);
      } else {
        setShowSuggestions(false);
        setSuggestions([]);
      }
    },
    [onChange, createSuggestions]
  );

  // Insert mention
  const insertMention = useCallback(
    (mention: MentionSuggestion) => {
      if (!textareaRef.current) return;

      const textarea = textareaRef.current;
      const beforeMention = value.substring(0, mentionStartPos);
      const afterMention = value.substring(textarea.selectionStart);
      const newValue = `${beforeMention}@${mention.name} ${afterMention}`;

      onChange(newValue);
      setShowSuggestions(false);
      setSuggestions([]);

      // Focus back to textarea
      setTimeout(() => {
        textarea.focus();
        const newCursorPos = beforeMention.length + mention.name.length + 2;
        textarea.setSelectionRange(newCursorPos, newCursorPos);
      }, 0);
    },
    [value, mentionStartPos, onChange]
  );

  // Handle key down
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (!showSuggestions) return;

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setSuggestionIndex((prev) =>
            prev < suggestions.length - 1 ? prev + 1 : 0
          );
          break;
        case "ArrowUp":
          e.preventDefault();
          setSuggestionIndex((prev) =>
            prev > 0 ? prev - 1 : suggestions.length - 1
          );
          break;
        case "Enter":
        case "Tab":
          e.preventDefault();
          if (suggestions[suggestionIndex]) {
            insertMention(suggestions[suggestionIndex]);
          }
          break;
        case "Escape":
          setShowSuggestions(false);
          setSuggestions([]);
          break;
      }
    },
    [showSuggestions, suggestions, suggestionIndex, insertMention]
  );

  // Handle click outside
  const handleClickOutside = useCallback(() => {
    setShowSuggestions(false);
    setSuggestions([]);
  }, []);

  return (
    <div className="relative">
      <textarea
        ref={textareaRef}
        value={value}
        onChange={handleTextChange}
        onKeyDown={handleKeyDown}
        onBlur={(e) => {
          // Delay hiding suggestions to allow clicking on them
          setTimeout(() => {
            if (!e.currentTarget.contains(document.activeElement)) {
              handleClickOutside();
            }
          }, 150);
        }}
        placeholder={placeholder}
        className={`block w-full rounded-lg border-0 py-3 px-4 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6 resize-none ${className}`}
        rows={4}
      />

      {/* Mention Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
          {suggestions.map((suggestion, index) => (
            <div
              key={suggestion.id}
              className={`px-4 py-3 cursor-pointer flex items-center space-x-3 transition-colors ${
                index === suggestionIndex
                  ? "bg-primary-50 border-l-4 border-primary-500"
                  : "hover:bg-gray-50"
              }`}
              onClick={() => insertMention(suggestion)}
              onMouseEnter={() => setSuggestionIndex(index)}
            >
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-semibold text-xs">
                {suggestion.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {suggestion.name}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {suggestion.email}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Help text */}
      <div className="mt-2 text-xs text-gray-500">
        Type @ to mention someone. Use ↑↓ to navigate, Enter to select, Esc to
        cancel.
      </div>
    </div>
  );
};

export default MentionsTextarea;
