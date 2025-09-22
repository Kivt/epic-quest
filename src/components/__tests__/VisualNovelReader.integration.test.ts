import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import VisualNovelReader from '../VisualNovelReader.vue'
import BackgroundImage from '../BackgroundImage.vue'
import CharacterSprites from '../CharacterSprites.vue'
import TextBox from '../TextBox.vue'
import NavigationControls from '../NavigationControls.vue'
import type { Story } from '../../types/story'

// Mock story data for integration testing
const integrationStory: Story = {
    version: "1.0",
    meta: {
        id: "integration-story",
        title: "Integration Test Story"
    },
    assets: {
        backgrounds: {
            "room": "/bg/room.jpg",
            "garden": "/bg/garden.jpg"
        },
        characters: {
            "alice": {
                name: "Alice",
                poses: {
                    "neutral": "/ch/alice_neutral.png",
                    "happy": "/ch/alice_happy.png"
                }
            },
            "bob": {
                name: "Bob",
                poses: {
                    "neutral": "/ch/bob_neutral.png"
                }
            }
        }
    },
    scenes: [
        {
            id: "intro",
            slides: [
                {
                    id: "intro1",
                    initial: {
                        inherit: false,
                        background: "room",
                        characters: {
                            "left": { id: "alice", pose: "neutral" }
                        },
                        textbox: { speaker: "alice", text: "Hello!" }
                    },
                    steps: [
                        [{ type: "say", text: "Welcome to our story." }],
                        [
                            { type: "showCharacter", slot: "right", id: "bob", pose: "neutral" },
                            { type: "say", speaker: "bob", text: "Nice to meet you!" }
                        ],
                        [
                            { type: "setBackground", id: "garden" },
                            { type: "updateCharacter", id: "alice", pose: "happy" },
                            { type: "say", speaker: "alice", text: "Let's go to the garden!" }
                        ]
                    ]
                }
            ]
        }
    ]
}

describe('VisualNovelReader Component Integration', () => {
    let wrapper: any

    beforeEach(() => {
        wrapper = mount(VisualNovelReader, {
            props: {
                story: integrationStory
            }
        })
    })

    describe('Component Composition', () => {
        it('should render all child components', () => {
            expect(wrapper.findComponent(BackgroundImage).exists()).toBe(true)
            expect(wrapper.findComponent(CharacterSprites).exists()).toBe(true)
            expect(wrapper.findComponent(TextBox).exists()).toBe(true)
            expect(wrapper.findComponent(NavigationControls).exists()).toBe(true)
        })

        it('should pass correct props to BackgroundImage', () => {
            const backgroundComponent = wrapper.findComponent(BackgroundImage)
            expect(backgroundComponent.props('imageUrl')).toBe('/bg/room.jpg')
            expect(backgroundComponent.props('transition')).toBe('fade')
        })

        it('should pass correct props to CharacterSprites', () => {
            const charactersComponent = wrapper.findComponent(CharacterSprites)
            expect(charactersComponent.props('story')).toEqual(integrationStory)
      
            const characters = charactersComponent.props('characters')
            expect(characters.left).toEqual({
                id: 'alice',
                pose: 'neutral',
                x: undefined,
                y: undefined,
                z: undefined
            })
        })

        it('should pass correct props to TextBox', () => {
            const textBoxComponent = wrapper.findComponent(TextBox)
            expect(textBoxComponent.props('story')).toEqual(integrationStory)
      
            const textbox = textBoxComponent.props('textbox')
            expect(textbox.speaker).toBe('alice')
            expect(textbox.text).toBe('Welcome to our story.')
        })

        it('should pass correct props to NavigationControls', () => {
            const navComponent = wrapper.findComponent(NavigationControls)
            expect(navComponent.props('canProceed')).toBe(true)
            expect(navComponent.props('isComplete')).toBe(false)
        })
    })

    describe('Component Communication', () => {
        it('should handle navigation events from NavigationControls', async () => {
            const navComponent = wrapper.findComponent(NavigationControls)
            const vm = wrapper.vm
      
            const initialStep = vm.storyState.currentStepIndex
      
            // Emit next event from navigation controls
            await navComponent.vm.$emit('next')
      
            expect(vm.storyState.currentStepIndex).toBe(initialStep + 1)
        })

        it('should update props when state changes', async () => {
            const vm = wrapper.vm
      
            // Navigate to next step
            vm.nextStep()
            await wrapper.vm.$nextTick()
      
            // Check that TextBox receives updated props
            const textBoxComponent = wrapper.findComponent(TextBox)
            const textbox = textBoxComponent.props('textbox')
            expect(textbox.speaker).toBe('bob')
            expect(textbox.text).toBe('Nice to meet you!')
        })

        it('should handle background image events', () => {
            const backgroundComponent = wrapper.findComponent(BackgroundImage)
            const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
      
            // Emit background loaded event
            backgroundComponent.vm.$emit('imageLoaded', '/bg/room.jpg')
      
            expect(consoleSpy).toHaveBeenCalledWith('Background loaded:', '/bg/room.jpg')
      
            consoleSpy.mockRestore()
        })

        it('should handle text box events', () => {
            const textBoxComponent = wrapper.findComponent(TextBox)
            const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
      
            // Emit text box show complete event
            textBoxComponent.vm.$emit('showComplete')
      
            expect(consoleSpy).toHaveBeenCalledWith('Text box show animation complete')
      
            consoleSpy.mockRestore()
        })
    })

    describe('Full Viewport Layout', () => {
        it('should have proper CSS classes for full viewport', () => {
            const readerElement = wrapper.find('.visual-novel-reader')
            expect(readerElement.exists()).toBe(true)
      
            // Check that the component has the correct CSS class
            expect(readerElement.classes()).toContain('visual-novel-reader')
        })

        it('should render all child components in the layout', () => {
            // Check that all 4 main child components are present
            expect(wrapper.findComponent(BackgroundImage).exists()).toBe(true)
            expect(wrapper.findComponent(CharacterSprites).exists()).toBe(true)
            expect(wrapper.findComponent(TextBox).exists()).toBe(true)
            expect(wrapper.findComponent(NavigationControls).exists()).toBe(true)
        })
    })

    describe('State Synchronization', () => {
        it('should synchronize state across all components during navigation', async () => {
            const vm = wrapper.vm
      
            // Navigate through multiple steps
            vm.nextStep() // Step 1: Bob appears
            await wrapper.vm.$nextTick()
      
            // Check CharacterSprites has both characters
            const charactersComponent = wrapper.findComponent(CharacterSprites)
            const characters = charactersComponent.props('characters')
            expect(characters.left.id).toBe('alice')
            expect(characters.right.id).toBe('bob')
      
            // Check TextBox shows Bob's dialogue
            const textBoxComponent = wrapper.findComponent(TextBox)
            const textbox = textBoxComponent.props('textbox')
            expect(textbox.speaker).toBe('bob')
      
            vm.nextStep() // Step 2: Background changes, Alice becomes happy
            await wrapper.vm.$nextTick()
      
            // Check BackgroundImage has new background
            const backgroundComponent = wrapper.findComponent(BackgroundImage)
            expect(backgroundComponent.props('imageUrl')).toBe('/bg/garden.jpg')
      
            // Check CharacterSprites has updated Alice pose
            const updatedCharacters = charactersComponent.props('characters')
            expect(updatedCharacters.left.pose).toBe('happy')
      
            // Check TextBox shows Alice's new dialogue
            const updatedTextbox = textBoxComponent.props('textbox')
            expect(updatedTextbox.speaker).toBe('alice')
            expect(updatedTextbox.text).toBe("Let's go to the garden!")
        })

        it('should handle story completion state across components', async () => {
            const vm = wrapper.vm
      
            // Navigate to the end of the story
            vm.navigateToPosition(0, 0, 2) // Last step
            await wrapper.vm.$nextTick()
      
            vm.nextStep() // Complete the story
            await wrapper.vm.$nextTick()
      
            // Check NavigationControls receives completion state
            const navComponent = wrapper.findComponent(NavigationControls)
            expect(navComponent.props('canProceed')).toBe(false)
            expect(navComponent.props('isComplete')).toBe(true)
        })
    })

    describe('Error Handling', () => {
        it('should handle missing background gracefully', async () => {
            // Modify story to have missing background
            const storyWithMissingBg = {
                ...integrationStory,
                assets: {
                    ...integrationStory.assets,
                    backgrounds: {}
                }
            }
      
            await wrapper.setProps({ story: storyWithMissingBg })
      
            const backgroundComponent = wrapper.findComponent(BackgroundImage)
            expect(backgroundComponent.props('imageUrl')).toBeUndefined()
        })

        it('should handle missing character data gracefully', async () => {
            // Modify story to have missing character
            const storyWithMissingChar = {
                ...integrationStory,
                assets: {
                    ...integrationStory.assets,
                    characters: {}
                }
            }
      
            await wrapper.setProps({ story: storyWithMissingChar })
      
            const charactersComponent = wrapper.findComponent(CharacterSprites)
            expect(charactersComponent.props('story')).toEqual(storyWithMissingChar)
      
            // Component should still render without errors
            expect(charactersComponent.exists()).toBe(true)
        })
    })

    describe('Responsive Behavior', () => {
        it('should maintain component structure on different viewport sizes', () => {
            // This test would ideally use viewport manipulation
            // For now, we just verify the components are present
            expect(wrapper.findComponent(BackgroundImage).exists()).toBe(true)
            expect(wrapper.findComponent(CharacterSprites).exists()).toBe(true)
            expect(wrapper.findComponent(TextBox).exists()).toBe(true)
            expect(wrapper.findComponent(NavigationControls).exists()).toBe(true)
        })
    })
})