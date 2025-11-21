# emotionagotchi-app
Emotionagotchi is a modern resurrection of the classic Tamagotchi (1996 digital pet), brought back with a new purpose:  you don’t feed it, clean it, or keep it alive. Instead, your creature grows every time you emotionally regulate, express, validate, or process a feeling. It’s a digital companion designed to mirror your emotional life.


## Current Features Implemented

- **Type System**: Complete TypeScript type definitions for EmotionLog, CreatureState, and AppState
- **Storage Service**: localStorage-based persistence layer with error handling for logs, creature state, and safety scores
- **Creature State Logic**: Calculation utilities for brightness/size changes based on expressed/suppressed emotions
- **Global State Management**: React Context API implementation (EmotionContext) for managing application state
- **Theme System**: Dark pastel color palette with CSS custom properties
- **EmotionInput Component**: Text input with 100-character limit, real-time character counter, and auto-focus
- **ActionButtons Component**: Express and Suppress buttons with pastel styling, disabled state handling, and accessibility features
- **Creature Component**: Animated blob creature with four animation states (idle, grow, curl, celebrate), dynamic brightness filtering, and size scaling based on emotional state
- **SafetyBar Component**: Progress bar displaying inner safety score with mint-colored fill, smooth growth animation, and numeric score display
- **LogHistory Component**: Displays emotion logs in reverse chronological order with human-readable timestamps, visual indicators for expressed/suppressed actions, empty state handling, and scrollable list
- **Navigation Component**: Provides navigation links between main and history pages with smooth transitions using Next.js Link component, styled with pastel colors and focus indicators
- **Property-Based Testing**: fast-check integration for testing creature brightness calculations and text contrast accessibility
- **Unit Testing**: Comprehensive test coverage using Vitest and React Testing Library

## File Structure Overview

```
emotionagotchi-app/
├── src/
│   ├── app/
│   │   ├── globals.css         # Theme variables and global styles
│   │   ├── layout.tsx          # Root layout
│   │   └── page.tsx            # Main page (placeholder)
│   ├── components/
│   │   ├── ActionButtons/      # Express/Suppress action buttons
│   │   │   ├── ActionButtons.tsx
│   │   │   ├── ActionButtons.module.css
│   │   │   └── index.ts
│   │   ├── Creature/           # Animated creature component
│   │   │   ├── Creature.tsx
│   │   │   ├── Creature.test.tsx
│   │   │   ├── Creature.module.css
│   │   │   └── index.ts
│   │   ├── EmotionInput/       # Emotion log input component
│   │   │   ├── EmotionInput.tsx
│   │   │   ├── EmotionInput.test.tsx
│   │   │   ├── EmotionInput.module.css
│   │   │   └── index.ts
│   │   ├── LogHistory/         # Emotion log history display
│   │   │   ├── LogHistory.tsx
│   │   │   ├── LogHistory.test.tsx
│   │   │   ├── LogHistory.module.css
│   │   │   └── index.ts
│   │   ├── Navigation/         # Navigation between pages
│   │   │   ├── Navigation.tsx
│   │   │   ├── Navigation.module.css
│   │   │   └── index.ts
│   │   └── SafetyBar/          # Inner safety score progress bar
│   │       ├── SafetyBar.tsx
│   │       ├── SafetyBar.module.css
│   │       └── index.ts
│   ├── context/
│   │   ├── EmotionContext.tsx       # Global state management
│   │   └── EmotionContext.test.tsx
│   ├── services/
│   │   ├── storageService.ts        # localStorage abstraction
│   │   └── storageService.test.ts
│   ├── types/
│   │   └── index.ts                 # TypeScript type definitions
│   └── utils/
│       ├── creatureState.ts         # Creature state calculations
│       ├── creatureState.test.ts
│       └── contrast.test.ts         # Accessibility tests
├── vitest.config.ts
├── vitest.setup.ts
└── package.json
```

## Kiro Features Used (Vibe Coding, Specs, Hooks)

This project is being developed using **Kiro Specs**, a structured approach to building features:

- **Requirements Document** (`.kiro/specs/emotionagotchi/requirements.md`): Defines 10 user stories with acceptance criteria
- **Design Document** (`.kiro/specs/emotionagotchi/design.md`): Specifies architecture, components, and 12 correctness properties for property-based testing
- **Tasks Document** (`.kiro/specs/emotionagotchi/tasks.md`): Breaks implementation into 20 incremental tasks

The spec-driven approach ensures:
- Clear requirements traceability
- Property-based testing aligned with design properties
- Incremental development with checkpoints
- Comprehensive test coverage from the start

## Technology Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: CSS Modules with CSS custom properties
- **State Management**: React Context API
- **Storage**: Browser localStorage
- **Testing**: Vitest, @testing-library/react, fast-check
- **Animation**: CSS transitions and keyframes

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Run tests
npm test

# Run tests in watch mode
npm run test:watch
```

## Changelog

### [2025-11-21 Initial Implementation]
- Set up Next.js 14 project with TypeScript and Vitest
- Implemented core type definitions (EmotionLog, CreatureState, AppState)
- Created localStorage service layer with error handling
- Built creature state calculation utilities with property-based tests
- Established dark pastel theme with CSS custom properties
- Implemented EmotionContext for global state management
- Created EmotionInput component with character counter and auto-focus
- Added comprehensive test coverage including property-based tests for brightness calculations and contrast accessibility

### [2025-11-21 ActionButtons Component]
- Implemented ActionButtons component with Express and Suppress buttons
- Added pastel styling with mint color for Express and lavender for Suppress
- Implemented disabled state handling when no text is entered
- Added hover effects, focus indicators, and smooth transitions
- Included accessibility features with ARIA labels and keyboard support
- Completed Task 8 from implementation plan

### [2025-11-21 Creature Component]
- Implemented Creature component with CSS-based animated blob design
- Added four animation states: idle (breathing), grow (expressed), curl (suppressed), and celebrate (max brightness)
- Implemented dynamic brightness filtering (0-100 maps to 0.5-1.5 brightness)
- Implemented dynamic size scaling (0-100 maps to 0.8-1.2 scale)
- Created comprehensive CSS animations with keyframes for all creature states
- Added unit tests covering animation classes, brightness transforms, size transforms, and accessibility
- Completed Task 9 from implementation plan

### [2025-11-21 SafetyBar Component]
- Implemented SafetyBar component displaying inner safety score with progress bar
- Added mint-colored fill with smooth 0.5s transition animation
- Displays numeric score with sparkle emoji (✨) for visual appeal
- Calculates percentage fill based on score/maxScore ratio (default max: 100)
- Styled with dark pastel theme matching overall design system
- Completed Task 10 from implementation plan

### [2025-11-21 LogHistory Component]
- Implemented LogHistory component for displaying emotion logs in reverse chronological order
- Added human-readable timestamp formatting (Today, Yesterday, or date with time)
- Implemented visual indicators with emoji icons (🌱 for expressed, 🌑 for suppressed)
- Created empty state message for when no logs exist
- Added scrollable container for long lists of emotion logs
- Styled with dark pastel theme using mint accent for expressed and muted lavender for suppressed
- Completed Task 13 from implementation plan

### [2025-11-21 Navigation Component]
- Implemented Navigation component for seamless navigation between main and history pages
- Added two navigation types: 'toHistory' (View History link) and 'toMain' (Back to Creature link)
- Utilized Next.js Link component for smooth client-side transitions without page reloads
- Styled with pastel colors (lavender for history link, mint for back link)
- Included hover effects and focus indicators for accessibility
- Completed Task 15 from implementation plan

### [2025-11-21 16:00] SafetyBar Accessibility Enhancement
- Enhanced SafetyBar component with comprehensive ARIA attributes for screen reader support
- Added progressbar role with aria-valuenow, aria-valuemin, and aria-valuemax attributes
- Implemented aria-live region for dynamic score updates
- Added aria-labelledby to connect progress bar with descriptive label
- Improved semantic HTML structure for better accessibility compliance
- Requirement 7.5: Enhanced keyboard accessibility and screen reader support
