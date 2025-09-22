// Type aliases
export type AssetId = string;
export type CharId = string;
export type PoseId = string;
export type UISlot = "left" | "center" | "right";

// Action types for state changes
export type Action =
  | { type: "say"; text: string; speaker?: string }
  | { type: "setBackground"; id: AssetId; blur?: number }
  | {
      type: "showCharacter";
      slot: UISlot;
      id: CharId;
      pose: PoseId;
      x?: number;
      y?: number;
      z?: number;
    }
  | {
      type: "updateCharacter";
      id: CharId;
      pose?: PoseId;
      slot?: UISlot;
      x?: number;
      y?: number;
      z?: number;
    }
  | { type: "hideCharacter"; id: CharId }
  | { type: "transition"; name: "fade" | "cut" | "slide" | "flash"; ms: number }
  | { type: "wait"; ms: number };

// Runtime state for current slide
export interface SlideState {
  background?: string;
  backgroundBlur?: number;
  characters: Partial<
    Record<
      UISlot,
      {
        id: CharId;
        pose: PoseId;
        x?: number;
        y?: number;
        z?: number;
      }
    >
  >;
  textbox?: {
    speaker?: string | null;
    text?: string;
  };
}

// Slide structure
export interface Slide {
  id: string;
  initial?: {
    inherit?: boolean; // default true
    background?: AssetId;
    backgroundBlur?: number;
    characters?: Partial<
      Record<
        UISlot,
        { id: CharId; pose: PoseId; x?: number; y?: number; z?: number }
      >
    >;
    textbox?: { speaker?: string | null; text?: string };
  };
  steps: Action[][];
  next?: { scene?: string; slide?: string };
}

// Scene structure
export interface Scene {
  id: string;
  label?: string;
  slides: Slide[];
}

// Main story structure
export interface Story {
  version: "1.0";
  meta: {
    id: string;
    title: string;
  };
  assets: {
    backgrounds: Record<string, string>;
    characters: Record<
      CharId,
      { name: string; speaker_color?: string; poses: Record<PoseId, string> }
    >;
  };
  scenes: Scene[];
}
