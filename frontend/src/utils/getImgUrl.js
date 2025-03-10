function getImgUrl(name) {
    if (!name) {
        return "/default-image.jpg"; // Return a default placeholder
    }

    // ✅ If image is an absolute URL (external)
    if (name.startsWith("http") || name.startsWith("https")) {
        return name;
    }

    // ✅ If image is stored in the backend `/uploads/`
    if (name.startsWith("/uploads/") || name.startsWith("uploads/")) {
        return `http://localhost:5000/${name.replace(/^\//, "")}`;
    }

    // ✅ If the image is a File object (uploaded from the computer)
    if (name instanceof File) {
        return URL.createObjectURL(name); // Generate preview URL
    }

    // ✅ If it's a local asset inside `assets/products/`
    try {
        return new URL(`../assets/products/${name}`, import.meta.url).href;
    } catch (error) {
        console.error(`Error loading image: ${name}`, error);
    }

    return "/default-image.jpg"; // Fallback image
}

export { getImgUrl };
