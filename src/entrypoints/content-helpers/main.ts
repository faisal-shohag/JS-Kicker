import { extractCodeBlocksAST } from "../parser/extract-code-blocks";
import { getFinalMarks } from "./calculateMarks";
import { runner } from "./runner";
import toast from "react-hot-toast";
export const main = async (event: KeyboardEvent) => {
  const assignmentName = (
    document.querySelector(
      ".assignment-evaluation-form header strong",
    ) as HTMLElement
  )?.innerText

  const isA = (assignmentName?.includes("Assignment 4") || assignmentName?.includes("Assignment 3")) || false;
  
  if (isA && event.code === "Backslash") {
    const sourceElement = document
      .querySelectorAll(".row.form-group")[1]
      ?.querySelector(".col-12.col-md-11") as HTMLElement;

    const source = sourceElement?.innerText;

    if (!source) {
      console.log("Source not found!");
      return;
    }

    const extracted = extractCodeBlocksAST(source);
    // console.log(extracted);
    const markField = document.getElementById("Mark") as HTMLInputElement;
    const submittedOnMarks:string | undefined = document.querySelector('.d-flex .font-weight-bold.pl-2')?.textContent; 
    const { feedback, obtainedMarks } = await runner(extracted);
    const finalMarks = getFinalMarks(obtainedMarks, Number(submittedOnMarks), 60);
    markField?.focus();
    navigator.clipboard.writeText(finalMarks.toString());
    if (markField){ 
      markField.value = finalMarks.toString();
    }
    const editor = document.querySelector(".ql-editor");
    if (editor) editor.innerHTML = `<p>${feedback}</p>`;
    toast.success("Feedback generated!", {
      icon: `✅️`,
      style: {
        display: "flex",
        alignItems: "center",
        background: "#fff",
        color: "#363636",
        lineHeight: 1.3,
        willChange: "transform",
        boxShadow:
          "0 3px 10px rgba(0, 0, 0, 0.1), 0 3px 3px rgba(0, 0, 0, 0.05)",
        maxWidth: "350px",
        pointerEvents: "auto",
        padding: "8px 10px",
        borderRadius: "8px",
      },
    });
  }

  if (
    isA &&
    event.ctrlKey &&
    event.shiftKey &&
    event.code === "BracketRight"
  ) {
    const clipboardText = await navigator.clipboard.readText();
    const editor: HTMLElement | null = document.querySelector(".ql-editor");
    if (editor) editor.innerHTML = `<p>${clipboardText}</p>`;
    toast.success("Feedback generated!", {
      icon: `✅️`,
      style: {
        display: "flex",
        alignItems: "center",
        background: "#fff",
        color: "#363636",
        lineHeight: 1.3,
        willChange: "transform",
        boxShadow:
          "0 3px 10px rgba(0, 0, 0, 0.1), 0 3px 3px rgba(0, 0, 0, 0.05)",
        maxWidth: "350px",
        pointerEvents: "auto",
        padding: "8px 10px",
        borderRadius: "8px",
      },
    });
  }
};
