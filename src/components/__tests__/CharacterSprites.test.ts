import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import CharacterSprites from "../CharacterSprites.vue";
import type { Story } from "../../types/story";

// Mock story data for testing
const mockStory: Story = {
    version: "1.0",
    meta: {
        id: "test-story",
        title: "Test Story",
    },
    assets: {
        backgrounds: {},
        characters: {
            yuki: {
                name: "Yuki",
                poses: {
                    neutral: "/ch/yuki_neutral.png",
                    smile: "/ch/yuki_smile.png",
                },
            },
            alex: {
                name: "Alex",
                poses: {
                    neutral: "/ch/alex_neutral.png",
                    excited: "/ch/alex_excited.png",
                },
            },
        },
    },
    scenes: [],
};

describe("CharacterSprites", () => {
    beforeEach(() => {
    // Mock console methods to avoid noise in tests
        vi.spyOn(console, "warn").mockImplementation(() => {});
        vi.spyOn(console, "error").mockImplementation(() => {});
    });

    it("renders without characters", () => {
        const wrapper = mount(CharacterSprites, {
            props: {
                characters: {},
                story: mockStory,
            },
        });

        expect(wrapper.find(".character-sprites").exists()).toBe(true);
        expect(wrapper.findAll(".character-sprite")).toHaveLength(0);
    });

    it("renders single character in left slot", () => {
        const characters = {
            left: {
                id: "yuki",
                pose: "neutral",
            },
        };

        const wrapper = mount(CharacterSprites, {
            props: {
                characters,
                story: mockStory,
            },
        });

        const characterSprites = wrapper.findAll(".character-sprite");
        expect(characterSprites).toHaveLength(1);

        const sprite = characterSprites[0];
        expect(sprite.classes()).toContain("character-sprite--left");

        const img = sprite.find("img");
        expect(img.attributes("src")).toBe("/ch/yuki_neutral.png");
        expect(img.attributes("alt")).toBe("Yuki");
    });

    it("renders multiple characters in different slots", () => {
        const characters = {
            left: {
                id: "yuki",
                pose: "smile",
            },
            right: {
                id: "alex",
                pose: "excited",
            },
        };

        const wrapper = mount(CharacterSprites, {
            props: {
                characters,
                story: mockStory,
            },
        });

        const characterSprites = wrapper.findAll(".character-sprite");
        expect(characterSprites).toHaveLength(2);

        // Check left character
        const leftSprite = wrapper.find(".character-sprite--left");
        expect(leftSprite.exists()).toBe(true);
        expect(leftSprite.find("img").attributes("src")).toBe("/ch/yuki_smile.png");

        // Check right character
        const rightSprite = wrapper.find(".character-sprite--right");
        expect(rightSprite.exists()).toBe(true);
        expect(rightSprite.find("img").attributes("src")).toBe(
            "/ch/alex_excited.png"
        );
    });

    it("applies custom positioning when x/y coordinates are provided", () => {
        const characters = {
            center: {
                id: "yuki",
                pose: "neutral",
                x: 100,
                y: 50,
            },
        };

        const wrapper = mount(CharacterSprites, {
            props: {
                characters,
                story: mockStory,
            },
        });

        const sprite = wrapper.find(".character-sprite");
        expect(sprite.classes()).toContain("character-sprite--positioned");

        const style = sprite.attributes("style");
        expect(style).toContain("left: 100px");
        expect(style).toContain("top: 50px");
    });

    it("applies z-index when provided", () => {
        const characters = {
            center: {
                id: "yuki",
                pose: "neutral",
                z: 10,
            },
        };

        const wrapper = mount(CharacterSprites, {
            props: {
                characters,
                story: mockStory,
            },
        });

        const sprite = wrapper.find(".character-sprite");
        const style = sprite.attributes("style");
        expect(style).toContain("z-index: 10");
    });

    it("handles missing character gracefully", () => {
        const characters = {
            left: {
                id: "nonexistent",
                pose: "neutral",
            },
        };

        const wrapper = mount(CharacterSprites, {
            props: {
                characters,
                story: mockStory,
            },
        });

        const img = wrapper.find("img");
        expect(img.attributes("src")).toBe("");
        expect(console.warn).toHaveBeenCalledWith(
            "Character nonexistent not found in story assets"
        );
    });

    it("handles missing pose gracefully", () => {
        const characters = {
            left: {
                id: "yuki",
                pose: "nonexistent",
            },
        };

        const wrapper = mount(CharacterSprites, {
            props: {
                characters,
                story: mockStory,
            },
        });

        const img = wrapper.find("img");
        expect(img.attributes("src")).toBe("");
        expect(console.warn).toHaveBeenCalledWith(
            "Pose nonexistent not found for character yuki"
        );
    });

    it("handles image load event", async () => {
        const characters = {
            left: {
                id: "yuki",
                pose: "neutral",
            },
        };

        const wrapper = mount(CharacterSprites, {
            props: {
                characters,
                story: mockStory,
            },
        });

        const img = wrapper.find("img");
        await img.trigger("load");

        expect(img.classes()).toContain("character-image--loaded");
    });

    it("handles image error event", async () => {
        const characters = {
            left: {
                id: "yuki",
                pose: "neutral",
            },
        };

        const wrapper = mount(CharacterSprites, {
            props: {
                characters,
                story: mockStory,
            },
        });

        const img = wrapper.find("img");
        await img.trigger("error");

        expect(console.error).toHaveBeenCalledWith(
            expect.stringContaining("Failed to load character image:")
        );
    });

    it("updates when characters prop changes", async () => {
        const wrapper = mount(CharacterSprites, {
            props: {
                characters: {
                    left: {
                        id: "yuki",
                        pose: "neutral",
                    },
                },
                story: mockStory,
            },
        });

        expect(wrapper.findAll(".character-sprite")).toHaveLength(1);

        // Update to add another character
        await wrapper.setProps({
            characters: {
                left: {
                    id: "yuki",
                    pose: "smile",
                },
                right: {
                    id: "alex",
                    pose: "neutral",
                },
            },
        });

        expect(wrapper.findAll(".character-sprite")).toHaveLength(2);
        expect(wrapper.find(".character-sprite--left img").attributes("src")).toBe(
            "/ch/yuki_smile.png"
        );
        expect(wrapper.find(".character-sprite--right img").attributes("src")).toBe(
            "/ch/alex_neutral.png"
        );
    });

    it("removes characters when they are no longer in props", async () => {
        const wrapper = mount(CharacterSprites, {
            props: {
                characters: {
                    left: {
                        id: "yuki",
                        pose: "neutral",
                    },
                    right: {
                        id: "alex",
                        pose: "neutral",
                    },
                },
                story: mockStory,
            },
        });

        expect(wrapper.findAll(".character-sprite")).toHaveLength(2);

        // Remove one character
        await wrapper.setProps({
            characters: {
                left: {
                    id: "yuki",
                    pose: "neutral",
                },
            },
        });

        expect(wrapper.findAll(".character-sprite")).toHaveLength(1);
        expect(wrapper.find(".character-sprite--left").exists()).toBe(true);
        expect(wrapper.find(".character-sprite--right").exists()).toBe(false);
    });

    it("applies correct CSS classes for all slot positions", () => {
        const characters = {
            left: { id: "yuki", pose: "neutral" },
            center: { id: "alex", pose: "neutral" },
            right: { id: "yuki", pose: "smile" },
        };

        const wrapper = mount(CharacterSprites, {
            props: {
                characters,
                story: mockStory,
            },
        });

        expect(wrapper.find(".character-sprite--left").exists()).toBe(true);
        expect(wrapper.find(".character-sprite--center").exists()).toBe(true);
        expect(wrapper.find(".character-sprite--right").exists()).toBe(true);
    });

    it("maintains character identity through pose changes", async () => {
        const wrapper = mount(CharacterSprites, {
            props: {
                characters: {
                    left: {
                        id: "yuki",
                        pose: "neutral",
                    },
                },
                story: mockStory,
            },
        });

        const initialKey =
      wrapper.find(".character-sprite").attributes("key")

        // Change pose but keep same character and slot
        await wrapper.setProps({
            characters: {
                left: {
                    id: "yuki",
                    pose: "smile",
                },
            },
        });

        const newKey =
      wrapper.find(".character-sprite").attributes("key");
        expect(newKey).toBe(initialKey); // Key should remain the same for same character in same slot
        expect(wrapper.find("img").attributes("src")).toBe("/ch/yuki_smile.png");
    });
});
