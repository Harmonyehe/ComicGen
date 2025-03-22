/**
 * Utility to export DOM elements to image
 */
export const exportToImage = async (
  element: HTMLElement,
  options = { quality: 0.95, type: "image/png" }
): Promise<string> => {
  // Load html2canvas dynamically to avoid bundling it
  const html2canvas = (await import("html2canvas")).default;
  
  const canvas = await html2canvas(element, {
    allowTaint: true,
    useCORS: true,
    scale: 2, // Higher scale for better quality
    logging: false,
  });
  
  // Return base64 data URL
  return canvas.toDataURL(options.type, options.quality);
};
