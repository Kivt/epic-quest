import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import VisualNovelReader from '../VisualNovelReader.vue'
import { sampleStory } from '../../assets/story'

describe('VisualNovelReader with Sample Story', () => {
    it('should render correctly with the sample story', () => {
        const wrapper = mount(VisualNovelReader, {
            props: {
                story: sampleStory
            }
        })

        expect(wrapper.exists()).toBe(true)
    
        // Check that the component initializes with correct state
        const vm = wrapper.vm
        expect(vm.storyState.currentSceneIndex).toBe(0)
        expect(vm.storyState.currentSlideIndex).toBe(0)
        expect(vm.storyState.currentStepIndex).toBe(0)
        expect(vm.storyState.isComplete).toBe(false)
    
        // Check that it can compute the current slide state
        const slideState = vm.currentSlideState
        expect(slideState).toBeDefined()
        expect(slideState.characters).toBeDefined()
    })

    it('should be able to navigate through the sample story', () => {
        const wrapper = mount(VisualNovelReader, {
            props: {
                story: sampleStory
            }
        })

        const vm = wrapper.vm
    
        // Should be able to proceed initially
        expect(vm.canProceed).toBe(true)
    
        // Should be able to navigate to next step
        const initialStep = vm.storyState.currentStepIndex
        vm.nextStep()
    
        // State should have changed (either step index or slide/scene index)
        const hasProgressed = 
      vm.storyState.currentStepIndex !== initialStep ||
      vm.storyState.currentSlideIndex !== 0 ||
      vm.storyState.currentSceneIndex !== 0
    
        expect(hasProgressed).toBe(true)
    })

    it('should handle the sample story structure correctly', () => {
        const wrapper = mount(VisualNovelReader, {
            props: {
                story: sampleStory
            }
        })

        const vm = wrapper.vm
    
        // Check that we can access the first scene
        expect(vm.currentScene).toBeDefined()
        expect(vm.currentScene.id).toBe(sampleStory.scenes[0].id)
    
        // Check that we can access the first slide
        expect(vm.currentSlide).toBeDefined()
        expect(vm.currentSlide.id).toBe(sampleStory.scenes[0].slides[0].id)
    })
})