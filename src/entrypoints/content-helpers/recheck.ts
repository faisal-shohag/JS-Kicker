import toast from "react-hot-toast";
import { extractCodeBlocksAST } from "../parser/extract-code-blocks";
import { runner } from "./runner";
import { getFinalMarks } from "./calculateMarks";

export const recheck = async (event: KeyboardEvent) => {
  const btn: HTMLButtonElement | null = document.querySelector(
    ".btn.btn-icon.btn-eye-icon.btn-danger.ml-1",
  );
  if (event.ctrlKey && event.code === "Slash") {
    btn?.click();
    setTimeout(async () => {
      const recheckEl = document.querySelectorAll(".p-3.mx-4.box-shadow.mb-3");
      if (recheckEl.length < 2) return;
      const rechecks = document.querySelectorAll(
        ".p-3.mx-4.box-shadow.mb-3 ul li",
      );
      rechecks[rechecks.length - 1]?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });

      rechecks.forEach((li) => {
        const button = document.createElement("button");
        button.innerText = "🔄 Recheck";
        // button style
        const style = `
                    background-color: #f56565;
                    color: white;
                    border: none;
                    padding: 5px 10px;
                    border-radius: 5px;
                    cursor: pointer;
                    box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px;
                    float: right;
                `;
        button.setAttribute("style", style);
        button.addEventListener("click", async () => {
          const source = (li as HTMLElement).innerText;
          await executeCheck(source);
        });
        li.prepend(button);
      });
    }, 300);
  }

  if (event.ctrlKey && event.code === "Period") {
    const rechecks = document.querySelectorAll(
      ".p-3.mx-4.box-shadow.mb-3 ul li",
    );
    if (rechecks.length === 0) return;
    const lastRecheck = rechecks[rechecks.length - 1] as HTMLElement;
    const source = lastRecheck.innerText;
    await executeCheck(source);
  }

  if (event.ctrlKey && event.code === "Comma") {
    console.log("recheck_box");
    const reasonbox = document.getElementById("reason") as HTMLInputElement;
    reasonbox?.focus();
  }
};

const executeCheck = async (source: string) => {
  const extracted = extractCodeBlocksAST(source);
  console.log({ source, extracted });
  const markField = document.getElementById("Mark") as HTMLInputElement;
  const submittedOnMarks: string | undefined = document.querySelector(
    ".d-flex .font-weight-bold.pl-2",
  )?.textContent;
  const { feedback, obtainedMarks } = await runner(extracted);
  const finalMarks = getFinalMarks(obtainedMarks, Number(submittedOnMarks), 60);
  markField?.focus();
  navigator.clipboard.writeText(finalMarks.toString());
  if (markField) {
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
      boxShadow: "0 3px 10px rgba(0, 0, 0, 0.1), 0 3px 3px rgba(0, 0, 0, 0.05)",
      maxWidth: "350px",
      pointerEvents: "auto",
      padding: "8px 10px",
      borderRadius: "8px",
    },
  });
};
