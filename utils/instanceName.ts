const SUFFIX_LENGTH = 4;
const VALID_CHARS = '0123456789abcdefghijklmnopqrstuvwxyz';

/**
 * Generates a random string of specified length using valid characters
 */
function generateRandomSuffix(length: number): string {
  let result = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * VALID_CHARS.length);
    result += VALID_CHARS[randomIndex];
  }
  return result;
}

/**
 * Creates a unique instance name by appending a random suffix
 */
export function createUniqueInstanceName(baseName: string): string {
  const cleanName = baseName.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
  const suffix = generateRandomSuffix(SUFFIX_LENGTH);
  return `${cleanName}-${suffix}`;
}