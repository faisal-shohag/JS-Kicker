export interface ExtractedFunction {
  name: string;
  startLine: number;
  endLine: number;
  lineCount: number;
  code: string;
  parameters: string[];
  kind: "function" | "arrow" | "function-expression";
}
