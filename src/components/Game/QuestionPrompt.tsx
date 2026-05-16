import { useRef, useEffect, useCallback } from 'react';
import { Question } from '../../types/game.types';
import { audioEngine } from '../../utils/audioUtils';

interface QuestionPromptProps {
  question: Question;
  inputText: string;
  onInputChange: (text: string) => void;
  onSubmit: (answer: string) => void;
}

export default function QuestionPrompt({ 
  question, 
  inputText, 
  onInputChange, 
  onSubmit 
}: QuestionPromptProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Focus input on mount
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [question]);

  // Keep focus on input
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        inputRef.current?.focus();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (inputText.trim()) {
        audioEngine.play('buttonClick');
        onSubmit(inputText.trim());
        onInputChange('');
      }
    }
  }, [inputText, onSubmit, onInputChange]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow letters and spaces
    const value = e.target.value.replace(/[^a-zA-Z\s]/g, '');
    onInputChange(value);
  }, [onInputChange]);

  const getQuestionTypeColor = () => {
    switch (question.type) {
      case 'synonym':
        return 'text-neon-pink border-neon-pink';
      case 'definition':
        return 'text-neon-cyan border-neon-cyan';
      case 'fillBlank':
        return 'text-neon-green border-neon-green';
      default:
        return 'text-white border-white';
    }
  };

  const getQuestionTypeLabel = () => {
    switch (question.type) {
      case 'synonym':
        return 'SYNONYM';
      case 'definition':
        return 'DEFINITION';
      case 'fillBlank':
        return 'FILL IN THE BLANK';
      default:
        return 'QUESTION';
    }
  };

  return (
    <div 
      ref={containerRef}
      className="absolute bottom-0 left-0 right-0 z-30 p-4 md:p-6"
    >
      <div className="max-w-3xl mx-auto">
        {/* Question card */}
        <div className={`
          bg-game-bg/95 backdrop-blur-sm rounded-lg border-2 p-4 md:p-6
          shadow-[0_0_30px_rgba(0,0,0,0.8)]
          ${getQuestionTypeColor()}
        `}>
          {/* Question type badge */}
          <div className="flex justify-between items-center mb-4">
            <span className={`
              font-pixel text-xs px-3 py-1 rounded 
              bg-black/50 border ${getQuestionTypeColor()}
            `}>
              {getQuestionTypeLabel()}
            </span>
            <span className="font-mono text-xs text-gray-400">
              Press ENTER to submit
            </span>
          </div>
          
          {/* Question prompt */}
          <p className="font-mono text-base md:text-lg mb-4 text-white leading-relaxed">
            {question.prompt}
          </p>
          
          {/* Answer input */}
          <div className="relative">
            <input
              ref={inputRef}
              type="text"
              value={inputText}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              placeholder="Type your answer here..."
              className={`
                w-full bg-black/50 border-2 rounded-lg px-4 py-3
                font-mono text-base md:text-lg text-white
                placeholder-gray-500
                focus:outline-none focus:ring-2 focus:ring-opacity-50
                transition-all duration-200
                ${getQuestionTypeColor()}
                focus:shadow-[0_0_20px_currentColor]
              `}
              autoComplete="off"
              autoCorrect="off"
              spellCheck={false}
            />
            
            {/* Blinking cursor indicator */}
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
              <span className="font-mono text-xs text-gray-500">
                {inputText.length > 0 ? `${inputText.length} chars` : ''}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
