import ts from "typescript";
import { ExtractedFunction } from "./interfaces";
export function extractFunction(
  node: ts.Node,
  kind: ExtractedFunction["kind"],
  nameNode?: ts.BindingName
): ExtractedFunction {
  const sourceFile = node.getSourceFile();

  const start = sourceFile.getLineAndCharacterOfPosition(
    node.getStart(sourceFile)
  );
  const end = sourceFile.getLineAndCharacterOfPosition(node.getEnd());

  const name =
    (ts.isFunctionDeclaration(node) && node.name?.text) ||
    (nameNode && ts.isIdentifier(nameNode) && nameNode.text) ||
    "<anonymous>";

  const parameters = ts.isFunctionLike(node)
    ? node.parameters.map(p => p.name.getText(sourceFile))
    : ts.isVariableStatement(node)
    ? (
        node.declarationList.declarations[0].initializer as ts.ArrowFunction
      ).parameters.map(p => p.name.getText(sourceFile))
    : [];

  const code = sourceFile.text.slice(node.getStart(), node.getEnd());

  return {
    name,
    kind,
    parameters,
    startLine: start.line + 1,
    endLine: end.line + 1,
    lineCount: end.line - start.line + 1,
    code
  };
}
