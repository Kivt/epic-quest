<template>
  <div class="character-sprites">
    <TransitionGroup name="character" tag="div" class="character-container">
      <div
        v-for="entry in characterEntries"
        :key="`${entry.character.id}-${entry.slot}`"
        :class="[
          'character-sprite',
          { 'character-sprite--positioned': entry.hasCustomPosition },
        ]"
        :style="entry.style"
      >
        <img
          :src="`../../public${entry.imageUrl}`"
          :alt="entry.name"
          class="character-image"
          @error="handleImageError"
          @load="handleImageLoad"
        />
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { Story, UISlot, CharId, PoseId } from "../types/story";

interface CharacterState {
  id: CharId;
  pose: PoseId;
  x?: number;
  y?: number;
  z?: number;
}

interface Props {
  characters: Partial<Record<UISlot, CharacterState>>;
  story: Story;
}

const props = defineProps<Props>();

const characterEntries = computed(() => {
  const entries = Object.entries(props.characters).map(([slot, character]) => ({
    slot: slot as UISlot,
    character: character!,
    imageUrl: getCharacterImageUrl(character!),
    name: getCharacterName(character!.id),
    hasCustomPosition: character!.x !== undefined || character!.y !== undefined,
    style: getCharacterStyle(character),
  }));


  return entries.map((entry,) => ({
    ...entry,
    style: entry.hasCustomPosition
      ? entry.style
      : getDynamicCharacterStyle(entry.character),
  }));
});

const getCharacterImageUrl = (character: CharacterState): string => {
  const characterData = props.story.assets.characters[character.id];
  if (!characterData) {
    console.warn(`Character ${character.id} not found in story assets`);
    return "";
  }

  const poseUrl = characterData.poses[character.pose];
  if (!poseUrl) {
    console.warn(
      `Pose ${character.pose} not found for character ${character.id}`
    );
    return "";
  }

  return poseUrl;
};

const getCharacterName = (characterId: CharId): string => {
  const characterData = props.story.assets.characters[characterId];
  return characterData?.name || characterId;
};

const getCharacterStyle = (character: CharacterState) => {
  const style: Record<string, string> = {};

  // Apply z-index if specified
  if (character.z !== undefined) {
    style.zIndex = character.z.toString();
  }

  // Apply custom positioning if specified
  if (character.x !== undefined || character.y !== undefined) {
    style.position = "absolute";
    if (character.x !== undefined) {
      style.left = `${character.x}px`;
    }
    if (character.y !== undefined) {
      style.top = `${character.y}px`;
    }
  }

  return style;
};

const getDynamicCharacterStyle = (
  character: CharacterState,
) => {
  const style: Record<string, string> = {};

  // Apply z-index if specified
  if (character.z !== undefined) {
    style.zIndex = character.z.toString();
  }

  // Flexbox handles positioning automatically
  // No need for manual positioning calculations

  return style;
};

const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement;
  console.error(`Failed to load character image: ${img.src}`);
  // Could set a fallback image here if needed
};

const handleImageLoad = (event: Event) => {
  const img = event.target as HTMLImageElement;
  img.classList.add("character-image--loaded");
};
</script>

<style scoped>
.character-sprites {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 50%;
  transform: translateY(25%);
  z-index: 2;
}

.character-container {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  gap: 1rem;
}

.character-sprite {
  display: flex;
  align-items: flex-end;
  justify-content: center;
  transition: all 0.3s ease-in-out;
  flex: 1;
  min-width: 0;
}

/* Override flexbox when custom coordinates are used */
.character-sprite--positioned {
  position: absolute;
  flex: none;
}

.character-image {
  /* Flexible sizing - single character takes full width, multiple share space */
  width: 100%;
  max-width: 280px;
  height: 320px;
  object-fit: contain;
  object-position: center bottom;
  opacity: 0;
  transition: opacity 0.3s ease-in-out, transform 0.3s ease-in-out;
  /* Ensure crisp rendering */
  image-rendering: -webkit-optimize-contrast;
  image-rendering: crisp-edges;
  /* Add subtle drop shadow for better visibility */
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
}

.character-image--loaded {
  opacity: 1;
}

/* Character enter/leave animations */
.character-enter-active,
.character-leave-active {
  transition: all 0.4s ease-in-out;
}

.character-enter-from {
  opacity: 0;
  transform: translateY(20px) scale(0.95);
}

.character-leave-to {
  opacity: 0;
  transform: translateY(-20px) scale(0.95);
}

.character-move {
  transition: all 0.4s ease-in-out;
}

/* Responsive adjustments */
@media (max-width: 480px) {
  .character-image {
    /* Mobile sizing - single character uses full width, multiple share */
    max-width: none;
    height: 280px;
  }

  /* Single character on mobile takes full width */
  .character-container:not(:has(.character-sprite:nth-child(2)))
    .character-image {
    width: 100%;
    max-width: 300px;
  }
}

@media (min-width: 481px) and (max-width: 768px) {
  .character-image {
    /* Medium size for tablets */
    max-width: 240px;
    height: 280px;
  }
}

@media (min-width: 769px) and (max-width: 1024px) {
  .character-image {
    /* Slightly larger for larger tablets */
    max-width: 260px;
    height: 300px;
  }
}

@media (min-width: 1025px) {
  .character-image {
    /* Full size for desktop */
    width: 280px;
    height: 320px;
  }
}

/* Orientation-specific optimizations */
@media (orientation: landscape) and (max-height: 500px) {
  .character-image {
    /* Optimized for landscape mode - wider but shorter */
    max-width: 140px;
    height: 180px;
  }

  /* Multiple characters in landscape */
  .character-container:has(.character-sprite:nth-child(2)) .character-image {
    max-width: 120px;
    height: 160px;
  }
}

/* Very small screens - ensure characters are still visible */
@media (max-width: 320px) {
  .character-image {
    max-width: 140px;
    height: 240px;
  }
}

/* Ensure characters don't get too small on any device */
@media (max-width: 280px) {
  .character-image {
    max-width: 120px;
    height: 200px;
  }
}

/* Specific adjustments for multiple characters on mobile */
@media (max-width: 480px) {
  .character-container:has(.character-sprite:nth-child(2)) .character-image {
    /* When 2+ characters, limit max width */
    max-width: 145px;
    height: 260px;
  }

  .character-container:has(.character-sprite:nth-child(3)) .character-image {
    /* When 3+ characters, make them even narrower */
    max-width: 120px;
    height: 240px;
  }
}

/* High DPI displays - maintain sharpness */
@media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
  .character-image {
    image-rendering: -webkit-optimize-contrast;
    image-rendering: optimize-contrast;
  }
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  .character-image {
    filter: contrast(1.2);
  }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  .character-sprite,
  .character-image,
  .character-enter-active,
  .character-leave-active,
  .character-move {
    transition: none;
  }
}
</style>
