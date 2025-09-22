import type {
    Story,
    SlideState,
    Action,
    UISlot,
    CharId,
    AssetId,
    PoseId,
} from "../types/story";

/**
 * Builds the complete slide state by handling inheritance and applying actions
 * @param story The complete story data
 * @param sceneIndex Index of the current scene
 * @param slideIndex Index of the current slide within the scene
 * @param stepIndex Index of the current step within the slide
 * @returns The computed slide state
 */
export function buildSlideState(
    story: Story,
    sceneIndex: number,
    slideIndex: number,
    stepIndex: number
): SlideState {
    const scene = story.scenes[sceneIndex];
    if (!scene) {
        throw new Error(`Scene at index ${sceneIndex} not found`);
    }

    const slide = scene.slides[slideIndex];
    if (!slide) {
        throw new Error(
            `Slide at index ${slideIndex} not found in scene ${scene.id}`
        );
    }

    // Start with empty state
    let slideState: SlideState = {
        characters: {},
    };

    // Handle inheritance from previous slide
    if (slide.initial?.inherit !== false && slideIndex > 0) {
    // Get the final state of the previous slide
        const prevSlide = scene.slides[slideIndex - 1];
        const prevFinalStepIndex = prevSlide.steps.length - 1;
        slideState = buildSlideState(
            story,
            sceneIndex,
            slideIndex - 1,
            prevFinalStepIndex
        );
    }

    // Apply initial state overrides
    if (slide.initial) {
        if (slide.initial.background) {
            slideState.background =
        story.assets.backgrounds[slide.initial.background];
        }

        if (slide.initial.backgroundBlur !== undefined) {
            slideState.backgroundBlur = slide.initial.backgroundBlur;
        }

        if (slide.initial.characters) {
            Object.entries(slide.initial.characters).forEach(
                ([slot, char]: [string, { id: CharId; pose: PoseId; x?: number; y?: number; z?: number }]) => {
                    slideState.characters[slot as UISlot] = {
                        id: char.id,
                        pose: char.pose,
                        x: char.x,
                        y: char.y,
                        z: char.z,
                    };
                }
            );
        }

        if (slide.initial.textbox !== undefined) {
            slideState.textbox = {
                speaker: slide.initial.textbox.speaker,
                text: slide.initial.textbox.text,
            };
        }
    }

    // Apply actions from steps up to current step
    for (let i = 0; i <= stepIndex && i < slide.steps.length; i++) {
        const actions = slide.steps[i];
        actions.forEach((action) => {
            slideState = applyAction(slideState, action, story);
        });
    }

    return slideState;
}

/**
 * Applies a single action to the slide state
 * @param state Current slide state
 * @param action Action to apply
 * @param story Story data for asset resolution
 * @returns New slide state with action applied
 */
export function applyAction(
    state: SlideState,
    action: Action,
    story: Story
): SlideState {
    switch (action.type) {
    case "say":
        return applySayAction(state, action);
    case "setBackground":
        return applySetBackgroundAction(state, action, story);
    case "showCharacter":
        return applyShowCharacterAction(state, action);
    case "updateCharacter":
        return applyUpdateCharacterAction(state, action);
    case "hideCharacter":
        return applyHideCharacterAction(state, action);
    case "transition":
    case "wait":
        // These trigger visual effects or delays but don't change state
        return state;
    default:
        return state;
    }
}

/**
 * Applies a 'say' action to update the textbox
 */
export function applySayAction(
    state: SlideState,
    action: { type: "say"; text: string; speaker?: string }
): SlideState {
    return {
        ...state,
        characters: { ...state.characters },
        textbox: {
            speaker: action.speaker || state.textbox?.speaker,
            text: action.text,
        },
    };
}

/**
 * Applies a 'setBackground' action to change the background
 */
export function applySetBackgroundAction(
    state: SlideState,
    action: { type: "setBackground"; id: AssetId; blur?: number },
    story: Story
): SlideState {
    return {
        ...state,
        characters: { ...state.characters },
        background: story.assets.backgrounds[action.id],
        backgroundBlur: action.blur !== undefined ? action.blur : state.backgroundBlur,
    };
}

/**
 * Applies a 'showCharacter' action to display a character in a slot
 */
export function applyShowCharacterAction(
    state: SlideState,
    action: {
    type: "showCharacter";
    slot: UISlot;
    id: CharId;
    pose: string;
    x?: number;
    y?: number;
    z?: number;
  }
): SlideState {
    return {
        ...state,
        characters: {
            ...state.characters,
            [action.slot]: {
                id: action.id,
                pose: action.pose,
                x: action.x,
                y: action.y,
                z: action.z,
            },
        },
    };
}

/**
 * Applies an 'updateCharacter' action to modify an existing character
 */
export function applyUpdateCharacterAction(
    state: SlideState,
    action: {
    type: "updateCharacter";
    id: CharId;
    pose?: string;
    slot?: UISlot;
    x?: number;
    y?: number;
    z?: number;
  }
): SlideState {
    // Find the character in the current state
    const existingCharEntry = Object.entries(state.characters).find(
        ([, char]) => char && char.id === action.id
    );

    if (!existingCharEntry) {
        return state; // Character not found, no change
    }

    const [currentSlot, currentChar] = existingCharEntry;
    const newSlot = action.slot || currentSlot;

    const updatedChar = {
        ...currentChar,
        pose: action.pose ?? currentChar.pose,
        x: action.x ?? currentChar.x,
        y: action.y ?? currentChar.y,
        z: action.z ?? currentChar.z,
    };

    const newCharacters = { ...state.characters };

    // Remove from old slot if moving to a different slot
    if (action.slot && action.slot !== currentSlot) {
        delete newCharacters[currentSlot as UISlot];
    }

    // Add to new/current slot
    newCharacters[newSlot as UISlot] = updatedChar;

    return {
        ...state,
        characters: newCharacters,
    };
}

/**
 * Applies a 'hideCharacter' action to remove a character from the scene
 */
export function applyHideCharacterAction(
    state: SlideState,
    action: { type: "hideCharacter"; id: CharId }
): SlideState {
    const charSlot = Object.entries(state.characters).find(
        ([, char]) => char && char.id === action.id
    )?.[0];

    if (!charSlot) {
        return state; // Character not found, no change
    }

    const newCharacters = { ...state.characters };
    delete newCharacters[charSlot as UISlot];

    return {
        ...state,
        characters: newCharacters,
    };
}
