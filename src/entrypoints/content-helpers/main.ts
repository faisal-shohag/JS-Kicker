import { extractCodeBlocks } from "./code-splitter";
import { runner } from "./runner";
import toast from "react-hot-toast";
export const main = async (event: any) => {
  const isA4 = (
    document.querySelector(
      ".assignment-evaluation-form header strong",
    ) as HTMLElement
  )?.innerText?.includes("Assignment 4");

  if (isA4 && event.code === "Backslash") {
    const sourceElement = document
      .querySelectorAll(".row.form-group")[1]
      ?.querySelector(".col-12.col-md-11") as HTMLElement;

    const source = sourceElement?.innerText;

    if (!source) {
      console.log("Source not found!");
      return;
    }

    const extracted = extractCodeBlocks(source);
    const { feedback, obtainedMarks } = await runner(extracted);
    const markField = document.getElementById("Mark") as HTMLInputElement;
    markField?.focus();
    navigator.clipboard.writeText(obtainedMarks.toString());
    if (markField) markField.value = obtainedMarks.toString();
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
    isA4 &&
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
