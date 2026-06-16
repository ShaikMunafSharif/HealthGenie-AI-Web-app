/**
 * Sanitizes user input to prevent prompt injection attacks.
 * Removes common injection phrases and special control characters.
 * @param {string} input - The user input to sanitize.
 * @returns {string} The sanitized input.
 */
export function sanitizePrompt(input) {
  if (typeof input !== 'string') return '';

  // Remove common prompt injection phrases (case insensitive)
  const injectionPatterns = [
    /ignore all previous instructions/gi,
    /ignore previous instructions/gi,
    /disregard previous instructions/gi,
    /system prompt/gi,
    /you are now/gi,
    /forget all instructions/gi,
    /pretend to be/gi,
    /bypass safety/gi,
    /jailbreak/gi,
    /act as/gi,
    /system message/gi,
    /<\|system\|>/gi,
    /<\|user\|>/gi,
    /<\|assistant\|>/gi
  ];

  let sanitized = input;

  for (const pattern of injectionPatterns) {
    sanitized = sanitized.replace(pattern, '[REDACTED]');
  }

  // Remove invisible control characters that might be used to trick the parser
  // Keep basic whitespace (space, tab, newline)
  sanitized = sanitized.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x9F]/g, '');

  return sanitized.trim();
}
