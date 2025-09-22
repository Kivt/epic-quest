import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import NavigationControls from '../NavigationControls.vue'

describe('NavigationControls', () => {
    let wrapper: any
  
    beforeEach(() => {
    // Mock global event listeners
        vi.spyOn(document, 'addEventListener')
        vi.spyOn(document, 'removeEventListener')
    })
  
    afterEach(() => {
        if (wrapper) {
            wrapper.unmount()
        }
        vi.restoreAllMocks()
    })

    describe('Component Rendering', () => {
        it('renders next button with correct text when can proceed', () => {
            wrapper = mount(NavigationControls, {
                props: {
                    canProceed: true
                }
            })

            const button = wrapper.find('.next-button')
            expect(button.exists()).toBe(true)
            expect(button.text()).toContain('Next')
            expect(button.attributes('disabled')).toBeUndefined()
            expect(button.classes()).not.toContain('disabled')
        })

        it('renders disabled button when cannot proceed', () => {
            wrapper = mount(NavigationControls, {
                props: {
                    canProceed: false
                }
            })

            const button = wrapper.find('.next-button')
            expect(button.exists()).toBe(true)
            expect(button.text()).toContain('End')
            expect(button.attributes('disabled')).toBeDefined()
            expect(button.classes()).toContain('disabled')
        })

        it('renders complete button when story is complete', () => {
            wrapper = mount(NavigationControls, {
                props: {
                    canProceed: false,
                    isComplete: true
                }
            })

            const button = wrapper.find('.next-button')
            expect(button.text()).toContain('Complete')
        })

        it('includes proper accessibility attributes', () => {
            wrapper = mount(NavigationControls, {
                props: {
                    canProceed: true
                }
            })

            const button = wrapper.find('.next-button')
            expect(button.attributes('aria-label')).toBe('Continue to next step')
            expect(button.attributes('type')).toBe('button')
            expect(button.attributes('tabindex')).toBe('0')
        })

        it('sets correct accessibility attributes when disabled', () => {
            wrapper = mount(NavigationControls, {
                props: {
                    canProceed: false
                }
            })

            const button = wrapper.find('.next-button')
            expect(button.attributes('aria-label')).toBe('No more content available')
            expect(button.attributes('tabindex')).toBe('-1')
        })
    })

    describe('Button Interactions', () => {
        it('emits next event when button is clicked and can proceed', async () => {
            wrapper = mount(NavigationControls, {
                props: {
                    canProceed: true
                }
            })

            const button = wrapper.find('.next-button')
            await button.trigger('click')

            expect(wrapper.emitted('next')).toHaveLength(1)
        })

        it('does not emit next event when button is clicked and cannot proceed', async () => {
            wrapper = mount(NavigationControls, {
                props: {
                    canProceed: false
                }
            })

            const button = wrapper.find('.next-button')
            await button.trigger('click')

            expect(wrapper.emitted('next')).toBeUndefined()
        })

        it('handles Enter key on button when can proceed', async () => {
            wrapper = mount(NavigationControls, {
                props: {
                    canProceed: true
                }
            })

            const button = wrapper.find('.next-button')
            await button.trigger('keydown', { key: 'Enter' })

            expect(wrapper.emitted('next')).toHaveLength(1)
        })

        it('does not handle Enter key on button when cannot proceed', async () => {
            wrapper = mount(NavigationControls, {
                props: {
                    canProceed: false
                }
            })

            const button = wrapper.find('.next-button')
            await button.trigger('keydown', { key: 'Enter' })

            expect(wrapper.emitted('next')).toBeUndefined()
        })
    })

    describe('Global Keyboard Support', () => {
        it('sets up global keyboard event listeners on mount', () => {
            wrapper = mount(NavigationControls, {
                props: {
                    canProceed: true
                }
            })

            expect(document.addEventListener).toHaveBeenCalledWith('keydown', expect.any(Function))
        })

        it('removes global keyboard event listeners on unmount', () => {
            wrapper = mount(NavigationControls, {
                props: {
                    canProceed: true
                }
            })

            wrapper.unmount()

            expect(document.removeEventListener).toHaveBeenCalledWith('keydown', expect.any(Function))
        })

        it('handles global spacebar key when can proceed', () => {
            wrapper = mount(NavigationControls, {
                props: {
                    canProceed: true
                }
            })

            // Simulate global keydown event
            const keydownEvent = new KeyboardEvent('keydown', { key: ' ' })
            Object.defineProperty(keydownEvent, 'preventDefault', {
                value: vi.fn(),
                writable: true
            })

            document.dispatchEvent(keydownEvent)

            expect(wrapper.emitted('next')).toHaveLength(1)
            expect(keydownEvent.preventDefault).toHaveBeenCalled()
        })

        it('handles global Enter key when can proceed', () => {
            wrapper = mount(NavigationControls, {
                props: {
                    canProceed: true
                }
            })

            // Simulate global keydown event
            const keydownEvent = new KeyboardEvent('keydown', { key: 'Enter' })
            Object.defineProperty(keydownEvent, 'preventDefault', {
                value: vi.fn(),
                writable: true
            })

            document.dispatchEvent(keydownEvent)

            expect(wrapper.emitted('next')).toHaveLength(1)
            expect(keydownEvent.preventDefault).toHaveBeenCalled()
        })

        it('does not handle global keys when cannot proceed', () => {
            wrapper = mount(NavigationControls, {
                props: {
                    canProceed: false
                }
            })

            // Simulate global keydown event
            const keydownEvent = new KeyboardEvent('keydown', { key: ' ' })
            document.dispatchEvent(keydownEvent)

            expect(wrapper.emitted('next')).toBeUndefined()
        })

        it('ignores global keys when user is typing in input', () => {
            wrapper = mount(NavigationControls, {
                props: {
                    canProceed: true
                }
            })

            // Mock active element as input
            const mockInput = document.createElement('input')
            vi.spyOn(document, 'activeElement', 'get').mockReturnValue(mockInput)

            const keydownEvent = new KeyboardEvent('keydown', { key: ' ' })
            document.dispatchEvent(keydownEvent)

            expect(wrapper.emitted('next')).toBeUndefined()
        })

        it('ignores global keys when user is typing in textarea', () => {
            wrapper = mount(NavigationControls, {
                props: {
                    canProceed: true
                }
            })

            // Mock active element as textarea
            const mockTextarea = document.createElement('textarea')
            vi.spyOn(document, 'activeElement', 'get').mockReturnValue(mockTextarea)

            const keydownEvent = new KeyboardEvent('keydown', { key: ' ' })
            document.dispatchEvent(keydownEvent)

            expect(wrapper.emitted('next')).toBeUndefined()
        })

        it('ignores global keys when user is in contenteditable element', () => {
            wrapper = mount(NavigationControls, {
                props: {
                    canProceed: true
                }
            })

            // Mock active element as contenteditable
            const mockDiv = document.createElement('div')
            mockDiv.setAttribute('contenteditable', 'true')
            vi.spyOn(document, 'activeElement', 'get').mockReturnValue(mockDiv)

            const keydownEvent = new KeyboardEvent('keydown', { key: ' ' })
            document.dispatchEvent(keydownEvent)

            expect(wrapper.emitted('next')).toBeUndefined()
        })
    })

    describe('Focus Management', () => {
        it('focuses and blurs button when global key is pressed', async () => {
            wrapper = mount(NavigationControls, {
                props: {
                    canProceed: true
                }
            })

            const button = wrapper.find('.next-button')
            const buttonElement = button.element as HTMLButtonElement
      
            // Mock focus and blur methods
            const focusSpy = vi.spyOn(buttonElement, 'focus')
            const blurSpy = vi.spyOn(buttonElement, 'blur')

            // Simulate global keydown event
            const keydownEvent = new KeyboardEvent('keydown', { key: ' ' })
            Object.defineProperty(keydownEvent, 'preventDefault', {
                value: vi.fn(),
                writable: true
            })

            document.dispatchEvent(keydownEvent)

            expect(focusSpy).toHaveBeenCalled()

            // Wait for the blur timeout
            await new Promise(resolve => setTimeout(resolve, 150))
            expect(blurSpy).toHaveBeenCalled()
        })
    })

    describe('Prop Reactivity', () => {
        it('updates button state when canProceed prop changes', async () => {
            wrapper = mount(NavigationControls, {
                props: {
                    canProceed: true
                }
            })

            let button = wrapper.find('.next-button')
            expect(button.text()).toContain('Next')
            expect(button.classes()).not.toContain('disabled')

            await wrapper.setProps({ canProceed: false })

            button = wrapper.find('.next-button')
            expect(button.text()).toContain('End')
            expect(button.classes()).toContain('disabled')
        })

        it('updates button text when isComplete prop changes', async () => {
            wrapper = mount(NavigationControls, {
                props: {
                    canProceed: false,
                    isComplete: false
                }
            })

            let button = wrapper.find('.next-button')
            expect(button.text()).toContain('End')

            await wrapper.setProps({ isComplete: true })

            button = wrapper.find('.next-button')
            expect(button.text()).toContain('Complete')
        })
    })

    describe('Accessibility Features', () => {
        it('has proper ARIA labels for different states', async () => {
            wrapper = mount(NavigationControls, {
                props: {
                    canProceed: true
                }
            })

            let button = wrapper.find('.next-button')
            expect(button.attributes('aria-label')).toBe('Continue to next step')

            await wrapper.setProps({ canProceed: false })

            button = wrapper.find('.next-button')
            expect(button.attributes('aria-label')).toBe('No more content available')
        })

        it('manages tabindex correctly based on state', async () => {
            wrapper = mount(NavigationControls, {
                props: {
                    canProceed: true
                }
            })

            let button = wrapper.find('.next-button')
            expect(button.attributes('tabindex')).toBe('0')

            await wrapper.setProps({ canProceed: false })

            button = wrapper.find('.next-button')
            expect(button.attributes('tabindex')).toBe('-1')
        })

        it('includes button icon with aria-hidden', () => {
            wrapper = mount(NavigationControls, {
                props: {
                    canProceed: true
                }
            })

            const icon = wrapper.find('.button-icon')
            expect(icon.exists()).toBe(true)
            expect(icon.attributes('aria-hidden')).toBe('true')
        })
    })

    describe('Component Structure', () => {
        it('has correct CSS classes and structure', () => {
            wrapper = mount(NavigationControls, {
                props: {
                    canProceed: true
                }
            })

            expect(wrapper.find('.navigation-controls').exists()).toBe(true)
            expect(wrapper.find('.next-button').exists()).toBe(true)
            expect(wrapper.find('.button-text').exists()).toBe(true)
            expect(wrapper.find('.button-icon').exists()).toBe(true)
        })

        it('applies disabled class when cannot proceed', () => {
            wrapper = mount(NavigationControls, {
                props: {
                    canProceed: false
                }
            })

            const button = wrapper.find('.next-button')
            expect(button.classes()).toContain('disabled')
        })
    })
})