import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import VisualNovelReader from '../VisualNovelReader.vue'
import type { Story } from '../../types/story'

// Mock story data for testing
const mockStory: Story = {
    version: "1.0",
    meta: {
        id: "test-story",
        title: "Test Story"
    },
    assets: {
        backgrounds: {
            "bg1": "/bg/test1.jpg",
            "bg2": "/bg/test2.jpg"
        },
        characters: {
            "char1": {
                name: "Character 1",
                poses: {
                    "neutral": "/ch/char1_neutral.png",
                    "happy": "/ch/char1_happy.png"
                }
            }
        }
    },
    scenes: [
        {
            id: "scene1",
            label: "Scene 1",
            slides: [
                {
                    id: "slide1",
                    initial: {
                        inherit: false,
                        background: "bg1",
                        textbox: { speaker: "char1", text: "Initial text" }
                    },
                    steps: [
                        [{ type: "say", text: "Step 1 text" }],
                        [{ type: "say", text: "Step 2 text" }]
                    ],
                    next: { slide: "slide2" }
                },
                {
                    id: "slide2",
                    initial: {
                        inherit: true,
                        textbox: { text: "Slide 2 initial" }
                    },
                    steps: [
                        [{ type: "setBackground", id: "bg2" }],
                        [{ type: "say", text: "Final text" }]
                    ]
                }
            ]
        },
        {
            id: "scene2",
            label: "Scene 2",
            slides: [
                {
                    id: "slide3",
                    initial: {
                        inherit: false,
                        textbox: { text: "Scene 2 text" }
                    },
                    steps: [
                        [{ type: "say", text: "End text" }]
                    ]
                }
            ]
        }
    ]
}

describe('VisualNovelReader State Management', () => {
    let wrapper: any

    beforeEach(() => {
        wrapper = mount(VisualNovelReader, {
            props: {
                story: mockStory
            }
        })
    })

    describe('Initial State', () => {
        it('should initialize with correct default state', () => {
            const vm = wrapper.vm
            expect(vm.storyState.currentSceneIndex).toBe(0)
            expect(vm.storyState.currentSlideIndex).toBe(0)
            expect(vm.storyState.currentStepIndex).toBe(0)
            expect(vm.storyState.isComplete).toBe(false)
        })

        it('should compute current scene correctly', () => {
            const vm = wrapper.vm
            expect(vm.currentScene.id).toBe('scene1')
        })

        it('should compute current slide correctly', () => {
            const vm = wrapper.vm
            expect(vm.currentSlide.id).toBe('slide1')
        })

        it('should build initial slide state correctly', () => {
            const vm = wrapper.vm
            const slideState = vm.currentSlideState
            expect(slideState.background).toBe('/bg/test1.jpg')
            expect(slideState.textbox?.speaker).toBe('char1')
            // At step 0, the first action is already applied
            expect(slideState.textbox?.text).toBe('Step 1 text')
        })
    })

    describe('Step Navigation', () => {
        it('should advance to next step within slide', () => {
            const vm = wrapper.vm
            expect(vm.canProceed).toBe(true)
      
            vm.nextStep()
            expect(vm.storyState.currentStepIndex).toBe(1)
            expect(vm.currentSlideState.textbox?.text).toBe('Step 2 text')
        })

        it('should advance through all steps in slide', () => {
            const vm = wrapper.vm
      
            // Step 0 -> Step 1
            vm.nextStep()
            expect(vm.storyState.currentStepIndex).toBe(1)
            expect(vm.currentSlideState.textbox?.text).toBe('Step 2 text')
      
            // Step 1 -> next slide (since we're at the last step)
            vm.nextStep()
            expect(vm.storyState.currentSlideIndex).toBe(1)
            expect(vm.storyState.currentStepIndex).toBe(0)
        })

        it('should handle canProceed correctly', () => {
            const vm = wrapper.vm
            expect(vm.canProceed).toBe(true)
      
            // Navigate to last step of last slide of last scene
            vm.navigateToPosition(1, 0, 0) // Scene 2, Slide 1, Step 1 (last step in that slide)
            expect(vm.canProceed).toBe(false)
        })
    })

    describe('Slide Navigation', () => {
        it('should navigate to next slide when reaching end of current slide', () => {
            const vm = wrapper.vm
      
            // Navigate through all steps in first slide
            vm.nextStep() // Step 1
            vm.nextStep() // Should move to next slide (since slide1 has 2 steps: 0 and 1)
      
            expect(vm.storyState.currentSlideIndex).toBe(1)
            expect(vm.storyState.currentStepIndex).toBe(0)
            expect(vm.currentSlide.id).toBe('slide2')
        })

        it('should handle explicit slide navigation from next config', () => {
            const vm = wrapper.vm
      
            // Navigate through steps to trigger slide navigation
            vm.nextStep() // Step 1
            vm.nextStep() // Step 2
            vm.nextStep() // Should use next.slide config to go to slide2
      
            expect(vm.currentSlide.id).toBe('slide2')
            expect(vm.storyState.currentSlideIndex).toBe(1)
        })

        it('should inherit state correctly between slides', () => {
            const vm = wrapper.vm
      
            // Navigate to slide2 which inherits from slide1
            vm.navigateToPosition(0, 1, 0)
      
            const slideState = vm.currentSlideState
            // At step 0 of slide2, the setBackground action is applied, so background changes
            expect(slideState.background).toBe('/bg/test2.jpg')
            // Should have new textbox text from initial config
            expect(slideState.textbox?.text).toBe('Slide 2 initial')
        })
    })

    describe('Scene Navigation', () => {
        it('should navigate to next scene when reaching end of current scene', () => {
            const vm = wrapper.vm
      
            // Navigate to end of scene 1
            vm.navigateToPosition(0, 1, 1) // Last step of last slide in scene 1
            vm.nextStep() // Should move to scene 2
      
            expect(vm.storyState.currentSceneIndex).toBe(1)
            expect(vm.storyState.currentSlideIndex).toBe(0)
            expect(vm.storyState.currentStepIndex).toBe(0)
            expect(vm.currentScene.id).toBe('scene2')
        })
    })

    describe('Story Completion', () => {
        it('should mark story as complete when reaching the end', () => {
            const vm = wrapper.vm
      
            // Navigate to last step of story
            vm.navigateToPosition(1, 0, 0) // Scene 2, Slide 1, Step 1 (last step)
            expect(vm.storyState.isComplete).toBe(false)
      
            vm.nextStep() // Should complete the story
            expect(vm.storyState.isComplete).toBe(true)
            expect(vm.canProceed).toBe(false)
        })

        it('should not allow navigation when story is complete', () => {
            const vm = wrapper.vm
      
            // Complete the story
            vm.navigateToPosition(1, 0, 0)
            vm.nextStep()
            expect(vm.storyState.isComplete).toBe(true)
      
            const prevState = { ...vm.storyState }
            vm.nextStep() // Should not change state
      
            expect(vm.storyState).toEqual(prevState)
        })
    })

    describe('Navigation Utilities', () => {
        it('should reset story to beginning', () => {
            const vm = wrapper.vm
      
            // Navigate somewhere in the story
            vm.navigateToPosition(1, 0, 0)
            expect(vm.storyState.currentSceneIndex).toBe(1)
      
            vm.resetStory()
            expect(vm.storyState.currentSceneIndex).toBe(0)
            expect(vm.storyState.currentSlideIndex).toBe(0)
            expect(vm.storyState.currentStepIndex).toBe(0)
            expect(vm.storyState.isComplete).toBe(false)
        })

        it('should navigate to specific position', () => {
            const vm = wrapper.vm
      
            vm.navigateToPosition(1, 0, 0)
            expect(vm.storyState.currentSceneIndex).toBe(1)
            expect(vm.storyState.currentSlideIndex).toBe(0)
            expect(vm.storyState.currentStepIndex).toBe(0)
            expect(vm.currentScene.id).toBe('scene2')
        })

        it('should validate position bounds in navigateToPosition', () => {
            const vm = wrapper.vm
      
            const initialState = { ...vm.storyState }
      
            // Try invalid scene index
            vm.navigateToPosition(99, 0, 0)
            expect(vm.storyState).toEqual(initialState)
      
            // Try invalid slide index
            vm.navigateToPosition(0, 99, 0)
            expect(vm.storyState).toEqual(initialState)
      
            // Try invalid step index
            vm.navigateToPosition(0, 0, 99)
            expect(vm.storyState).toEqual(initialState)
        })
    })

    describe('State Integration with buildSlideState', () => {
        it('should correctly apply actions through state progression', () => {
            const vm = wrapper.vm
      
            // Navigate to slide2 and apply background change action
            vm.navigateToPosition(0, 1, 1) // Slide2, step with setBackground action
      
            const slideState = vm.currentSlideState
            expect(slideState.background).toBe('/bg/test2.jpg') // Background should be changed by action
        })

        it('should handle state inheritance correctly across navigation', () => {
            const vm = wrapper.vm
      
            // Start at slide1, navigate through steps
            vm.nextStep() // Apply second action (step 1)
      
            // Navigate to inheriting slide at step 1 (after setBackground action)
            vm.navigateToPosition(0, 1, 1)
            const inheritedState = vm.currentSlideState
      
            // At step 1 of slide2, background should be changed by setBackground action
            expect(inheritedState.background).toBe('/bg/test2.jpg')
            // But textbox should show the final text from step 1
            expect(inheritedState.textbox?.text).toBe('Final text')
        })
    })
})