import { useRef, useEffect, useCallback } from 'react';
import { Question } from '../../types/game.types';
import { audioEngine } from '../../utils/audioUtils';

interface QuestionPromptProps {
  question: Question;
  inputText: string;
  onInputChange: (text: string) => void;
  onSubmit: (answer: string) => void;
  disabled?: boolean;
}

export default function QuestionPrompt({ 
  question, 
  inputText, 
  onInputChange, 
  onSubmit,
  disabled = false,
}: QuestionPromptProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isGrammar = question.type === 'grammarFix';
  const isShooter = question.type === 'shooter';

  useEffect(() => {
    if (disabled) return;
    if (isGrammar) textareaRef.current?.focus();
    else inputRef.current?.focus();
  }, [question, disabled, isGrammar]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        if (isGrammar) textareaRef.current?.focus();
        else inputRef.current?.focus();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isGrammar]);

  const submit = useCallback(() => {
    if (disabled || !inputText.trim()) return;
    audioEngine.play('buttonClick');
    onSubmit(inputText.trim());
    onInputChange('');
  }, [inputText, onSubmit, onInputChange, disabled]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isGrammar) {
      e.preventDefault();
      submit();
    }
    if (e.key === 'Enter' && isGrammar && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      submit();
    }
  }, [submit, isGrammar]);

  const handleChange = useCallback((value: string) => {
    if (isGrammar) {
      onInputChange(value);
      return;
    }
    onInputChange(value.replace(/[^a-zA-Z\s]/g, ''));
  }, [onInputChange, isGrammar]);

  const getQuestionTypeColor = () => {
    switch (question.type) {
      case 'synonym':
        return 'text-neon-pink border-neon-pink';
      case 'definition':
        return 'text-neon-cyan border-neon-cyan';
      case 'fillBlank':
        return 'text-neon-green border-neon-green';
      case 'grammarFix':
        return 'text-neon-green border-neon-green';
      case 'shooter':
        return 'text-neon-pink border-neon-pink';
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
      case 'grammarFix':
        return 'GRAMMAR FIX';
      case 'shooter':
        return 'WORD SHOOTER';
      default:
        return 'QUESTION';
    }
  };

  const colorClass = getQuestionTypeColor();

  return (
    <div 
      ref={containerRef}
      className="absolute bottom-0 left-0 right-0 z-30 p-4 md:p-6"
    >
      <div className="max-w-3xl mx-auto">
        <div className={`
          bg-game-bg/95 backdrop-blur-sm rounded-lg border-2 p-4 md:p-6
          shadow-[0_0_30px_rgba(0,0,0,0.8)]
          ${colorClass}
          ${disabled ? 'opacity-50 pointer-events-none' : ''}
        `}>
          <div className="flex justify-between items-center mb-4">
            <span className={`font-pixel text-xs px-3 py-1 rounded bg-black/50 border ${colorClass}`}>
              {getQuestionTypeLabel()}
            </span>
            <span className="font-mono text-xs text-gray-400">
              {isGrammar ? 'Ctrl+Enter to submit' : 'Press ENTER to submit'}
            </span>
          </div>

          {isGrammar && question.flawedSentence && (
            <div className="mb-4 p-3 bg-neon-red/10 border border-neon-red/40 rounded-lg">
              <p className="font-mono text-xs text-neon-red mb-1">Fix this sentence:</p>
              <p className="font-mono text-base md:text-lg text-white leading-relaxed">
                &ldquo;{question.flawedSentence}&rdquo;
              </p>
            </div>
          )}

          <p className="font-mono text-base md:text-lg mb-2 text-white leading-relaxed">
            {question.prompt}
          </p>

          {question.context && (
            <p className="font-mono text-xs text-gray-400 mb-4">{question.context}</p>
          )}

          {isShooter && (
            <p className="font-mono text-xs text-neon-pink mb-4">
              Tip: type the exact word shown above the correct alien.
            </p>
          )}

          {isGrammar ? (
            <textarea
              ref={textareaRef}
              value={inputText}
              onChange={(e) => handleChange(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type the full corrected sentence here..."
              rows={3}
              disabled={disabled}
              className={`
                w-full bg-black/50 border-2 rounded-lg px-4 py-3
                font-mono text-base md:text-lg text-white resize-none
                placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-opacity-50
                transition-all duration-200 ${colorClass}
                focus:shadow-[0_0_20px_currentColor]
              `}
              autoComplete="off"
              spellCheck={false}
            />
          ) : (
            <div className="relative">
              <input
                ref={inputRef}
                type="text"
                value={inputText}
                onChange={(e) => handleChange(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your answer here..."
                disabled={disabled}
                className={`
                  w-full bg-black/50 border-2 rounded-lg px-4 py-3
                  font-mono text-base md:text-lg text-white
                  placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-opacity-50
                  transition-all duration-200 ${colorClass}
                  focus:shadow-[0_0_20px_currentColor]
                `}
                autoComplete="off"
                autoCorrect="off"
                spellCheck={false}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
