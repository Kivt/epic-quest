import { describe, it, expect } from 'vitest';
import { buildSlideState } from '../stateManager';
import { sampleStory } from '../../assets/story';

describe('State Manager Integration Tests', () => {
    it('should handle sample story state inheritance correctly', () => {
    // Test morning scene, slide m1, final state
        const m1FinalState = buildSlideState(sampleStory, 0, 0, 2);
    
        expect(m1FinalState.background).toBe('/bg/classroom_day.svg');
        expect(m1FinalState.characters.left).toEqual({
            id: 'yuki',
            pose: 'surprised', // Updated in step 2
            x: undefined,
            y: undefined,
            z: undefined
        });
        expect(m1FinalState.characters.right).toEqual({
            id: 'teacher',
            pose: 'neutral',
            x: undefined,
            y: undefined,
            z: undefined
        });
        expect(m1FinalState.textbox).toEqual({
            speaker: 'yuki',
            text: 'A special lesson? I wonder what it could be!'
        });
    });

    it('should inherit state from m1 to m2', () => {
    // Test morning scene, slide m2, initial state (should inherit from m1)
        const m2InitialState = buildSlideState(sampleStory, 0, 1, -1);
    
        // Should inherit background and characters from m1 final state
        expect(m2InitialState.background).toBe('/bg/classroom_day.svg');
        expect(m2InitialState.characters.left?.id).toBe('yuki');
        expect(m2InitialState.characters.left?.pose).toBe('surprised'); // Inherited from m1
        expect(m2InitialState.characters.right?.id).toBe('teacher');
    
        // But textbox should be overridden by m2 initial state
        expect(m2InitialState.textbox).toEqual({
            speaker: 'teacher',
            text: "We'll be studying the history of our town."
        });
    });

    it('should handle background transition in m2', () => {
    // Test morning scene, slide m2, after background change (step 2)
        const m2Step2State = buildSlideState(sampleStory, 0, 1, 2);
    
        expect(m2Step2State.background).toBe('/bg/classroom_evening.svg');
        expect(m2Step2State.characters.left?.pose).toBe('smile'); // Updated in step 1
        expect(m2Step2State.characters.right?.pose).toBe('smile'); // Updated in step 0
    });

    it('should not inherit when starting new scene', () => {
    // Test afternoon scene, slide a1, initial state (inherit: false)
        const a1InitialState = buildSlideState(sampleStory, 1, 0, -1);
    
        expect(a1InitialState.background).toBe('/bg/hallway.svg');
        expect(a1InitialState.characters.left).toBeUndefined(); // No inheritance
        expect(a1InitialState.characters.right).toBeUndefined();
        expect(a1InitialState.textbox).toEqual({
            speaker: 'yuki',
            text: 'Class is finally over. What should I do now?'
        });
    });

    it('should handle character positioning changes', () => {
    // Test afternoon scene, slide a1, step 0 (shows characters)
        const a1Step0State = buildSlideState(sampleStory, 1, 0, 0);
    
        expect(a1Step0State.characters.center).toEqual({
            id: 'yuki',
            pose: 'neutral',
            x: undefined,
            y: undefined,
            z: undefined
        });
        expect(a1Step0State.characters.right).toEqual({
            id: 'friend',
            pose: 'excited',
            x: undefined,
            y: undefined,
            z: undefined
        });
    });

    it('should inherit complex state through multiple slides', () => {
    // Test afternoon scene, slide a3, initial state
    // This should inherit from a2 which inherited from a1
        const a3InitialState = buildSlideState(sampleStory, 1, 2, -1);
    
        expect(a3InitialState.background).toBe('/bg/library.svg'); // Changed in a2
        expect(a3InitialState.characters.center?.id).toBe('yuki'); // Inherited through chain
        expect(a3InitialState.characters.right?.id).toBe('friend'); // Inherited through chain
        expect(a3InitialState.textbox).toEqual({
            speaker: 'friend',
            text: 'Look at this old book I found!'
        });
    });

    it('should handle character hiding in final scene', () => {
    // Test evening scene, slide e2, final step (characters are hidden)
        const e2FinalState = buildSlideState(sampleStory, 2, 1, 2);
    
        expect(e2FinalState.characters.center).toBeUndefined(); // yuki hidden
        expect(e2FinalState.characters.right).toBeUndefined(); // friend hidden
        expect(e2FinalState.textbox?.text).toBe('To be continued...');
    });

    it('should handle edge case of negative step index', () => {
    // Test with step index -1 (before any steps)
        const initialState = buildSlideState(sampleStory, 0, 0, -1);
    
        expect(initialState.textbox).toEqual({
            speaker: 'yuki',
            text: 'Another day at school...'
        });
        expect(initialState.characters.left).toBeUndefined(); // No characters shown yet
    });
});