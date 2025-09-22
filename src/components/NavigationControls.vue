<template>
  <div class="navigation-controls">
    <button
      ref="nextButton"
      class="next-button"
      :class="{ 'disabled': !canProceed }"
      :disabled="!canProceed"
      @click="handleNext"
      @keydown="handleKeydown"
      type="button"
      :aria-label="canProceed ? 'Continue to next step' : 'No more content available'"
      :tabindex="canProceed ? 0 : -1"
    >
      <span class="button-icon" aria-hidden="true">▶</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

interface Props {
  canProceed: boolean
  isComplete?: boolean
}

const props = withDefaults(defineProps<Props>(), {
    isComplete: false
})

const emit = defineEmits<{
  next: []
}>()

const nextButton = ref<HTMLButtonElement>()

const handleNext = () => {
    if (props.canProceed) {
        emit('next')
    }
}

const handleKeydown = (event: KeyboardEvent) => {
    // Handle Enter key on the button itself
    if (event.key === 'Enter' && props.canProceed) {
        event.preventDefault()
        handleNext()
    }
}

const handleGlobalKeydown = (event: KeyboardEvent) => {
    // Handle spacebar and Enter key globally
    if ((event.key === ' ' || event.key === 'Enter') && props.canProceed) {
    // Prevent if user is typing in an input or textarea
        const activeElement = document.activeElement
        if (activeElement && (
            activeElement.tagName === 'INPUT' ||
      activeElement.tagName === 'TEXTAREA' ||
      activeElement.getAttribute('contenteditable') === 'true'
        )) {
            return
        }
    
        event.preventDefault()
        handleNext()
    
        // Focus the button briefly to show interaction
        if (nextButton.value) {
            nextButton.value.focus()
            setTimeout(() => {
                nextButton.value?.blur()
            }, 100)
        }
    }
}

onMounted(() => {
    document.addEventListener('keydown', handleGlobalKeydown)
})

onUnmounted(() => {
    document.removeEventListener('keydown', handleGlobalKeydown)
})
</script>

<style scoped>
.navigation-controls {
  position: absolute;
  bottom: 0.5rem;
  right: 0.5rem;
  z-index: 20;
  pointer-events: none;
}

.next-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  height: 48px; /* Minimum touch target size */
  width: 48px;
  border: 1px solid rgba(255, 255, 255, 0.25);
  background: transparent;
  color: white;
  border-radius: 2rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  pointer-events: auto;
  justify-content: center;
}

.next-button:hover:not(.disabled) {
  background: rgba(255, 255, 255, 0.15);;
  box-shadow: 0 6px 16px rgba(255, 255, 255, 0.15);
}

.next-button:active:not(.disabled) {
  box-shadow: 0 2px 8px rgba(255, 255, 255, 0.15);
}

.next-button:focus-visible {
  outline: 2px solid #ffffff;
  outline-offset: 2px;
}

.next-button.disabled {
  background: linear-gradient(135deg, #666666 0%, #444444 100%);
  cursor: not-allowed;
  opacity: 0.6;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
}

.button-text {
  font-size: 0.95rem;
  letter-spacing: 0.02em;
}

.button-icon {
  font-size: 0.8rem;
}

/* Responsive design */
@media (max-width: 480px) {
  .next-button {
    font-size: 1.05rem;
    border-radius: 1.5rem;
    /* Improve touch responsiveness */
    touch-action: manipulation;
    -webkit-tap-highlight-color: transparent;
  }
  
  .button-text {
    font-size: 1rem;
  }
  
  .button-icon {
    font-size: 0.9rem;
  }
}

@media (min-width: 481px) and (max-width: 768px) {
  .navigation-controls {
    display: flex;
    justify-content: center;
  }
  
  .next-button {
    font-size: 1.1rem;
    border-radius: 1.5rem;
    touch-action: manipulation;
  }
  
  .button-text {
    font-size: 1rem;
  }
  
  .button-icon {
    font-size: 0.9rem;
  }
}

@media (min-width: 769px) and (max-width: 1024px) {
  .next-button {
    font-size: 1rem;
  }
}

@media (min-width: 1025px) {
  .next-button {
    font-size: 1.05rem;
  }
}

/* Ultra-wide screen optimizations */
@media (min-width: 1440px) {
  .next-button {
    font-size: 1.1rem;
  }
}

/* Orientation-specific optimizations */
@media (orientation: landscape) and (max-height: 500px) {
  .next-button {
    font-size: 0.95rem;
  }
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  .next-button {
    background: #000000;
    border: 2px solid #ffffff;
    color: #ffffff;
  }
  
  .next-button:hover:not(.disabled) {
    background: #333333;
  }
  
  .next-button.disabled {
    background: #666666;
    border-color: #999999;
    color: #cccccc;
  }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  .next-button {
    transition: none;
  }
  
  .next-button:hover:not(.disabled) {
    transform: none;
  }
  
  .next-button:active:not(.disabled) {
    transform: none;
  }
  
  .button-icon {
    transition: none;
  }
  
  .next-button:hover:not(.disabled) .button-icon {
    transform: none;
  }
}

/* Touch device optimizations */
@media (hover: none) and (pointer: coarse) {
  .next-button {
    /* Improve touch feedback */
    transition: all 0.15s ease;
  }
  
  .next-button:hover:not(.disabled) {
    transform: none;
  }
}

/* Fine pointer devices (mouse) */
@media (hover: hover) and (pointer: fine) {
  .next-button {
    /* Enhanced hover effects for precise pointing devices */
    transition: all 0.2s ease;
  }
}

/* Focus management for keyboard navigation */
.next-button:focus {
  outline: none;
}

.next-button:focus-visible {
  outline: 2px solid #ffffff;
  outline-offset: 3px;
}

/* Animation for button state changes */
.next-button {
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Pulse animation for attention when story is complete */
.next-button.disabled {
  animation: none;
}

/* Screen reader only text for additional context */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
</style>