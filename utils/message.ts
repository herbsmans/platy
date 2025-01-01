export function isBase64Audio(message: string): boolean {
  try {
    // Check if the string is base64 encoded
    const isBase64 = /^[A-Za-z0-9+/]+={0,2}$/.test(message);
    
    // Additional check for common audio file signatures in base64
    const hasAudioSignature = message.startsWith('/+M') || // WebM
                             message.startsWith('GkXf') || // WebM
                             message.startsWith('UklG') || // WAV
                             message.startsWith('//Mo') || // MP3
                             message.startsWith('AAAA'); // AAC
    
    return isBase64 && hasAudioSignature;
  } catch {
    return false;
  }
}

export function isBase64Image(message: string): boolean {
  try {
    // Check if the string is base64 encoded
    const isBase64 = /^[A-Za-z0-9+/]+={0,2}$/.test(message);
    
    // Additional check for common image file signatures in base64
    const hasImageSignature = message.startsWith('/9j/') || // JPEG
                             message.startsWith('iVBORw0') || // PNG
                             message.startsWith('R0lGOD') || // GIF
                             message.startsWith('UklGR'); // WEBP
    
    return isBase64 && hasImageSignature;
  } catch {
    return false;
  }
}