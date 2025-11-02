/**
 * Utility functions for handling markdown files
 */

/**
 * Fetch markdown content from a URL
 * @param {string} url - The URL of the markdown file
 * @returns {Promise<string>} The markdown content as text
 */
export async function fetchMarkdownContent(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch markdown: ${response.statusText}`);
    }
    const content = await response.text();
    return content;
  } catch (error) {
    console.error("Error fetching markdown content:", error);
    return ""; // Return empty string on error
  }
}

/**
 * Fetch content for multiple markdown files
 * @param {Array} markdownFiles - Array of markdown file objects with url and name properties
 * @returns {Promise<Array>} Array of markdown file objects with content property added
 */
export async function fetchMarkdownFiles(markdownFiles) {
  if (!markdownFiles || markdownFiles.length === 0) {
    return [];
  }

  const filesWithContent = await Promise.all(
    markdownFiles.map(async (file) => {
      const content = await fetchMarkdownContent(file.url);
      return {
        ...file,
        content,
      };
    })
  );

  return filesWithContent;
}
