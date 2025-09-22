<template>
  <transition name="textbox" @enter="onEnter" @leave="onLeave">
    <div
      v-if="textbox && textbox.text"
      class="textbox-container"
      :class="{ 'has-speaker': textbox.speaker }"
    >
      <!-- <div class="textbox-backdrop"></div> -->
      <div
        class="textbox-content"
        tabindex="0"
        role="dialog"
        :aria-label="
          textbox.speaker ? `${speakerDisplayName} says` : 'Dialogue'
        "
      >
        <div
          v-if="textbox.speaker"
          class="speaker-name"
          :style="{ color: speakerColor }"
        >
          {{ speakerDisplayName }}
        </div>
        <div class="dialogue-text">
          {{ textbox.text }}
        </div>

        <slot name="action"></slot>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { Story } from "../types/story";

interface Props {
  textbox?: {
    speaker?: string | null;
    text?: string;
  };
  story: Story;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  showComplete: [];
  hideComplete: [];
}>();

const speakerDisplayName = computed(() => {
    const speakerId = props.textbox?.speaker;
    if (!speakerId) return "";

    // Look up character name from story assets
    const character = props.story.assets.characters[speakerId];
    return character?.name || speakerId;
});

const speakerColor = computed(() => {
    const speakerId = props.textbox?.speaker;
    if (!speakerId) return "#e0e0ff"; // default color

    // Look up character color from story assets
    const character = props.story.assets.characters[speakerId];
    return character?.speaker_color || "#e0e0ff"; // fallback to default color
});

const onEnter = () => {
    // Animation enter hook
    setTimeout(() => {
        emit("showComplete");
    }, 300); // Match CSS transition duration
};

const onLeave = (_el: Element, done: () => void) => {
    // Animation leave hook
    setTimeout(() => {
        done();
        emit("hideComplete");
    }, 200); // Slightly faster hide animation
};
</script>

<style scoped>
.textbox-container {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 10;
  padding: 1rem;
  pointer-events: none;
}

.textbox-backdrop {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    to top,
    rgba(0, 0, 0, 0.8) 0%,
    rgba(0, 0, 0, 0.6) 70%,
    transparent 100%
  );
  backdrop-filter: blur(2px);
  border-radius: 0.5rem 0.5rem 0 0;
}

.textbox-content {
  position: relative;
  background: rgba(20, 20, 30, 0.85);
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 0.75rem;
  padding: 1.5rem 1.5rem 1rem 1.5rem;
  padding-right: 4rem !important;
  margin: 0 auto;
  max-width: 90%;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
  pointer-events: auto;
}

.has-speaker .textbox-content {
  padding-top: 2rem;
}

.speaker-name {
  font-size: 0.9rem;
  font-weight: 600;
  color: #e0e0ff;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  position: absolute;
  top: 0;
  left: 1.5rem;
  padding: 0.5rem 1rem;
  background: rgba(20, 20, 30, 0.95);
  border: 2px solid rgba(255, 255, 255, 0.2);
  transform: translateY(-50%);
  border-radius: 1rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}

.dialogue-text {
  font-size: 1.1rem;
  line-height: 1.6;
  color: #ffffff;
  word-wrap: break-word;
  overflow-wrap: break-word;
  hyphens: auto;
}

/* Show/hide animations */
.textbox-enter-active {
  transition: all 0.3s ease-out;
}

.textbox-leave-active {
  transition: all 0.2s ease-in;
}

.textbox-enter-from {
  opacity: 0;
  transform: translateY(100%);
}

.textbox-leave-to {
  opacity: 0;
  transform: translateY(50%);
}

/* Responsive design */
@media (max-width: 480px) {
  .textbox-container {
    padding: var(--viewport-padding);
    /* Adjust for small screens */
    bottom: 0;
  }

  .textbox-content {
    max-width: 98%;
    padding: 0.875rem 1rem;
    border-radius: var(--border-radius-base);
    font-size: var(--text-size-small);
  }

  .has-speaker .textbox-content {
    padding-top: 1.5rem;
  }

  .speaker-name {
    font-size: 0.75rem;
    left: 1rem;
    padding: 0.375rem 0.75rem;
  }

  .dialogue-text {
    font-size: 0.95rem;
    line-height: 1.4;
    max-height: 35vh;
  }
}

@media (min-width: 481px) and (max-width: 768px) {
  .textbox-container {
    padding: var(--viewport-padding);
  }

  .textbox-content {
    max-width: 95%;
    padding: 1rem 1.25rem;
    border-radius: var(--border-radius-base);
  }

  .has-speaker .textbox-content {
    padding-top: 1.75rem;
  }

  .speaker-name {
    font-size: 0.8rem;
    left: 1.25rem;
    padding: 0.4rem 0.875rem;
  }

  .dialogue-text {
    font-size: var(--text-size-base);
    line-height: 1.5;
    max-height: 38vh;
  }
}

@media (min-width: 769px) and (max-width: 1024px) {
  .textbox-container {
    padding: var(--spacing-lg);
  }

  .textbox-content {
    max-width: 85%;
    padding: 1.25rem 1.5rem;
    border-radius: var(--border-radius-large);
  }

  .has-speaker .textbox-content {
    padding-top: 1.875rem;
  }

  .speaker-name {
    font-size: 0.85rem;
    padding: 0.45rem 0.9rem;
  }

  .dialogue-text {
    font-size: var(--text-size-large);
    line-height: 1.6;
    max-height: 40vh;
  }
}

@media (min-width: 1025px) {
  .textbox-container {
    padding: var(--spacing-xl);
  }

  .textbox-content {
    max-width: 80%;
    padding: 1.5rem 2rem;
    border-radius: var(--border-radius-large);
  }

  .has-speaker .textbox-content {
    padding-top: 2rem;
  }

  .speaker-name {
    font-size: 0.9rem;
    padding: 0.5rem 1rem;
  }

  .dialogue-text {
    font-size: var(--text-size-large);
    line-height: 1.7;
    max-height: 40vh;
  }
}

/* Ultra-wide screen optimizations */
@media (min-width: 1440px) {
  .textbox-content {
    max-width: 70%;
    padding: 1.75rem 2.5rem;
  }

  .has-speaker .textbox-content {
    padding-top: 2.25rem;
  }

  .dialogue-text {
    font-size: 1.15rem;
    line-height: 1.8;
  }
}

/* Orientation-specific optimizations */
@media (orientation: landscape) and (max-height: 500px) {
  .textbox-container {
    padding: 0.5rem;
  }

  .textbox-content {
    max-width: 90%;
    padding: 0.75rem 1rem;
  }

  .has-speaker .textbox-content {
    padding-top: 1.25rem;
  }

  .speaker-name {
    font-size: 0.75rem;
    padding: 0.25rem 0.5rem;
  }

  .dialogue-text {
    font-size: 0.9rem;
    line-height: 1.3;
    max-height: 25vh;
  }
}

/* Very tall screens optimization */
@media (min-height: 900px) {
  .dialogue-text {
    max-height: 45vh;
  }
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  .textbox-content {
    background: rgba(0, 0, 0, 0.95);
    border-color: #ffffff;
  }

  .speaker-name {
    color: #ffffff;
  }

  .dialogue-text {
    color: #ffffff;
  }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  .textbox-enter-active,
  .textbox-leave-active {
    transition: opacity 0.2s ease;
  }

  .textbox-enter-from,
  .textbox-leave-to {
    transform: none;
  }
}

/* Focus and accessibility */
/* .textbox-content:focus-within {
  outline: 2px solid #4a9eff;
  outline-offset: 2px;
} */

/* Text overflow handling for very long text */
.dialogue-text {
  max-height: 40vh;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 255, 255, 0.3) transparent;
}

.dialogue-text::-webkit-scrollbar {
  width: 6px;
}

.dialogue-text::-webkit-scrollbar-track {
  background: transparent;
}

.dialogue-text::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 3px;
}

.dialogue-text::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.5);
}
</style>
