/**
 * Escapes SQL LIKE wildcard characters (% and _) in a string
 * to prevent SQL injection via LIKE clauses
 */
export function escapeLikeWildcards(input: string): string {
    return input.replace(/[%_]/g, '\\$&');
}

/**
 * Validates that input is a safe string for simple filtering
 * Rejects strings with potentially dangerous characters/patterns
 */
export function isSafeFilterInput(input: string): boolean {
    // Reject empty strings
    if (!input || input.trim().length === 0) {
        return false;
    }
    // Max length check
    if (input.length > 100) {
        return false;
    }
    // Block SQL keywords and patterns
    const dangerousPatterns = [
        /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|UNION|EXEC|SCRIPT|--|#|\/\*|\*\/))\b/i,
        /[;'"]/,
    ];
    return !dangerousPatterns.some(pattern => pattern.test(input));
}

/**
 * Sanitizes filter input for use in SQL LIKE queries
 * Returns null if input is invalid
 */
export function sanitizeLikeFilter(input: string | undefined): string | null {
    if (!input) return null;
    
    const trimmed = input.trim();
    if (!isSafeFilterInput(trimmed)) return null;
    
    return escapeLikeWildcards(trimmed);
}
