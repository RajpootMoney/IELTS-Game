import { useState, useRef, useEffect, useCallback } from 'react';
import { GameState, Alien, Particle, Laser, Star, WordData, Question } from '../../types/game.types';
import { GameMode } from '../../types/mode.types';
import { wordBank } from '../../data/wordBank';
import { createAlien, checkAnswer } from '../../data/questionGenerator';
import { pickGrammarChallenges, GrammarChallenge } from '../../data/grammarChallenges';
import {
  generateQuestionForMode,
  checkShooterAnswer,
  checkGrammarAnswer,
} from '../../data/modeQuestions';
import { SPEED_RUN_SECONDS } from '../../data/gameModes';
import { audioEngine } from '../../utils/audioUtils';
import { 
  createStars, updateStars, drawStars, 
  createExplosion, updateParticles, drawParticles,
  drawScanlines, drawGrid 
} from '../../utils/canvasUtils';
import GameUI from './GameUI';
import QuestionPrompt from './QuestionPrompt';
import GrammarFeedback, { GrammarFeedbackData } from './GrammarFeedback';

interface GameScreenProps {
  gameMode: GameMode;
  onGameOver: (stats: {
    score: number;
    wordsCorrect: number;
    accuracy: number;
    highestCombo: number;
    wrongWords: WordData[];
  }) => void;
}

function grammarPlaceholder(c: GrammarChallenge): WordData {
  return {
    word: '···',
    definition: c.errorLabel,
    synonyms: [],
    sentence: c.flawed,
    band: c.band,
  };
}

function truncateLabel(text: string, max = 18): string {
  return text.length > max ? `${text.substring(0, max - 3)}...` : text;
}

export default function GameScreen({ gameMode, onGameOver }: GameScreenProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);
  const gridOffsetRef = useRef<number>(0);
  const grammarByAlienRef = useRef<Map<string, GrammarChallenge>>(new Map());
  
  const [gameState, setGameState] = useState<GameState>({
    status: 'playing',
    score: 0,
    lives: 3,
    wave: 1,
    combo: 0,
    comboMultiplier: 1,
    currentQuestion: null,
    inputText: '',
    wrongWords: [],
    wordsCorrect: 0,
    totalAttempts: 0
  });
  
  const [aliens, setAliens] = useState<Alien[]>([]);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [laser, setLaser] = useState<Laser | null>(null);
  const [stars, setStars] = useState<Star[]>([]);
  const [grammarFeedback, setGrammarFeedback] = useState<GrammarFeedbackData | null>(null);
  const [timeLeft, setTimeLeft] = useState(gameMode === 'speedrun' ? SPEED_RUN_SECONDS : undefined);

  // Initialize canvas size
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const updateSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      setStars(createStars(canvas.width, canvas.height));
    };
    
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  const pickQuestion = useCallback((targetAlien: Alien): Question => {
    const challenge = grammarByAlienRef.current.get(targetAlien.id);
    return generateQuestionForMode(gameMode, targetAlien.wordData, targetAlien.id, challenge);
  }, [gameMode]);

  const generateWave = useCallback((waveNumber: number, canvasWidth: number) => {
    const newAliens: Alien[] = [];
    const rows = gameMode === 'grammar' ? Math.min(4, 2 + Math.floor(waveNumber / 2)) : Math.min(5, 3 + Math.floor(waveNumber / 3));
    const cols = gameMode === 'grammar' ? 6 : 8;
    const minBand = waveNumber <= 2 ? 5 : waveNumber <= 4 ? 5 : 6;
    const maxBand = waveNumber <= 2 ? 6 : waveNumber <= 4 ? 7 : 7;
    const availableWords = wordBank.filter((w) => w.band >= minBand && w.band <= maxBand);

    grammarByAlienRef.current.clear();

    if (gameMode === 'grammar') {
      const challenges = pickGrammarChallenges(rows * cols, waveNumber);
      let idx = 0;
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const challenge = challenges[idx++];
          const id = `alien-${row}-${col}`;
          grammarByAlienRef.current.set(id, challenge);
          const alien = createAlien(grammarPlaceholder(challenge), row, col, id, canvasWidth);
          alien.word = truncateLabel(challenge.flawed, 16);
          newAliens.push(alien);
        }
      }
    } else {
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const wordData = availableWords[Math.floor(Math.random() * availableWords.length)];
          const alien = createAlien(wordData, row, col, `alien-${row}-${col}`, canvasWidth);
          if (gameMode === 'shooter') {
            alien.word = wordData.word;
          }
          newAliens.push(alien);
        }
      }
    }

    setAliens(newAliens);

    if (newAliens.length > 0) {
      const randomAlien = newAliens[Math.floor(Math.random() * newAliens.length)];
      const question = pickQuestion(randomAlien);
      setGameState((prev) => ({ ...prev, currentQuestion: question, inputText: '' }));
    }
  }, [gameMode, pickQuestion]);

  useEffect(() => {
    if (gameMode !== 'speedrun' || gameState.status !== 'playing') return;

    const timer = window.setInterval(() => {
      setTimeLeft((prev) => {
        if (prev === undefined || prev <= 1) {
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [gameMode, gameState.status]);

  useEffect(() => {
    if (gameMode === 'speedrun' && timeLeft === 0 && gameState.status === 'playing') {
      setGameState((prev) => ({ ...prev, status: 'gameOver', lives: 0 }));
      audioEngine.play('gameOver');
    }
  }, [gameMode, timeLeft, gameState.status]);

  // Start first wave when canvas is ready
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas && aliens.length === 0) {
      generateWave(1, canvas.width);
    }
  }, [aliens.length, generateWave]);

  // Game loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const gameLoop = (timestamp: number) => {
      lastTimeRef.current = timestamp;

      // Clear canvas
      ctx.fillStyle = '#0a0a0f';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update and draw stars
      updateStars(stars, canvas.height);
      drawStars(ctx, stars);

      // Draw grid
      gridOffsetRef.current = (gridOffsetRef.current + 0.5) % 50;
      drawGrid(ctx, canvas.width, canvas.height, gridOffsetRef.current);

      // Update aliens
      setAliens(prevAliens => {
        const speed = 0.2 + (gameState.wave - 1) * 0.05;
        const newAliens = prevAliens.map(alien => {
          if (!alien.isAlive) return alien;
          
          const bob = Math.sin(timestamp * 0.003 + alien.bobOffset) * 2;
          return {
            ...alien,
            x: alien.x + bob,
            y: alien.y + speed,
            bobOffset: alien.bobOffset + 0.02
          };
        });

        // Check if aliens reached bottom
        const reachedBottom = newAliens.some(alien => 
          alien.isAlive && alien.y + alien.height >= canvas.height - 100
        );

        if (reachedBottom) {
          // Remove bottom aliens and lose life
          const aliensAtBottom = newAliens.filter(alien => 
            alien.isAlive && alien.y + alien.height >= canvas.height - 100
          );
          
          aliensAtBottom.forEach(alien => {
            alien.isAlive = false;
            setParticles(prev => [...prev, ...createExplosion(
              alien.x + alien.width / 2, 
              alien.y + alien.height / 2, 
              '#FF0000'
            )]);
          });

          setGameState(prev => {
            const newLives = prev.lives - 1;
            if (newLives <= 0) {
              audioEngine.play('gameOver');
              // Game over will be handled in useEffect
            } else {
              audioEngine.play('lifeLost');
            }
            return { ...prev, lives: newLives };
          });
        }

        return newAliens;
      });

      // Draw aliens
      setAliens(prevAliens => {
        prevAliens.forEach(alien => {
          if (!alien.isAlive) return;

          // Draw alien body
          ctx.save();
          ctx.fillStyle = alien.color;
          ctx.shadowBlur = 10;
          ctx.shadowColor = alien.color;
          
          // Draw alien shape (pixelated invader style)
          const x = alien.x;
          const y = alien.y + Math.sin(alien.bobOffset) * 3;
          const w = alien.width;
          const h = alien.height;
          
          // Main body
          ctx.fillRect(x + w * 0.2, y + h * 0.2, w * 0.6, h * 0.6);
          // Eyes
          ctx.fillStyle = '#000';
          ctx.fillRect(x + w * 0.3, y + h * 0.35, w * 0.1, h * 0.15);
          ctx.fillRect(x + w * 0.6, y + h * 0.35, w * 0.1, h * 0.15);
          // Antennae
          ctx.fillStyle = alien.color;
          ctx.fillRect(x + w * 0.25, y, w * 0.08, h * 0.25);
          ctx.fillRect(x + w * 0.67, y, w * 0.08, h * 0.25);
          
          ctx.restore();

          // Draw text above alien
          ctx.save();
          ctx.fillStyle = '#fff';
          ctx.font = '10px "Press Start 2P", monospace';
          ctx.textAlign = 'center';
          ctx.shadowBlur = 5;
          ctx.shadowColor = alien.color;
          
          // Truncate text if too long
          let displayText = alien.word;
          if (displayText.length > 20) {
            displayText = displayText.substring(0, 17) + '...';
          }
          
          ctx.fillText(displayText, x + w / 2, y - 5);
          ctx.restore();
        });
        return prevAliens;
      });

      // Update and draw laser
      if (laser?.isActive) {
        setLaser(prevLaser => {
          if (!prevLaser) return null;
          
          const newY = prevLaser.y - prevLaser.speed;
          
          // Check if laser hit target
          if (newY <= prevLaser.targetY) {
            // Laser reached target
            return null;
          }
          
          return { ...prevLaser, y: newY };
        });
        
        // Draw laser
        if (laser?.isActive) {
          ctx.save();
          ctx.strokeStyle = laser.color;
          ctx.lineWidth = 3;
          ctx.shadowBlur = 15;
          ctx.shadowColor = laser.color;
          ctx.beginPath();
          ctx.moveTo(laser.x, laser.y);
          ctx.lineTo(laser.x, laser.y + 30);
          ctx.stroke();
          ctx.restore();
        }
      }

      // Update and draw particles
      updateParticles(particles);
      drawParticles(ctx, particles);

      // Draw scanlines
      drawScanlines(ctx, canvas.width, canvas.height);

      // Check game over
      if (gameState.lives <= 0) {
        return;
      }

      animationRef.current = requestAnimationFrame(gameLoop);
    };

    if (gameState.status === 'playing') {
      animationRef.current = requestAnimationFrame(gameLoop);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [gameState.status, gameState.lives, gameState.wave, aliens, particles, laser, stars]);

  // Handle game over
  useEffect(() => {
    if (gameState.lives <= 0 && gameState.status === 'playing') {
      setGameState(prev => ({ ...prev, status: 'gameOver' }));
      
      const accuracy = gameState.totalAttempts > 0 
        ? Math.round((gameState.wordsCorrect / gameState.totalAttempts) * 100) 
        : 0;
      
      onGameOver({
        score: gameState.score,
        wordsCorrect: gameState.wordsCorrect,
        accuracy,
        highestCombo: gameState.combo,
        wrongWords: gameState.wrongWords
      });
    }
  }, [gameState.lives, gameState.status]);

  const advanceAfterCorrect = useCallback(() => {
    setTimeout(() => {
      setAliens((prevAliens) => {
        const aliveAliens = prevAliens.filter((a) => a.isAlive);

        if (aliveAliens.length === 0) {
          setGameState((prev) => {
            const newWave = prev.wave + 1;
            audioEngine.play('waveComplete');
            setTimeout(() => {
              generateWave(newWave, canvasRef.current?.width || window.innerWidth);
            }, 2000);
            return { ...prev, wave: newWave };
          });
        } else {
          const randomAlien = aliveAliens[Math.floor(Math.random() * aliveAliens.length)];
          const question = pickQuestion(randomAlien);
          setGameState((prev) => ({ ...prev, currentQuestion: question, inputText: '' }));
        }

        return prevAliens;
      });
    }, 500);
  }, [generateWave, pickQuestion]);

  const destroyTargetAlien = useCallback((targetAlien: Alien) => {
    setLaser({
      x: targetAlien.x + targetAlien.width / 2,
      y: window.innerHeight - 100,
      targetY: targetAlien.y + targetAlien.height / 2,
      speed: 15,
      isActive: true,
      color: '#00FF00',
    });

    setAliens((prev) =>
      prev.map((a) => (a.id === targetAlien.id ? { ...a, isAlive: false } : a))
    );

    setParticles((prev) => [
      ...prev,
      ...createExplosion(
        targetAlien.x + targetAlien.width / 2,
        targetAlien.y + targetAlien.height / 2,
        targetAlien.color
      ),
    ]);

    audioEngine.play('correct');
    setTimeout(() => audioEngine.play('explosion'), 100);
  }, []);

  const handleAnswerSubmit = useCallback(
    (answer: string) => {
      if (!gameState.currentQuestion || grammarFeedback) return;

      const question = gameState.currentQuestion;
      let isCorrect = false;

      if (question.type === 'grammarFix') {
        isCorrect = checkGrammarAnswer(answer, question);
      } else if (question.type === 'shooter') {
        isCorrect = checkShooterAnswer(answer, question, aliens);
      } else {
        isCorrect = checkAnswer(answer, question);
      }

      if (isCorrect) {
        const targetAlien = aliens.find((a) => a.id === question.targetAlienId);
        if (targetAlien) destroyTargetAlien(targetAlien);

        setGameState((prev) => {
          const newCombo = prev.combo + 1;
          const newComboMultiplier = 1 + (newCombo - 1) * 0.5;
          const points = Math.round(100 * newComboMultiplier);
          return {
            ...prev,
            score: prev.score + points,
            combo: newCombo,
            comboMultiplier: newComboMultiplier,
            wordsCorrect: prev.wordsCorrect + 1,
            totalAttempts: prev.totalAttempts + 1,
          };
        });

        advanceAfterCorrect();
      } else {
        audioEngine.play('wrong');

        if (gameMode === 'grammar' && question.flawedSentence && question.correctSentence && question.grammarTip) {
          setGrammarFeedback({
            flawed: question.flawedSentence,
            correct: question.correctSentence,
            tip: question.grammarTip,
            errorLabel: question.errorLabel ?? 'Grammar',
          });

          setGameState((prev) => {
            const newLives = prev.lives - 1;
            if (newLives <= 0) audioEngine.play('gameOver');
            else audioEngine.play('lifeLost');
            return {
              ...prev,
              lives: newLives,
              combo: 0,
              comboMultiplier: 1,
              totalAttempts: prev.totalAttempts + 1,
            };
          });
          return;
        }

        setGameState((prev) => {
          const currentAlien = aliens.find((a) => a.id === prev.currentQuestion?.targetAlienId);
          const newWrongWords =
            currentAlien && !prev.wrongWords.find((w) => w.word === currentAlien.wordData.word)
              ? [...prev.wrongWords, currentAlien.wordData]
              : prev.wrongWords;

          return {
            ...prev,
            combo: 0,
            comboMultiplier: 1,
            wrongWords: newWrongWords,
            totalAttempts: prev.totalAttempts + 1,
          };
        });
      }
    },
    [
      aliens,
      gameState.currentQuestion,
      grammarFeedback,
      gameMode,
      destroyTargetAlien,
      advanceAfterCorrect,
    ]
  );

  const dismissGrammarFeedback = useCallback(() => {
    setGrammarFeedback(null);
    if (gameState.lives > 0) {
      setGameState((prev) => ({ ...prev, inputText: '' }));
    }
  }, [gameState.lives]);

  // Handle input change
  const handleInputChange = useCallback((text: string) => {
    setGameState(prev => ({ ...prev, inputText: text }));
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-game-bg">
      {/* Game Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0"
        style={{ imageRendering: 'pixelated' }}
      />
      
      {/* Game UI */}
      <GameUI
        score={gameState.score}
        lives={gameState.lives}
        wave={gameState.wave}
        combo={gameState.combo}
        comboMultiplier={gameState.comboMultiplier}
        mode={gameMode}
        timeLeft={timeLeft}
      />

      {gameState.currentQuestion && (
        <QuestionPrompt
          question={gameState.currentQuestion}
          inputText={gameState.inputText}
          onInputChange={handleInputChange}
          onSubmit={handleAnswerSubmit}
          disabled={!!grammarFeedback}
        />
      )}

      {grammarFeedback && (
        <GrammarFeedback feedback={grammarFeedback} onDismiss={dismissGrammarFeedback} />
      )}

      {/* Scanline overlay */}
      <div className="absolute inset-0 pointer-events-none scanlines" />
    </div>
  );
}
