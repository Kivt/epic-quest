<template>
  <div class="visual-novel-reader">
    <!-- Background Layer -->
    <BackgroundImage
      :imageUrl="currentSlideState.background"
      :blur="currentSlideState.backgroundBlur || 0"
      :transition="backgroundTransition"
      @imageLoaded="onBackgroundLoaded"
      @imageError="onBackgroundError"
      @transitionComplete="onBackgroundTransitionComplete"
    />
    
    <!-- Character Sprites Layer -->
    <CharacterSprites
      :characters="currentSlideState.characters"
      :story="story"
    />
    
    <!-- Text Box Layer -->
    <TextBox
      :textbox="currentSlideState.textbox"
      :story="story"
      @showComplete="onTextBoxShowComplete"
      @hideComplete="onTextBoxHideComplete"
    >
      <template #action>
        <NavigationControls
          :canProceed="canProceed"
          :isComplete="storyState.isComplete"
          @next="nextStep"
        />
      </template>
    </TextBox>
    
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, watch } from 'vue'
import type { Story, SlideState } from '../types/story'
import { buildSlideState } from '../utils/stateManager'
import { saveStoryStateToUrl, loadStoryStateFromUrl, validateStoryState } from '../utils/storyStateManager'
import BackgroundImage from './BackgroundImage.vue'
import CharacterSprites from './CharacterSprites.vue'
import TextBox from './TextBox.vue'
import NavigationControls from './NavigationControls.vue'

interface Props {
  story: Story
}

const props = defineProps<Props>()

// Reactive state for current scene/slide/step indices
const storyState = reactive({
    currentSceneIndex: 0,
    currentSlideIndex: 0,
    currentStepIndex: 0,
    isComplete: false
})

// Initialize story state from URL on component mount
onMounted(() => {
    const savedState = loadStoryStateFromUrl()
    if (savedState) {
    // Validate the loaded state against the story structure
        const storyLength = {
            scenes: props.story.scenes.length,
            slides: props.story.scenes.map(scene => scene.slides.length),
            steps: props.story.scenes.map(scene => 
                scene.slides.map(slide => slide.steps.length)
            )
        }
    
        const validatedState = validateStoryState(savedState, storyLength)
    
        // Apply the validated state
        Object.assign(storyState, validatedState)
    }
})

// Watch for changes in story state and save to URL
watch(
    () => ({ ...storyState }),
    (newState) => {
        saveStoryStateToUrl(newState)
    },
    { deep: true }
)

// Computed properties for current slide state
const currentScene = computed(() => {
    return props.story.scenes[storyState.currentSceneIndex]
})

const currentSlide = computed(() => {
    return currentScene.value?.slides[storyState.currentSlideIndex]
})

const currentSlideState = computed((): SlideState => {
    if (!currentScene.value || !currentSlide.value) {
        return { characters: {} }
    }
  
    return buildSlideState(
        props.story,
        storyState.currentSceneIndex,
        storyState.currentSlideIndex,
        storyState.currentStepIndex
    )
})

const canProceed = computed(() => {
    if (!currentSlide.value || storyState.isComplete) return false
  
    // Check if there are more steps in current slide
    if (storyState.currentStepIndex < currentSlide.value.steps.length - 1) {
        return true
    }
  
    // Check if there are more slides in current scene
    if (storyState.currentSlideIndex < currentScene.value.slides.length - 1) {
        return true
    }
  
    // Check if there are more scenes
    if (storyState.currentSceneIndex < props.story.scenes.length - 1) {
        return true
    }
  
    return false
})

const isAtLastStep = computed(() => {
    if (!currentSlide.value) return false
  
    // Check if we're at the last step of the last slide of the last scene
    const isLastScene = storyState.currentSceneIndex === props.story.scenes.length - 1
    const isLastSlide = storyState.currentSlideIndex === currentScene.value.slides.length - 1
    const isLastStepInSlide = storyState.currentStepIndex === currentSlide.value.steps.length - 1
  
    return isLastScene && isLastSlide && isLastStepInSlide
})

// Navigation methods with enhanced state management
const nextStep = () => {
    if (storyState.isComplete) return
  
    // Check if we're at the last step - if so, mark as complete
    if (isAtLastStep.value) {
        storyState.isComplete = true
        return
    }
  
    if (!canProceed.value) return
  
    // Check if there are more steps in current slide
    if (storyState.currentStepIndex < currentSlide.value.steps.length - 1) {
        storyState.currentStepIndex++
        return
    }
  
    // Move to next slide or scene
    navigateToNext()
}

const navigateToNext = () => {
    if (storyState.isComplete) return
  
    const currentSlideData = currentSlide.value
  
    // Handle explicit next navigation from slide configuration
    if (currentSlideData?.next) {
        const nextConfig = currentSlideData.next
    
        // Navigate to specific scene and slide
        if (nextConfig.scene) {
            const targetSceneIndex = props.story.scenes.findIndex(scene => scene.id === nextConfig.scene)
            if (targetSceneIndex !== -1) {
                storyState.currentSceneIndex = targetSceneIndex
                storyState.currentSlideIndex = 0
                storyState.currentStepIndex = 0
        
                // If specific slide is also specified
                if (nextConfig.slide) {
                    const targetScene = props.story.scenes[targetSceneIndex]
                    const targetSlideIndex = targetScene.slides.findIndex(slide => slide.id === nextConfig.slide)
                    if (targetSlideIndex !== -1) {
                        storyState.currentSlideIndex = targetSlideIndex
                    }
                }
                return
            }
        }
    
        // Navigate to specific slide in current scene
        if (nextConfig.slide) {
            const targetSlideIndex = currentScene.value.slides.findIndex(slide => slide.id === nextConfig.slide)
            if (targetSlideIndex !== -1) {
                storyState.currentSlideIndex = targetSlideIndex
                storyState.currentStepIndex = 0
                return
            }
        }
    }
  
    // Default sequential navigation
    // Check if there are more slides in current scene
    if (storyState.currentSlideIndex < currentScene.value.slides.length - 1) {
        storyState.currentSlideIndex++
        storyState.currentStepIndex = 0
        return
    }
  
    // Check if there are more scenes
    if (storyState.currentSceneIndex < props.story.scenes.length - 1) {
        storyState.currentSceneIndex++
        storyState.currentSlideIndex = 0
        storyState.currentStepIndex = 0
        return
    }
  
    // Story is complete
    storyState.isComplete = true
}

// Method to reset story to beginning
const resetStory = () => {
    storyState.currentSceneIndex = 0
    storyState.currentSlideIndex = 0
    storyState.currentStepIndex = 0
    storyState.isComplete = false
    // The watcher will automatically clear URL params when state resets
}

// Method to navigate to specific position
const navigateToPosition = (sceneIndex: number, slideIndex: number = 0, stepIndex: number = 0) => {
    if (sceneIndex >= 0 && sceneIndex < props.story.scenes.length) {
        const scene = props.story.scenes[sceneIndex]
        if (slideIndex >= 0 && slideIndex < scene.slides.length) {
            const slide = scene.slides[slideIndex]
            // Allow stepIndex to be within the valid range (0 to steps.length - 1)
            if (stepIndex >= 0 && stepIndex <= slide.steps.length - 1) {
                storyState.currentSceneIndex = sceneIndex
                storyState.currentSlideIndex = slideIndex
                storyState.currentStepIndex = stepIndex
                storyState.isComplete = false
            }
        }
    }
}



// Background transition state
const backgroundTransition = ref<'fade' | 'cut' | 'slide' | 'flash'>('fade')

// Event handlers for child components
const onBackgroundLoaded = (url: string) => {
    console.log('Background loaded:', url)
}

const onBackgroundError = (url: string) => {
    console.error('Background failed to load:', url)
}

const onBackgroundTransitionComplete = () => {
    console.log('Background transition complete')
}

const onTextBoxShowComplete = () => {
    console.log('Text box show animation complete')
}

// Expose functions for testing
defineExpose({
    storyState,
    currentScene,
    currentSlide,
    currentSlideState,
    canProceed,
    nextStep,
    resetStory,
    navigateToPosition
})

const onTextBoxHideComplete = () => {
    console.log('Text box hide animation complete')
}
</script>

<style scoped>
.visual-novel-reader {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: #000;
  display: flex;
  flex-direction: column;
}

/* Layer z-index management:
   1. Background (z-index: 1)
   2. Characters (z-index: 2) 
   3. Text Box (z-index: 10)
   4. Navigation (z-index: 20)
*/

/* Responsive design */
@media (max-width: 480px) {
  .visual-novel-reader {
    /* Small mobile optimizations */
    min-height: 100vh;
    min-height: 100dvh; /* Dynamic viewport height for mobile browsers */
    /* Ensure touch interactions work properly */
    touch-action: manipulation;
  }
}

@media (min-width: 481px) and (max-width: 768px) {
  .visual-novel-reader {
    /* Large mobile/small tablet optimizations */
    min-height: 100vh;
    min-height: 100dvh;
    /* Optimize for landscape mobile */
    max-height: 100vh;
    max-height: 100dvh;
  }
}

@media (min-width: 769px) and (max-width: 1024px) {
  .visual-novel-reader {
    /* Tablet optimizations */
    /* Ensure proper aspect ratio handling */
    aspect-ratio: auto;
  }
}

@media (min-width: 1025px) {
  .visual-novel-reader {
    /* Desktop optimizations */
    /* Optimize for larger screens */
    max-width: 100vw;
    max-height: 100vh;
  }
}

/* Orientation-specific optimizations */
@media (orientation: landscape) and (max-height: 500px) {
  .visual-novel-reader {
    /* Landscape mobile optimization */
    height: 100vh;
    height: 100dvh;
  }
}

@media (orientation: portrait) and (max-width: 768px) {
  .visual-novel-reader {
    /* Portrait mobile optimization */
    min-height: 100vh;
    min-height: 100dvh;
  }
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  .visual-novel-reader {
    background: #000000;
  }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  .visual-novel-reader * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
</style>