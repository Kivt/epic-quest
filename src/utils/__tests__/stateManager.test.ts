import { describe, it, expect } from "vitest";
import { 
    buildSlideState, 
    applyAction,
    applySayAction,
    applySetBackgroundAction,
    applyShowCharacterAction,
    applyUpdateCharacterAction,
    applyHideCharacterAction
} from "../stateManager";
import type { Story, SlideState, Action } from "../../types/story";

// Test story data
const testStory: Story = {
    version: "1.0",
    meta: {
        id: "test-story",
        title: "Test Story",
    },
    assets: {
        backgrounds: {
            bg1: "/bg/bg1.jpg",
            bg2: "/bg/bg2.jpg",
        },
        characters: {
            char1: {
                name: "Character 1",
                poses: {
                    neutral: "/ch/char1_neutral.png",
                    smile: "/ch/char1_smile.png",
                },
            },
            char2: {
                name: "Character 2",
                poses: {
                    neutral: "/ch/char2_neutral.png",
                },
            },
        },
    },
    scenes: [
        {
            id: "scene1",
            slides: [
                {
                    id: "slide1",
                    initial: {
                        inherit: false,
                        background: "bg1",
                        characters: {
                            left: { id: "char1", pose: "neutral" },
                        },
                        textbox: { speaker: "char1", text: "Hello!" },
                    },
                    steps: [
                        [{ type: "say", text: "How are you?" }],
                        [
                            {
                                type: "showCharacter",
                                slot: "right",
                                id: "char2",
                                pose: "neutral",
                            },
                        ],
                    ],
                },
                {
                    id: "slide2",
                    initial: {
                        inherit: true,
                        textbox: { speaker: "char2", text: "I'm fine, thanks!" },
                    },
                    steps: [
                        [{ type: "updateCharacter", id: "char1", pose: "smile" }],
                        [{ type: "setBackground", id: "bg2" }],
                    ],
                },
                {
                    id: "slide3",
                    initial: {
                        inherit: false,
                        background: "bg2",
                    },
                    steps: [[{ type: "say", text: "New scene!" }]],
                },
            ],
        },
    ],
};

describe("buildSlideState", () => {
    it("should build initial state for first slide without inheritance", () => {
        const state = buildSlideState(testStory, 0, 0, -1);

        expect(state.background).toBe("/bg/bg1.jpg");
        expect(state.characters.left).toEqual({
            id: "char1",
            pose: "neutral",
            x: undefined,
            y: undefined,
            z: undefined,
        });
        expect(state.textbox).toEqual({
            speaker: "char1",
            text: "Hello!",
        });
    });

    it("should apply actions up to specified step index", () => {
    // Step 0: "How are you?"
        const state0 = buildSlideState(testStory, 0, 0, 0);
        expect(state0.textbox?.text).toBe("How are you?");
        expect(state0.characters.right).toBeUndefined();

        // Step 1: Show char2 on right
        const state1 = buildSlideState(testStory, 0, 0, 1);
        expect(state1.characters.right).toEqual({
            id: "char2",
            pose: "neutral",
            x: undefined,
            y: undefined,
            z: undefined,
        });
    });

    it("should inherit state from previous slide when inherit is true", () => {
    // Build final state of slide 0
        const finalSlide0State = buildSlideState(testStory, 0, 0, 1);

        // Build initial state of slide 1 (should inherit)
        const slide1InitialState = buildSlideState(testStory, 0, 1, -1);

        // Should inherit background and characters from previous slide
        expect(slide1InitialState.background).toBe(finalSlide0State.background);
        expect(slide1InitialState.characters.left).toEqual(
            finalSlide0State.characters.left
        );
        expect(slide1InitialState.characters.right).toEqual(
            finalSlide0State.characters.right
        );

        // But textbox should be overridden by initial state
        expect(slide1InitialState.textbox).toEqual({
            speaker: "char2",
            text: "I'm fine, thanks!",
        });
    });

    it("should not inherit when inherit is false", () => {
        const slide2State = buildSlideState(testStory, 0, 2, -1);

        // Should not inherit characters from previous slide
        expect(slide2State.characters.left).toBeUndefined();
        expect(slide2State.characters.right).toBeUndefined();

        // Should have its own background
        expect(slide2State.background).toBe("/bg/bg2.jpg");

        // Should not have textbox (not specified in initial)
        expect(slide2State.textbox).toBeUndefined();
    });

    it("should apply actions after inheritance", () => {
    // Step 0 of slide 1: update char1 pose to smile
        const state = buildSlideState(testStory, 0, 1, 0);

        expect(state.characters.left?.pose).toBe("smile");
        expect(state.characters.right?.id).toBe("char2"); // Still inherited
    });

    it("should handle complex inheritance chain", () => {
    // Step 1 of slide 1: change background to bg2
        const state = buildSlideState(testStory, 0, 1, 1);

        expect(state.background).toBe("/bg/bg2.jpg");
        expect(state.characters.left?.pose).toBe("smile"); // From step 0
        expect(state.characters.right?.id).toBe("char2"); // Inherited
        expect(state.textbox?.speaker).toBe("char2"); // From initial override
    });

    it("should throw error for invalid scene index", () => {
        expect(() => buildSlideState(testStory, 99, 0, 0)).toThrow(
            "Scene at index 99 not found"
        );
    });

    it("should throw error for invalid slide index", () => {
        expect(() => buildSlideState(testStory, 0, 99, 0)).toThrow(
            "Slide at index 99 not found in scene scene1"
        );
    });
});

describe("applyAction", () => {
    const initialState: SlideState = {
        background: "/bg/bg1.jpg",
        characters: {
            left: { id: "char1", pose: "neutral" },
        },
        textbox: { speaker: "char1", text: "Hello" },
    };

    it("should apply say action", () => {
        const action: Action = { type: "say", text: "New text", speaker: "char2" };
        const newState = applyAction(initialState, action, testStory);

        expect(newState.textbox).toEqual({
            speaker: "char2",
            text: "New text",
        });
    });

    it("should apply say action without speaker (keep existing)", () => {
        const action: Action = { type: "say", text: "New text" };
        const newState = applyAction(initialState, action, testStory);

        expect(newState.textbox).toEqual({
            speaker: "char1", // Kept from previous state
            text: "New text",
        });
    });

    it("should apply setBackground action", () => {
        const action: Action = { type: "setBackground", id: "bg2" };
        const newState = applyAction(initialState, action, testStory);

        expect(newState.background).toBe("/bg/bg2.jpg");
    });

    it("should apply showCharacter action", () => {
        const action: Action = {
            type: "showCharacter",
            slot: "right",
            id: "char2",
            pose: "neutral",
            x: 100,
            y: 200,
        };
        const newState = applyAction(initialState, action, testStory);

        expect(newState.characters.right).toEqual({
            id: "char2",
            pose: "neutral",
            x: 100,
            y: 200,
            z: undefined,
        });
    });

    it("should apply updateCharacter action", () => {
        const action: Action = {
            type: "updateCharacter",
            id: "char1",
            pose: "smile",
        };
        const newState = applyAction(initialState, action, testStory);

        expect(newState.characters.left?.pose).toBe("smile");
        expect(newState.characters.left?.id).toBe("char1"); // Unchanged
    });

    it("should apply updateCharacter action with slot change", () => {
        const action: Action = {
            type: "updateCharacter",
            id: "char1",
            slot: "center",
            pose: "smile",
        };
        const newState = applyAction(initialState, action, testStory);

        expect(newState.characters.left).toBeUndefined(); // Removed from old slot
        expect(newState.characters.center).toEqual({
            id: "char1",
            pose: "smile",
            x: undefined,
            y: undefined,
            z: undefined,
        });
    });

    it("should apply hideCharacter action", () => {
        const action: Action = { type: "hideCharacter", id: "char1" };
        const newState = applyAction(initialState, action, testStory);

        expect(newState.characters.left).toBeUndefined();
    });

    it("should handle updateCharacter for non-existent character", () => {
        const action: Action = {
            type: "updateCharacter",
            id: "nonexistent",
            pose: "smile",
        };
        const newState = applyAction(initialState, action, testStory);

        expect(newState).toEqual(initialState); // No change
    });

    it("should handle hideCharacter for non-existent character", () => {
        const action: Action = { type: "hideCharacter", id: "nonexistent" };
        const newState = applyAction(initialState, action, testStory);

        expect(newState).toEqual(initialState); // No change
    });

    it("should not modify state for transition and wait actions", () => {
        const transitionAction: Action = {
            type: "transition",
            name: "fade",
            ms: 500,
        };
        const waitAction: Action = { type: "wait", ms: 1000 };

        const stateAfterTransition = applyAction(
            initialState,
            transitionAction,
            testStory
        );
        const stateAfterWait = applyAction(initialState, waitAction, testStory);

        expect(stateAfterTransition).toEqual(initialState);
        expect(stateAfterWait).toEqual(initialState);
    });

    it("should maintain immutability", () => {
        const action: Action = { type: "say", text: "New text" };
        const newState = applyAction(initialState, action, testStory);

        expect(newState).not.toBe(initialState);
        expect(newState.characters).not.toBe(initialState.characters);
        expect(initialState.textbox?.text).toBe("Hello"); // Original unchanged
    });
});

describe("Individual Action Functions", () => {
    const baseState: SlideState = {
        background: "/bg/bg1.jpg",
        characters: {
            left: { id: "char1", pose: "neutral" },
            center: { id: "char2", pose: "smile" },
        },
        textbox: { speaker: "char1", text: "Hello" },
    };

    describe("applySayAction", () => {
        it("should update textbox with new text and speaker", () => {
            const action = { type: "say" as const, text: "New message", speaker: "char2" };
            const result = applySayAction(baseState, action);

            expect(result.textbox).toEqual({
                speaker: "char2",
                text: "New message",
            });
            expect(result.background).toBe(baseState.background);
            expect(result.characters).toEqual(baseState.characters);
        });

        it("should preserve existing speaker when not provided", () => {
            const action = { type: "say" as const, text: "New message" };
            const result = applySayAction(baseState, action);

            expect(result.textbox).toEqual({
                speaker: "char1", // Preserved from original
                text: "New message",
            });
        });

        it("should handle state without existing textbox", () => {
            const stateWithoutTextbox: SlideState = {
                background: "/bg/bg1.jpg",
                characters: {},
            };
            const action = { type: "say" as const, text: "First message", speaker: "char1" };
            const result = applySayAction(stateWithoutTextbox, action);

            expect(result.textbox).toEqual({
                speaker: "char1",
                text: "First message",
            });
        });
    });

    describe("applySetBackgroundAction", () => {
        it("should update background from story assets", () => {
            const action = { type: "setBackground" as const, id: "bg2" };
            const result = applySetBackgroundAction(baseState, action, testStory);

            expect(result.background).toBe("/bg/bg2.jpg");
            expect(result.characters).toEqual(baseState.characters);
            expect(result.textbox).toEqual(baseState.textbox);
        });

        it("should handle non-existent background ID", () => {
            const action = { type: "setBackground" as const, id: "nonexistent" };
            const result = applySetBackgroundAction(baseState, action, testStory);

            expect(result.background).toBeUndefined();
        });
    });

    describe("applyShowCharacterAction", () => {
        it("should add character to specified slot", () => {
            const action = {
                type: "showCharacter" as const,
                slot: "right" as const,
                id: "char3",
                pose: "happy",
                x: 100,
                y: 200,
                z: 5,
            };
            const result = applyShowCharacterAction(baseState, action);

            expect(result.characters.right).toEqual({
                id: "char3",
                pose: "happy",
                x: 100,
                y: 200,
                z: 5,
            });
            expect(result.characters.left).toEqual(baseState.characters.left);
            expect(result.characters.center).toEqual(baseState.characters.center);
        });

        it("should overwrite existing character in slot", () => {
            const action = {
                type: "showCharacter" as const,
                slot: "left" as const,
                id: "newchar",
                pose: "excited",
            };
            const result = applyShowCharacterAction(baseState, action);

            expect(result.characters.left).toEqual({
                id: "newchar",
                pose: "excited",
                x: undefined,
                y: undefined,
                z: undefined,
            });
        });
    });

    describe("applyUpdateCharacterAction", () => {
        it("should update existing character pose", () => {
            const action = {
                type: "updateCharacter" as const,
                id: "char1",
                pose: "angry",
            };
            const result = applyUpdateCharacterAction(baseState, action);

            expect(result.characters.left?.pose).toBe("angry");
            expect(result.characters.left?.id).toBe("char1");
        });

        it("should move character to different slot", () => {
            const action = {
                type: "updateCharacter" as const,
                id: "char1",
                slot: "right" as const,
                pose: "happy",
            };
            const result = applyUpdateCharacterAction(baseState, action);

            expect(result.characters.left).toBeUndefined();
            expect(result.characters.right).toEqual({
                id: "char1",
                pose: "happy",
                x: undefined,
                y: undefined,
                z: undefined,
            });
        });

        it("should update position coordinates", () => {
            const action = {
                type: "updateCharacter" as const,
                id: "char2",
                x: 150,
                y: 250,
                z: 10,
            };
            const result = applyUpdateCharacterAction(baseState, action);

            expect(result.characters.center).toEqual({
                id: "char2",
                pose: "smile", // Preserved
                x: 150,
                y: 250,
                z: 10,
            });
        });

        it("should return unchanged state for non-existent character", () => {
            const action = {
                type: "updateCharacter" as const,
                id: "nonexistent",
                pose: "happy",
            };
            const result = applyUpdateCharacterAction(baseState, action);

            expect(result).toEqual(baseState);
        });
    });

    describe("applyHideCharacterAction", () => {
        it("should remove character from scene", () => {
            const action = { type: "hideCharacter" as const, id: "char1" };
            const result = applyHideCharacterAction(baseState, action);

            expect(result.characters.left).toBeUndefined();
            expect(result.characters.center).toEqual(baseState.characters.center);
        });

        it("should return unchanged state for non-existent character", () => {
            const action = { type: "hideCharacter" as const, id: "nonexistent" };
            const result = applyHideCharacterAction(baseState, action);

            expect(result).toEqual(baseState);
        });
    });

    describe("Immutability Tests", () => {
        it("should not mutate original state in applySayAction", () => {
            const action = { type: "say" as const, text: "New text" };
            const result = applySayAction(baseState, action);

            expect(result).not.toBe(baseState);
            expect(result.characters).not.toBe(baseState.characters);
            expect(baseState.textbox?.text).toBe("Hello"); // Original unchanged
        });

        it("should not mutate original state in applyShowCharacterAction", () => {
            const action = {
                type: "showCharacter" as const,
                slot: "right" as const,
                id: "char3",
                pose: "happy",
            };
            const result = applyShowCharacterAction(baseState, action);

            expect(result).not.toBe(baseState);
            expect(result.characters).not.toBe(baseState.characters);
            expect(baseState.characters.right).toBeUndefined(); // Original unchanged
        });

        it("should not mutate original state in applyUpdateCharacterAction", () => {
            const action = {
                type: "updateCharacter" as const,
                id: "char1",
                pose: "angry",
            };
            const result = applyUpdateCharacterAction(baseState, action);

            expect(result).not.toBe(baseState);
            expect(result.characters).not.toBe(baseState.characters);
            expect(baseState.characters.left?.pose).toBe("neutral"); // Original unchanged
        });

        it("should not mutate original state in applyHideCharacterAction", () => {
            const action = { type: "hideCharacter" as const, id: "char1" };
            const result = applyHideCharacterAction(baseState, action);

            expect(result).not.toBe(baseState);
            expect(result.characters).not.toBe(baseState.characters);
            expect(baseState.characters.left).toBeDefined(); // Original unchanged
        });
    });
});
