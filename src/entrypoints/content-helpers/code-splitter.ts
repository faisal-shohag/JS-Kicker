/**
 * Represents a JavaScript function extracted from text
 */
interface ExtractedFunction {
    name: string;
    startLine: number;
    endLine?: number;
    lineCount?: number;
    code: string;
    parameters: string[];
}

/**
 * Extracts JavaScript function code blocks from text content
 * Handles nested braces, complex control structures, and multiple functions
 * @param text - The input text containing JavaScript functions
 * @returns Array of objects containing function information
 */
function extractCodeBlocks(text: string): ExtractedFunction[] {
    if (typeof text !== 'string' || !text.trim()) {
        return [];
    }

    const functions: ExtractedFunction[] = [];
    const functionNames = new Set<string>();
    const lines = text.split('\n');
    let currentFunction: ExtractedFunction | null = null;
    let braceCount = 0;
    let inFunction = false;
    let functionLines: string[] = [];

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const trimmedLine = line.trim();

        // Skip empty lines when not in function
        if (!inFunction && !trimmedLine) {
            continue;
        }

        // Detect function start
        const functionMatch = trimmedLine.match(/^function\s+(\w+)\s*\([^)]*\)\s*\{?/);

        if (functionMatch && !inFunction) {
            const functionName = functionMatch[1];
            
            // Skip if function name already exists
            if (functionNames.has(functionName)) {
                continue;
            }
            
            inFunction = true;
            currentFunction = {
                name: functionName,
                startLine: i + 1,
                code: '',
                parameters: extractParameters(trimmedLine)
            };
            functionLines = [];
            braceCount = 0;
        }

        if (inFunction && currentFunction) {
            functionLines.push(line);

            // Count braces, but ignore braces in strings and comments
            const cleanLine = removeStringsAndComments(line);

            for (const char of cleanLine) {
                if (char === '{') {
                    braceCount++;
                } else if (char === '}') {
                    braceCount--;
                }
            }

            // Function complete when braces are balanced and we have at least one closing brace
            if (braceCount === 0 && cleanLine.includes('}')) {
                currentFunction.code = functionLines.join('\n');
                currentFunction.endLine = i + 1;
                currentFunction.lineCount = functionLines.length;

                functions.push(currentFunction);
                functionNames.add(currentFunction.name);

                // Reset for next function
                inFunction = false;
                currentFunction = null;
                functionLines = [];
                braceCount = 0;
            }
        }
    }

    return functions;
}

/**
 * Removes string literals and comments from a line to avoid counting braces inside them
 * @param line - The line to clean
 * @returns The cleaned line
 */
function removeStringsAndComments(line: string): string {
    let result = '';
    let inString = false;
    let stringChar = '';
    let inComment = false;

    for (let i = 0; i < line.length; i++) {
        const char = line[i];
        const nextChar = line[i + 1];

        // Handle single-line comments
        if (!inString && char === '/' && nextChar === '/') {
            inComment = true;
            i++; // Skip next character
            continue;
        }

        if (inComment) {
            continue;
        }

        // Handle string literals
        if (!inString && (char === '"' || char === "'" || char === '`')) {
            inString = true;
            stringChar = char;
            continue;
        }

        if (inString && char === stringChar && line[i - 1] !== '\\') {
            inString = false;
            stringChar = '';
            continue;
        }

        if (!inString) {
            result += char;
        }
    }

    return result;
}

/**
 * Extracts parameter names from function declaration
 * @param functionLine - The function declaration line
 * @returns Array of parameter names
 */
function extractParameters(functionLine: string): string[] {
    const paramMatch = functionLine.match(/\(([^)]*)\)/);
    if (!paramMatch || !paramMatch[1].trim()) {
        return [];
    }

    return paramMatch[1]
        .split(',')
        .map(param => param.trim())
        .filter(param => param.length > 0);
}

/**
 * Utility function to format extracted functions for display
 * @param functions - Array of function objects
 * @returns Formatted output
 */
function formatFunctionsReport(functions: ExtractedFunction[]): string {
    if (!functions.length) {
        return 'No functions found in the provided text.';
    }

    let report = `Found ${functions.length} function${functions.length === 1 ? '' : 's'}:\n\n`;

    functions.forEach((func, index) => {
        report += `${index + 1}. Function: ${func.name}\n`;
        report += `   Parameters: [${func.parameters.join(', ')}]\n`;
        report += `   Lines: ${func.startLine}-${func.endLine} (${func.lineCount} lines)\n`;
        report += `   Code:\n${func.code}\n\n`;
        report += '-'.repeat(50) + '\n\n';
    });

    return report;
}

// Export the functions if this is a module
export {
    extractCodeBlocks,
    removeStringsAndComments,
    extractParameters,
    formatFunctionsReport,
    type ExtractedFunction
};