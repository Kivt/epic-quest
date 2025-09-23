<template>
  <div class="background-container">
    <transition
      :name="`background-${transition}`"
      mode="out-in"
      @enter="onEnter"
      @leave="onLeave"
    >
      <img
        :key="imageUrl || 'fallback'"
        :src="`../../public${displayImageUrl}`"
        :alt="imageAlt"
        class="background-image"
        :style="{ filter: blur > 0 ? `blur(${blur}px)` : 'none' }"
        @load="onImageLoad"
        @error="onImageError"
      />
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'

interface Props {
  imageUrl?: string
  transition?: 'fade' | 'cut' | 'slide' | 'flash'
  fallbackUrl?: string
  blur?: number
}

const props = withDefaults(defineProps<Props>(), {
    transition: 'fade',
    fallbackUrl: '/bg/default.svg',
    blur: 0
})

const emit = defineEmits<{
  imageLoaded: [url: string]
  imageError: [url: string]
  transitionComplete: []
}>()

const imageLoadError = ref(false)
const isLoading = ref(false)

const displayImageUrl = computed(() => {
    if (!props.imageUrl) {
        return props.fallbackUrl
    }
    return imageLoadError.value ? props.fallbackUrl : props.imageUrl
})

const imageAlt = computed(() => {
    if (!props.imageUrl) {
        return 'Default background'
    }
    return imageLoadError.value ? 'Fallback background' : 'Scene background'
})

// Reset error state when imageUrl changes
watch(() => props.imageUrl, () => {
    imageLoadError.value = false
    isLoading.value = true
})

const onImageLoad = (event: Event) => {
    const target = event.target as HTMLImageElement
    isLoading.value = false
    imageLoadError.value = false
    emit('imageLoaded', target.src)
}

const onImageError = (event: Event) => {
    const target = event.target as HTMLImageElement
    isLoading.value = false
  
    // Only set error if we're not already showing fallback
    if (target.src !== props.fallbackUrl) {
        imageLoadError.value = true
        emit('imageError', target.src)
    }
}

const onEnter = () => {
    // Animation enter hook - can be used for custom transition logic
}

const onLeave = (_el: Element, done: () => void) => {
    // Animation leave hook
    setTimeout(() => {
        done()
        emit('transitionComplete')
    }, 300) // Match CSS transition duration
}
</script>

<style scoped>
.background-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.background-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  display: block;
}

/* Fade transition */
.background-fade-enter-active,
.background-fade-leave-active {
  transition: opacity 0.3s ease-in-out;
}

.background-fade-enter-from {
  opacity: 0;
}

.background-fade-leave-to {
  opacity: 0;
}

/* Cut transition (instant) */
.background-cut-enter-active,
.background-cut-leave-active {
  transition: none;
}

/* Slide transition */
.background-slide-enter-active {
  transition: transform 0.5s ease-in-out;
}

.background-slide-leave-active {
  transition: transform 0.5s ease-in-out;
}

.background-slide-enter-from {
  transform: translateX(100%);
}

.background-slide-leave-to {
  transform: translateX(-100%);
}

/* Flash transition */
.background-flash-enter-active {
  animation: flash-in 0.2s ease-out;
}

.background-flash-leave-active {
  animation: flash-out 0.2s ease-out;
}

@keyframes flash-in {
  0% {
    opacity: 0;
    filter: brightness(3);
  }
  50% {
    opacity: 1;
    filter: brightness(2);
  }
  100% {
    opacity: 1;
    filter: brightness(1);
  }
}

@keyframes flash-out {
  0% {
    opacity: 1;
    filter: brightness(1);
  }
  100% {
    opacity: 0;
    filter: brightness(3);
  }
}

/* Responsive adjustments */
@media (max-width: 480px) {
  .background-image {
    /* Small mobile - ensure proper scaling */
    min-height: 100vh;
    min-height: 100dvh;
    min-width: 100vw;
    object-fit: cover;
    object-position: center center;
  }
}

@media (min-width: 481px) and (max-width: 768px) {
  .background-image {
    /* Large mobile - optimize for various aspect ratios */
    min-height: 100vh;
    min-height: 100dvh;
    min-width: 100vw;
    object-fit: cover;
    object-position: center center;
  }
}

@media (min-width: 769px) and (max-width: 1024px) {
  .background-image {
    /* Tablet optimizations */
    object-position: center center;
    /* Ensure crisp images on high DPI tablets */
    image-rendering: -webkit-optimize-contrast;
  }
}

@media (min-width: 1025px) {
  .background-image {
    /* Desktop optimizations */
    object-position: center center;
    /* Optimize for large displays */
    image-rendering: -webkit-optimize-contrast;
  }
}

/* Orientation-specific optimizations */
@media (orientation: landscape) and (max-height: 500px) {
  .background-image {
    /* Landscape mobile - adjust positioning */
    object-position: center 40%;
  }
}

@media (orientation: portrait) and (min-aspect-ratio: 9/16) {
  .background-image {
    /* Tall portrait screens */
    object-position: center 30%;
  }
}

/* High DPI display optimizations */
@media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
  .background-image {
    image-rendering: -webkit-optimize-contrast;
    image-rendering: crisp-edges;
  }
}
</style>