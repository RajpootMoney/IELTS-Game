# IELTS Word Invaders - Product Requirements Document

## 1. Product Overview

IELTS Word Invaders is an educational arcade game that combines the classic Space Invaders gameplay with IELTS vocabulary learning. Players defend Earth from descending alien ships by correctly typing vocabulary words, synonyms, and definitions.

**Target Users:** IELTS test takers (Band 5-7+) looking for an engaging way to practice vocabulary
**Platform:** Web browser (desktop and mobile)
**Core Value:** Learn IELTS vocabulary through addictive, fast-paced gameplay

## 2. Core Features

### 2.1 Gameplay Mechanics

| Feature | Description |
|---------|-------------|
| Alien Formation | 5 rows × 8 columns of alien ships that descend from top |
| Alien Display | Each alien shows an IELTS word OR definition |
| Question Prompt | Bottom-screen prompt with 3 question types (synonym, definition, fill-blank) |
| Answer Input | Player types answer and presses Enter to submit |
| Correct Answer | Targeted alien explodes with neon particle effect, score awarded |
| Wrong Answer | Visual feedback, combo resets, no life lost |
| Alien Reaches Bottom | Player loses 1 life (3 lives total) |
| Combo System | Multiplier increases 0.5x per consecutive correct answer |
| Wave System | New wave spawns with faster aliens and harder words |
| Game Over | Final score + list of incorrect words shown |

### 2.2 Question Types

1. **Synonym Question**: "Type the synonym of [word]"
2. **Definition Question**: "Type the word for this definition: [definition]"
3. **Fill-in-Blank**: "Fill in the blank: [sentence with _____]"

### 2.3 Word Bank

- 50+ IELTS vocabulary words (Band 5-7+)
- Each word contains: word, definition, synonyms[], example sentence

### 2.4 Visual Style

| Element | Style |
|---------|-------|
| Aesthetic | Retro synthwave / neon pixel art |
| Aliens | 8-bit pixel shapes in neon pink/cyan |
| Laser | Bright neon line from bottom |
| Background | Dark scrolling starfield with grid lines and scanlines |
| Text | Retro pixel font (monospace with neon glow) |
| Particle Effects | Neon explosion particles |

### 2.5 Audio

- Procedural sound effects using Web Audio API
- Sounds: shooting, explosion, correct answer, wrong answer, life lost, game over

### 2.6 Responsiveness

- Full browser window fill
- Mobile adaptation with virtual keyboard toggle
- Touch-friendly controls

## 3. Core Process

### 3.1 Game Flow

```mermaid
flowchart TD
    A[Start Screen] --> B[Initialize Game]
    B --> C[Generate Wave]
    C --> D[Display Aliens with Words]
    D --> E[Show Question Prompt]
    E --> F{Player Types Answer}
    F -->|Enter Pressed| G{Check Answer}
    G -->|Correct| H[Explosion Effect]
    H --> I[Update Score & Combo]
    I --> J{Aliens Remaining?}
    J -->|Yes| D
    J -->|No| K{Next Wave?}
    K -->|Yes| C
    K -->|No| L[Game Over Screen]
    G -->|Wrong| M[Reset Combo]
    M --> D
    D -->|Alien Reaches Bottom| N[Lose Life]
    N -->{Lives > 0?}
    N -->|Yes| D
    N -->|No| L
    L --> A
```

### 3.2 User Flow

1. Player opens game → sees animated title screen with "Start Game" button
2. Game starts → 5×8 alien grid appears, scrolling down slowly
3. Question prompt appears at bottom → player reads instructions
4. Player identifies correct alien based on prompt → types answer
5. Press Enter → laser shoots up, correct alien explodes
6. Score updates with combo multiplier → game continues
7. Wave clears → new wave spawns (faster, harder words)
8. Lives run out or all waves complete → game over screen with stats

## 4. User Interface Design

### 4.1 Design Style

| Element | Specification |
|---------|---------------|
| **Primary Colors** | Neon Pink (#FF00FF), Neon Cyan (#00FFFF), Deep Purple (#1a0033) |
| **Background** | Near-black (#0a0a0f) with starfield |
| **Text Color** | White with neon glow effect |
| **Accent** | Neon Green (#00FF00) for correct answers |
| **Warning** | Neon Red (#FF0000) for wrong answers |
| **Font** | 'Press Start 2P' or monospace with pixel rendering |
| **UI Style** | 80s retro-futuristic, glowing borders, scanlines |

### 4.2 Screen Layouts

#### Start Screen
- Centered animated game title with neon glow
- "START GAME" button (glowing cyan rectangle)
- "HOW TO PLAY" button
- Background: Animated starfield with grid floor

#### Game Screen
- **Top Bar**: Score (left), Combo Multiplier (center), Lives (right as heart icons)
- **Main Area**: Canvas with aliens descending
- **Bottom Panel**: 
  - Question prompt (large text)
  - Input field with blinking cursor
  - Current wave indicator

#### Game Over Screen
- "GAME OVER" title
- Final score display
- Stats: Words correct, accuracy percentage, highest combo
- "Words to Review" list (words answered incorrectly)
- "PLAY AGAIN" and "MAIN MENU" buttons

### 4.3 Animations & Effects

| Effect | Description |
|--------|-------------|
| **Alien Hover** | Gentle bobbing animation (sine wave) |
| **Starfield** | Parallax scrolling background layers |
| **Laser Shoot** | Fast line from bottom to target with trail |
| **Explosion** | Particle burst with 15-20 neon particles |
| **Text Glow** | Pulsing neon glow on important text |
| **Scanlines** | Subtle CRT effect overlay |
| **Combo Pulse** | Multiplier text scales up on increase |

### 4.4 Responsiveness

**Desktop (1280px+)**
- Full canvas size: 960×720
- Side margins with decorative elements
- Keyboard controls primary

**Tablet (768px - 1279px)**
- Scaled canvas: 100% width, maintain aspect ratio
- Touch controls visible
- Adjusted UI spacing

**Mobile (< 768px)**
- Full-width canvas, reduced height
- Virtual keyboard toggle button
- Simplified UI elements
- Touch-optimized buttons (min 44px)

## 5. Technical Considerations

### 5.1 Performance Targets

- 60 FPS game loop
- < 16ms frame time
- Smooth typing response (< 50ms)
- Particle count: max 100 concurrent

### 5.2 Browser Compatibility

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

### 5.3 Accessibility

- High contrast mode option
- Keyboard-only navigation
- Screen reader support for UI elements
- Reduced motion option

---

**Document Version:** 1.0  
**Created:** 2025-05-16  
**Status:** Draft