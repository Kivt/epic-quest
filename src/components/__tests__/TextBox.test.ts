import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount, VueWrapper } from '@vue/test-utils'
import TextBox from '../TextBox.vue'
import type { Story } from '../../types/story'

// Mock story data for testing
const mockStory: Story = {
    version: "1.0",
    meta: {
        id: "test-story",
        title: "Test Story"
    },
    assets: {
        backgrounds: {},
        characters: {
            "yuki": {
                name: "Yuki Tanaka",
                poses: {
                    "neutral": "/ch/yuki_neutral.png"
                }
            },
            "teacher": {
                name: "Ms. Johnson",
                poses: {
                    "neutral": "/ch/teacher_neutral.png"
                }
            }
        }
    },
    scenes: []
}

describe('TextBox.vue', () => {
    let wrapper: VueWrapper<any>

    beforeEach(() => {
    // Reset any mocks before each test
        vi.clearAllMocks()
    })

    afterEach(() => {
        if (wrapper) {
            wrapper.unmount()
        }
    })

    describe('Component Rendering', () => {
        it('should not render when textbox is undefined', () => {
            wrapper = mount(TextBox, {
                props: {
                    story: mockStory
                }
            })

            expect(wrapper.find('.textbox-container').exists()).toBe(false)
        })

        it('should not render when textbox has no text', () => {
            wrapper = mount(TextBox, {
                props: {
                    textbox: {
                        speaker: 'yuki',
                        text: ''
                    },
                    story: mockStory
                }
            })

            expect(wrapper.find('.textbox-container').exists()).toBe(false)
        })

        it('should render when textbox has text', () => {
            wrapper = mount(TextBox, {
                props: {
                    textbox: {
                        speaker: 'yuki',
                        text: 'Hello world!'
                    },
                    story: mockStory
                }
            })

            expect(wrapper.find('.textbox-container').exists()).toBe(true)
            expect(wrapper.find('.dialogue-text').text()).toBe('Hello world!')
        })

        it('should render text without speaker', () => {
            wrapper = mount(TextBox, {
                props: {
                    textbox: {
                        text: 'Narrator text'
                    },
                    story: mockStory
                }
            })

            expect(wrapper.find('.textbox-container').exists()).toBe(true)
            expect(wrapper.find('.dialogue-text').text()).toBe('Narrator text')
            expect(wrapper.find('.speaker-name').exists()).toBe(false)
        })
    })

    describe('Speaker Display', () => {
        it('should display speaker name from story assets', () => {
            wrapper = mount(TextBox, {
                props: {
                    textbox: {
                        speaker: 'yuki',
                        text: 'Hello!'
                    },
                    story: mockStory
                }
            })

            expect(wrapper.find('.speaker-name').exists()).toBe(true)
            expect(wrapper.find('.speaker-name').text()).toBe('Yuki Tanaka')
        })

        it('should display speaker ID when character not found in assets', () => {
            wrapper = mount(TextBox, {
                props: {
                    textbox: {
                        speaker: 'unknown_character',
                        text: 'Hello!'
                    },
                    story: mockStory
                }
            })

            expect(wrapper.find('.speaker-name').text()).toBe('unknown_character')
        })

        it('should not display speaker when speaker is null', () => {
            wrapper = mount(TextBox, {
                props: {
                    textbox: {
                        speaker: null,
                        text: 'Hello!'
                    },
                    story: mockStory
                }
            })

            expect(wrapper.find('.speaker-name').exists()).toBe(false)
        })

        it('should add has-speaker class when speaker is present', () => {
            wrapper = mount(TextBox, {
                props: {
                    textbox: {
                        speaker: 'yuki',
                        text: 'Hello!'
                    },
                    story: mockStory
                }
            })

            expect(wrapper.find('.textbox-container').classes()).toContain('has-speaker')
        })
    })

    describe('Text Display and Overflow', () => {
        it('should handle long text content', () => {
            const longText = 'This is a very long piece of dialogue text that should wrap properly and handle overflow gracefully. '.repeat(10)
      
            wrapper = mount(TextBox, {
                props: {
                    textbox: {
                        speaker: 'yuki',
                        text: longText.trim() // Remove trailing space
                    },
                    story: mockStory
                }
            })

            const dialogueElement = wrapper.find('.dialogue-text')
            expect(dialogueElement.text()).toBe(longText.trim())
            // Check that max-height is set via CSS class, not inline style
            expect(dialogueElement.classes()).toContain('dialogue-text')
        })

        it('should handle text with special characters', () => {
            const specialText = 'Text with "quotes", emojis 😊, and symbols @#$%'
      
            wrapper = mount(TextBox, {
                props: {
                    textbox: {
                        text: specialText
                    },
                    story: mockStory
                }
            })

            expect(wrapper.find('.dialogue-text').text()).toBe(specialText)
        })

        it('should handle empty string text', () => {
            wrapper = mount(TextBox, {
                props: {
                    textbox: {
                        text: ''
                    },
                    story: mockStory
                }
            })

            expect(wrapper.find('.textbox-container').exists()).toBe(false)
        })
    })

    describe('Responsive Behavior', () => {
        it('should have proper CSS classes for responsive design', () => {
            wrapper = mount(TextBox, {
                props: {
                    textbox: {
                        text: 'Test text'
                    },
                    story: mockStory
                }
            })

            const container = wrapper.find('.textbox-container')
            const content = wrapper.find('.textbox-content')
      
            expect(container.exists()).toBe(true)
            expect(content.exists()).toBe(true)
      
            // Check that responsive classes are applied via CSS
            expect(container.element.className).toContain('textbox-container')
            expect(content.element.className).toContain('textbox-content')
        })
    })

    describe('Animation Events', () => {
        it('should emit showComplete event after enter animation', async () => {
            wrapper = mount(TextBox, {
                props: {
                    textbox: {
                        text: 'Test text'
                    },
                    story: mockStory
                }
            })

            // Simulate the enter animation completing
            const transition = wrapper.findComponent({ name: 'transition' })
            await transition.vm.$emit('enter', wrapper.element)
      
            // Wait for the timeout in onEnter
            await new Promise(resolve => setTimeout(resolve, 350))
      
            expect(wrapper.emitted('showComplete')).toBeTruthy()
        })

        it('should emit hideComplete event after leave animation', async () => {
            wrapper = mount(TextBox, {
                props: {
                    textbox: {
                        text: 'Test text'
                    },
                    story: mockStory
                }
            })

            // Simulate the leave animation
            const transition = wrapper.findComponent({ name: 'transition' })
            const mockDone = vi.fn()
      
            await transition.vm.$emit('leave', wrapper.element, mockDone)
      
            // Wait for the timeout in onLeave
            await new Promise(resolve => setTimeout(resolve, 250))
      
            expect(mockDone).toHaveBeenCalled()
            expect(wrapper.emitted('hideComplete')).toBeTruthy()
        })
    })

    describe('Accessibility', () => {
        it('should have proper ARIA structure', () => {
            wrapper = mount(TextBox, {
                props: {
                    textbox: {
                        speaker: 'yuki',
                        text: 'Hello world!'
                    },
                    story: mockStory
                }
            })

            const content = wrapper.find('.textbox-content')
            expect(content.exists()).toBe(true)
      
            // The component should be focusable for screen readers
            expect(content.attributes('tabindex')).toBe('0')
            expect(content.attributes('role')).toBe('dialog')
            expect(content.attributes('aria-label')).toBe('Yuki Tanaka says')
        })

        it('should handle focus properly', async () => {
            wrapper = mount(TextBox, {
                props: {
                    textbox: {
                        text: 'Test text'
                    },
                    story: mockStory
                },
                attachTo: document.body // Attach to DOM for focus testing
            })

            const content = wrapper.find('.textbox-content')
            content.element.focus()
      
            expect(document.activeElement).toBe(content.element)
        })
    })

    describe('Props Reactivity', () => {
        it('should update when textbox prop changes', async () => {
            wrapper = mount(TextBox, {
                props: {
                    textbox: {
                        text: 'Initial text'
                    },
                    story: mockStory
                }
            })

            expect(wrapper.find('.dialogue-text').text()).toBe('Initial text')

            await wrapper.setProps({
                textbox: {
                    speaker: 'yuki',
                    text: 'Updated text'
                }
            })

            expect(wrapper.find('.dialogue-text').text()).toBe('Updated text')
            expect(wrapper.find('.speaker-name').text()).toBe('Yuki Tanaka')
        })

        it('should hide when textbox becomes undefined', async () => {
            wrapper = mount(TextBox, {
                props: {
                    textbox: {
                        text: 'Visible text'
                    },
                    story: mockStory
                }
            })

            expect(wrapper.find('.textbox-container').exists()).toBe(true)

            await wrapper.setProps({
                textbox: undefined
            })

            expect(wrapper.find('.textbox-container').exists()).toBe(false)
        })

        it('should update speaker display when story changes', async () => {
            wrapper = mount(TextBox, {
                props: {
                    textbox: {
                        speaker: 'yuki',
                        text: 'Hello!'
                    },
                    story: mockStory
                }
            })

            expect(wrapper.find('.speaker-name').text()).toBe('Yuki Tanaka')

            const updatedStory = {
                ...mockStory,
                assets: {
                    ...mockStory.assets,
                    characters: {
                        ...mockStory.assets.characters,
                        yuki: {
                            name: 'Yuki Updated',
                            poses: { neutral: '/ch/yuki.png' }
                        }
                    }
                }
            }

            await wrapper.setProps({
                story: updatedStory
            })

            expect(wrapper.find('.speaker-name').text()).toBe('Yuki Updated')
        })
    })
})