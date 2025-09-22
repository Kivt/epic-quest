import { describe, it, expect, vi, beforeEach } from "vitest";
import { nextTick } from "vue";
import BackgroundImage from "../BackgroundImage.vue";
import { mount } from "@vue/test-utils";

describe("BackgroundImage.vue", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("renders with default fallback when no imageUrl provided", () => {
        const wrapper = mount(BackgroundImage);
        const img = wrapper.find("img");

        expect(img.exists()).toBe(true);
        expect(img.attributes("src")).toBe("/bg/default.svg");
        expect(img.attributes("alt")).toBe("Default background");
    });

    it("renders with provided imageUrl", () => {
        const wrapper = mount(BackgroundImage, {
            props: {
                imageUrl: "/bg/classroom.jpg",
            },
        });
        const img = wrapper.find("img");

        expect(img.attributes("src")).toBe("/bg/classroom.jpg");
        expect(img.attributes("alt")).toBe("Scene background");
    });

    it("applies correct CSS classes for responsive scaling", () => {
        const wrapper = mount(BackgroundImage);
        const img = wrapper.find("img");

        expect(img.classes()).toContain("background-image");

        // Check that the component has the container class
        const container = wrapper.find(".background-container");
        expect(container.exists()).toBe(true);
    });

    it("emits imageLoaded event when image loads successfully", async () => {
        const wrapper = mount(BackgroundImage, {
            props: {
                imageUrl: "/bg/test.jpg",
            },
        });

        // Simulate the load event by calling the handler directly
        const component = wrapper.vm as any;
        const mockEvent = {
            target: { src: "/bg/test.jpg" },
        };
        component.onImageLoad(mockEvent);

        await nextTick();

        expect(wrapper.emitted("imageLoaded")).toBeTruthy();
        expect(wrapper.emitted("imageLoaded")?.[0]).toEqual(["/bg/test.jpg"]);
    });

    it("emits imageError event and falls back when image fails to load", async () => {
        const wrapper = mount(BackgroundImage, {
            props: {
                imageUrl: "/bg/nonexistent.jpg",
                fallbackUrl: "/bg/fallback.jpg",
            },
        });

        // Simulate the error event by calling the handler directly
        const component = wrapper.vm as any;
        const mockEvent = {
            target: { src: "/bg/nonexistent.jpg" },
        };
        component.onImageError(mockEvent);

        await nextTick();

        expect(wrapper.emitted("imageError")).toBeTruthy();
        expect(wrapper.emitted("imageError")?.[0]).toEqual(["/bg/nonexistent.jpg"]);

        // Should switch to fallback
        const img = wrapper.find("img");
        expect(img.attributes("src")).toBe("/bg/fallback.jpg");
    });

    it("handles transition prop correctly", () => {
        const wrapper = mount(BackgroundImage, {
            props: {
                imageUrl: "/bg/test.jpg",
                transition: "slide",
            },
        });

        // The transition name should be applied to the transition component
        const transition = wrapper.findComponent({ name: "transition" });
        expect(transition.exists()).toBe(true);
        expect(transition.attributes("name")).toBe("background-slide");
    });

    it("resets error state when imageUrl changes", async () => {
        const wrapper = mount(BackgroundImage, {
            props: {
                imageUrl: "/bg/first.jpg",
            },
        });

        // Access the component's reactive data
        const component = wrapper.vm as any;

        // Manually set error state to true
        component.imageLoadError = true;
        await nextTick();

        // Verify it's showing fallback
        let img = wrapper.find("img");
        expect(img.attributes("src")).toBe("/bg/default.svg");

        // Change the imageUrl - this should reset the error state
        await wrapper.setProps({ imageUrl: "/bg/second.jpg" });
        await nextTick();

        // Should show the new image, not fallback (because error state was reset)
        img = wrapper.find("img");
        expect(img.attributes("src")).toBe("/bg/second.jpg");
    });

    it("uses custom fallback URL when provided", () => {
        const wrapper = mount(BackgroundImage, {
            props: {
                fallbackUrl: "/bg/custom-fallback.jpg",
            },
        });

        const img = wrapper.find("img");
        expect(img.attributes("src")).toBe("/bg/custom-fallback.jpg");
    });

    it("applies fade transition by default", () => {
        const wrapper = mount(BackgroundImage);
        const transition = wrapper.findComponent({ name: "transition" });

        expect(transition.attributes("name")).toBe("background-fade");
    });

    it("applies custom transition when specified", () => {
        const wrapper = mount(BackgroundImage, {
            props: {
                transition: "flash",
            },
        });
        const transition = wrapper.findComponent({ name: "transition" });

        expect(transition.attributes("name")).toBe("background-flash");
    });

    it("has proper responsive CSS structure", () => {
        const wrapper = mount(BackgroundImage);
        const container = wrapper.find(".background-container");
        const img = wrapper.find(".background-image");

        expect(container.exists()).toBe(true);
        expect(img.exists()).toBe(true);

        // Verify the classes are applied correctly
        expect(container.classes()).toContain("background-container");
        expect(img.classes()).toContain("background-image");
    });

    it("emits transitionComplete event after transition", async () => {
        vi.useFakeTimers();

        const wrapper = mount(BackgroundImage, {
            props: {
                imageUrl: "/bg/test.jpg",
            },
        });

        const mockDone = vi.fn();

        // Access the component instance to call the leave handler
        const component = wrapper.vm as any;
        component.onLeave(document.createElement("div"), mockDone);

        // Fast-forward time
        vi.advanceTimersByTime(300);

        expect(mockDone).toHaveBeenCalled();
        expect(wrapper.emitted("transitionComplete")).toBeTruthy();

        vi.useRealTimers();
    });
});
