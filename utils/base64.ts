/**
 * Utility functions for handling base64 data
 */

/**
 * Strips the data URL prefix from a base64 string
 */
export function stripBase64Prefix(base64String: string): string {
  return base64String.replace(/^data:image\/[a-z]+;base64,/, '');
}

/**
 * Adds data URL prefix to a base64 string if needed
 */
export function addBase64Prefix(base64String: string, mimeType = 'image/png'): string {
  if (base64String.startsWith('data:')) {
    return base64String;
  }
  return `data:${mimeType};base64,${base64String}`;
}