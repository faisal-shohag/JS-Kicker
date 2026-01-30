function isFunctionStart(line: string): boolean {
  const trimmed = line.trim();
  return (
    /^function\s+\w+\s*\(/.test(trimmed) ||
    /^(export\s+)?(const|let|var)\s+\w+\s*=\s*(async\s*)?\(?.*\)?\s*=>\s*\{/.test(trimmed)
  );
}


function stripComments(sourceText: string): string {
  let result = "";
  let inBlock = false;

  for (let i = 0; i < sourceText.length; i++) {
    const char = sourceText[i];
    const next = sourceText[i + 1];

    // Enter block comment
    if (!inBlock && char === "/" && next === "*") {
      inBlock = true;
      result += "  "; // preserve column spacing
      i++;
      continue;
    }

    // Exit block comment
    if (inBlock && char === "*" && next === "/") {
      inBlock = false;
      result += "  ";
      i++;
      continue;
    }

    // Line comment
    if (!inBlock && char === "/" && next === "/") {
      while (i < sourceText.length && sourceText[i] !== "\n") {
        result += " ";
        i++;
      }
      result += "\n";
      continue;
    }

    // Normal char
    result += inBlock ? " " : char;
  }

  return result;
}


export function fixBrokenFunctions(sourceText: string): string {
  sourceText = stripComments(sourceText);
  const lines = sourceText.split("\n");
  const output: string[] = [];

  let braceCount = 0;
  let inFunction = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (inFunction && braceCount > 0 && isFunctionStart(line)) {
      output.push("}".repeat(braceCount));
      braceCount = 0;
      inFunction = false;
    }

    if (!inFunction && isFunctionStart(line)) {
      inFunction = true;
      braceCount = 0;
    }

    if (inFunction) {
      for (const char of line) {
        if (char === "{") braceCount++;
        if (char === "}") braceCount--;
      }
    }

    output.push(line);
  }

  if (inFunction && braceCount > 0) {
    output.push("}".repeat(braceCount));
  }

  return output.join("\n");
}
