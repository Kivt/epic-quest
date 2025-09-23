// Image loader utility for Vite
// This handles loading images from src/assets/images folder

// Use Vite's glob import to pre-load all images
const imageModules = import.meta.glob("../assets/images/**/*", {
    eager: true,
    query: "?url",
    import: "default",
});

// Create a map of image paths to their resolved URLs
const imageMap = new Map<string, string>();

// Populate the image map
Object.entries(imageModules).forEach(([path, url]) => {
    // Convert the full path to the relative path used in story assets
    // e.g., '../assets/images/bg/room.avif' -> '/bg/room.avif'
    const relativePath = path.replace("../assets/images", "");
    imageMap.set(relativePath, url as string);
});

export function getImageUrl(path: string | undefined): string {
    if (!path) {
        return "";
    }

    // Look up the image in our pre-loaded map
    const imageUrl = imageMap.get(path);

    if (imageUrl) {
        return imageUrl;
    }

    // Fallback: try the dynamic import approach
    try {
        return new URL(`../assets/images${path}`, import.meta.url).href;
    } catch {
        return "";
    }
}
