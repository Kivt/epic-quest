# Implementation Plan

- [x] 1. Set up TypeScript interfaces and types

  - Create type definitions file with Story, Scene, Slide, Action, and SlideState interfaces
  - Define UISlot, AssetId, CharId, and PoseId type aliases
  - Export all types for use across components
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_

- [x] 2. Create sample story data structure

  - Create assets/story.ts file with sample visual novel story
  - Implement story with multiple scenes and slides demonstrating state inheritance
  - Include character changes, background transitions, and dialogue progression
  - Follow the approved story schema with backgrounds and character assets
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

- [ ] 3. Implement core state management logic
- [x] 3.1 Create state inheritance function

  - Implement buildSlideState function that handles slide inheritance
  - Handle initial state setup and previous slide state inheritance
  - Apply initial state overrides from slide configuration
  - Write unit tests for state inheritance scenarios
  - _Requirements: 4.1, 4.4_

- [x] 3.2 Implement action processing functions

  - Create separate functions for each action type (applySayAction, applySetBackgroundAction, etc.)
  - Implement applyAction dispatcher function
  - Ensure immutable state updates for all action handlers
  - Write unit tests for each action function
  - _Requirements: 4.1, 4.4_

- [x] 4. Create BackgroundImage component

  - Implement Vue component for displaying background images
  - Add responsive scaling with object-fit: cover
  - Implement fade transition effects for background changes
  - Handle missing image fallbacks gracefully
  - Write component tests for image loading and transitions
  - _Requirements: 1.1, 1.4, 6.1, 6.2_

- [x] 5. Create CharacterSprites component

  - Implement Vue component for displaying character sprites
  - Support slot-based positioning (left, center, right)
  - Handle character show/hide animations
  - Implement pose transition effects
  - Support optional coordinate-based positioning (x, y, z)
  - Write component tests for character positioning and animations
  - _Requirements: 1.2, 1.3, 6.1, 6.2_

- [x] 6. Create TextBox component

  - Implement Vue component for dialogue display
  - Show speaker name and dialogue text
  - Position at bottom of viewport with proper styling
  - Handle text overflow and responsive sizing
  - Implement show/hide animations for text box
  - Write component tests for text display and responsive behavior
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 6.3, 6.4_

- [x] 7. Create NavigationControls component

  - Implement Vue component for story navigation
  - Add Next button with proper styling
  - Implement keyboard support (spacebar, enter)
  - Handle navigation state (enabled/disabled)
  - Ensure accessibility with focus management
  - Write component tests for navigation interactions
  - _Requirements: 3.1, 3.2, 3.4, 6.4_

- [x] 8. Implement main VisualNovelReader component
- [x] 8.1 Create component structure and props

  - Set up Vue component with story prop
  - Initialize reactive state for current scene/slide/step indices
  - Implement computed properties for current slide state
  - Create navigation methods (nextStep, navigateToNext)
  - _Requirements: 3.1, 3.2, 3.3_

- [x] 8.2 Integrate state management

  - Connect buildSlideState function to component state
  - Implement step progression logic
  - Handle scene and slide transitions
  - Manage story completion state
  - Write integration tests for state management
  - _Requirements: 3.1, 3.2, 3.3, 3.5_

- [x] 8.3 Compose child components

  - Integrate BackgroundImage, CharacterSprites, TextBox, and NavigationControls
  - Pass appropriate props to each child component
  - Handle component communication and event handling
  - Implement full viewport layout with proper layering
  - Write integration tests for component composition
  - _Requirements: 1.1, 1.2, 2.1, 3.1_

- [x] 9. Update main App component

  - Import and use VisualNovelReader component
  - Pass sample story data to the reader
  - Remove existing placeholder content
  - Ensure proper styling and layout
  - _Requirements: 1.1, 2.1, 3.1_

- [x] 10. Add responsive design and styling

  - Implement CSS for mobile, tablet, and desktop breakpoints
  - Ensure proper image scaling across device sizes
  - Style text box for readability on all devices
  - Make navigation controls accessible on touch devices
  - Test responsive behavior across different viewport sizes
  - _Requirements: 6.1, 6.2, 6.3, 6.4_

- [x] 11. Create placeholder assets and test complete story flow
  - Add placeholder background images to public/bg/ directory
  - Add placeholder character sprites to public/ch/ directory
  - Test complete story navigation from start to finish
  - Verify state inheritance works correctly across slides
  - Test all action types (say, setBackground, showCharacter, etc.)
  - Ensure proper error handling for missing assets
  - _Requirements: 1.1, 1.2, 1.4, 2.1, 3.1, 3.2, 3.3, 3.5, 5.1, 5.2, 5.3, 5.4, 5.5_
