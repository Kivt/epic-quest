// Utility functions for saving and loading story state via URL query parameters

export interface StoryState {
  currentSceneIndex: number
  currentSlideIndex: number
  currentStepIndex: number
  isComplete: boolean
}

/**
 * Save story state to URL query parameters
 */
export function saveStoryStateToUrl(storyState: StoryState): void {
    const url = new URL(window.location.href)
  
    // Only save if not at the beginning of the story
    if (storyState.currentSceneIndex === 0 && 
      storyState.currentSlideIndex === 0 && 
      storyState.currentStepIndex === 0 && 
      !storyState.isComplete) {
    // Remove query params if at beginning
        url.searchParams.delete('scene')
        url.searchParams.delete('slide')
        url.searchParams.delete('step')
        url.searchParams.delete('complete')
    } else {
    // Save current state
        url.searchParams.set('scene', storyState.currentSceneIndex.toString())
        url.searchParams.set('slide', storyState.currentSlideIndex.toString())
        url.searchParams.set('step', storyState.currentStepIndex.toString())
    
        if (storyState.isComplete) {
            url.searchParams.set('complete', '1')
        } else {
            url.searchParams.delete('complete')
        }
    }
  
    // Update URL without triggering page reload
    window.history.replaceState({}, '', url.toString())
}

/**
 * Load story state from URL query parameters
 */
export function loadStoryStateFromUrl(): Partial<StoryState> | null {
    const url = new URL(window.location.href)
  
    const scene = url.searchParams.get('scene')
    const slide = url.searchParams.get('slide')
    const step = url.searchParams.get('step')
    const complete = url.searchParams.get('complete')
  
    // If no query params, return null (start from beginning)
    if (!scene && !slide && !step && !complete) {
        return null
    }
  
    return {
        currentSceneIndex: scene ? parseInt(scene, 10) : 0,
        currentSlideIndex: slide ? parseInt(slide, 10) : 0,
        currentStepIndex: step ? parseInt(step, 10) : 0,
        isComplete: complete === '1'
    }
}

/**
 * Validate that the loaded state is valid for the given story
 */
export function validateStoryState(
    storyState: Partial<StoryState>, 
    storyLength: { scenes: number; slides?: number[]; steps?: number[][] }
): StoryState {
    const sceneIndex = Math.max(0, Math.min(storyState.currentSceneIndex || 0, storyLength.scenes - 1))
  
    let slideIndex = 0
    let stepIndex = 0
  
    if (storyLength.slides && storyLength.slides[sceneIndex] !== undefined) {
        slideIndex = Math.max(0, Math.min(storyState.currentSlideIndex || 0, storyLength.slides[sceneIndex] - 1))
    }
  
    if (storyLength.steps && 
      storyLength.steps[sceneIndex] && 
      storyLength.steps[sceneIndex][slideIndex] !== undefined) {
        stepIndex = Math.max(0, Math.min(storyState.currentStepIndex || 0, storyLength.steps[sceneIndex][slideIndex] - 1))
    }
  
    return {
        currentSceneIndex: sceneIndex,
        currentSlideIndex: slideIndex,
        currentStepIndex: stepIndex,
        isComplete: storyState.isComplete || false
    }
}