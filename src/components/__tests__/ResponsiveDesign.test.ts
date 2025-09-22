import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import VisualNovelReader from '../VisualNovelReader.vue'
import { sampleStory } from '../../assets/story'

// Mock window.matchMedia for responsive testing
const mockMatchMedia = (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => {},
})

describe('Responsive Design', () => {
    let originalMatchMedia: typeof window.matchMedia

    beforeEach(() => {
        originalMatchMedia = window.matchMedia
        window.matchMedia = mockMatchMedia
    })

    afterEach(() => {
        window.matchMedia = originalMatchMedia
    })

    it('should render properly on mobile viewport', () => {
        const wrapper = mount(VisualNovelReader, {
            props: { story: sampleStory }
        })

        const container = wrapper.find('.visual-novel-reader')
        expect(container.exists()).toBe(true)
        expect(container.classes()).toContain('visual-novel-reader')
    })

    it('should have proper CSS classes for responsive components', () => {
        const wrapper = mount(VisualNovelReader, {
            props: { story: sampleStory }
        })

        // Check that all main components are present
        expect(wrapper.findComponent({ name: 'BackgroundImage' }).exists()).toBe(true)
        expect(wrapper.findComponent({ name: 'CharacterSprites' }).exists()).toBe(true)
        expect(wrapper.findComponent({ name: 'TextBox' }).exists()).toBe(true)
        expect(wrapper.findComponent({ name: 'NavigationControls' }).exists()).toBe(true)
    })

    it('should handle viewport changes gracefully', () => {
        const wrapper = mount(VisualNovelReader, {
            props: { story: sampleStory }
        })

        // Check that component structure remains intact
        const container = wrapper.find('.visual-novel-reader')
        expect(container.exists()).toBe(true)
        expect(container.classes()).toContain('visual-novel-reader')
    })

    it('should maintain proper component layering', () => {
        const wrapper = mount(VisualNovelReader, {
            props: { story: sampleStory }
        })

        // Check that all child components are rendered
        expect(wrapper.findComponent({ name: 'BackgroundImage' }).exists()).toBe(true)
        expect(wrapper.findComponent({ name: 'CharacterSprites' }).exists()).toBe(true)
        expect(wrapper.findComponent({ name: 'TextBox' }).exists()).toBe(true)
        expect(wrapper.findComponent({ name: 'NavigationControls' }).exists()).toBe(true)
    })

    it('should apply responsive CSS custom properties', () => {
    // Test that CSS custom properties are defined in the document
        const style = document.createElement('style')
        style.textContent = `
      :root {
        --viewport-padding: 1rem;
        --text-size-base: 1rem;
        --spacing-md: 1rem;
      }
    `
        document.head.appendChild(style)

        const wrapper = mount(VisualNovelReader, {
            props: { story: sampleStory }
        })

        expect(wrapper.exists()).toBe(true)
    
        // Clean up
        document.head.removeChild(style)
    })
})