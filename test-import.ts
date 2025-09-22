// Simple import test to verify component exports
import VisualNovelReader from './src/components/VisualNovelReader.vue'
import type { Story } from './src/types/story'

// This should compile without errors if the component is properly implemented
const testComponent = VisualNovelReader
const testStory: Story = {
  version: "1.0",
  meta: { id: "test", title: "Test" },
  assets: { backgrounds: {}, characters: {} },
  scenes: []
}

console.log('Import test successful')