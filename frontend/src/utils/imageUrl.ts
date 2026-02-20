/**
 * Resolves a product image path to a full URL.
 *
 * - New images uploaded after the Cloudinary migration will already be
 *   absolute HTTPS URLs (e.g. https://res.cloudinary.com/...).
 * - Old images seeded/uploaded before the migration may be stored as
 *   relative paths like "/uploads/image-123.jpg". For those we prepend
 *   the backend URL so the browser can find them.
 *
 * NOTE: Old relative-path images will still be broken in production
 *       because Render wipes the ephemeral filesystem on every restart.
 *       Re-upload those products' images to fix them permanently.
 */
export const resolveImageUrl = (imagePath: string): string => {
  if (!imagePath) return "";

  // Already an absolute URL (Cloudinary or any other CDN)
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath;
  }

  // Relative path — prepend the backend base URL
  const backendUrl =
    import.meta.env.VITE_BACKEND_URL || "http://localhost:5001";

  // Ensure no double slashes
  const normalised = imagePath.startsWith("/") ? imagePath : `/${imagePath}`;
  return `${backendUrl}${normalised}`;
};
