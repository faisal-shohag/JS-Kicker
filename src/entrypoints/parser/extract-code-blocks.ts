import ts from "typescript";
import { ExtractedFunction } from "./interfaces";
import { extractFunction } from "./extract-function";

export function extractCodeBlocksAST(
  sourceText: string
): ExtractedFunction[] {
  if (!sourceText.trim()) return [];

  const sourceFile = ts.createSourceFile(
    "input.ts",
    sourceText,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX
  );

  const seenNames = new Set<string>();
  const results: ExtractedFunction[] = [];

  function pushIfUnique(fn: ExtractedFunction) {
    if (!fn.name || fn.name === "<anonymous>") {
      results.push(fn);
      return;
    }

    if (seenNames.has(fn.name)) return;

    seenNames.add(fn.name);
    results.push(fn);
  }

  function visit(node: ts.Node) {
  // function foo() {}
  if (ts.isFunctionDeclaration(node) && node.body) {
    pushIfUnique(extractFunction(node, "function"));
  }

  // const foo = function() {}
  if (
    ts.isVariableDeclaration(node) &&
    node.initializer &&
    ts.isFunctionExpression(node.initializer)
  ) {
    pushIfUnique(
      extractFunction(node.parent.parent, "function-expression", node.name)
    );
  }

  // const foo = () => {}
  if (
    ts.isVariableDeclaration(node) &&
    node.initializer &&
    ts.isArrowFunction(node.initializer)
  ) {
    // ⬅️ THIS IS THE FIX
    pushIfUnique(
      extractFunction(node.parent.parent, "arrow", node.name)
    );
  }

  ts.forEachChild(node, visit);
}
  visit(sourceFile);
  return results;
}
