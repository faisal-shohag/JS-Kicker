import React from "react";
import ReactDOM from "react-dom/client"; // your nice modal
import ContentApp from "./ContentApp";
import "./globals.css";
import { main } from "../content-helpers/main";
import { Toaster } from "react-hot-toast";
import { recheck } from "../content-helpers/recheck";
export const PortalContext = React.createContext<HTMLElement | null>(null);

const ContentRoot = () => {
  const [portalContainer, setPortalContainer] = useState<HTMLElement | null>(
    null,
  );

  return (
    <React.StrictMode>
      <PortalContext.Provider value={portalContainer}>
        <div ref={setPortalContainer} id="js-kicker">
          <ContentApp />
        </div>
        <Toaster />
      </PortalContext.Provider>
    </React.StrictMode>
  );
};

export default defineContentScript({
  matches: ["<all_urls>"],
  cssInjectionMode: "ui",

  async main(ctx) {
    document.addEventListener("keydown", async (event) => {
        await main(event);
        await recheck(event)
        // const fixedSource = fixBrokenFunctions(demoCode);
        // const extractedAST = extractCodeBlocksAST(fixedSource)
        // console.log("AST BASED====>", extractedAST)

        // const extracted = extractCodeBlocks(demoCode)
        // console.log("NON AST BASED====>", extracted)
        // const res = await runner(extractedAST)
        // console.log(res.feedback)
    });

    const ui = await createShadowRootUi(ctx, {
      name: "js-kicker-container",
      position: "inline",
      anchor: "body",
      isolateEvents: ["keydown", "keyup", "keypress", "wheel"],
      onMount: (container) => {
        const app = document.createElement("main");
        app.id = "js-kicker";
        const style = document.createElement("style");
        const head = document.head;
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href =
          "https://fonts.googleapis.com/css2?family=Outfit:wght@100..900&display=swap";
        head.appendChild(link);
        style.textContent = `
        *{
          font-family: 'Outfit', sans-serif;
        }
        `;
        container.append(app);
        container.append(style);
        const root = ReactDOM.createRoot(app);
        root.render(<ContentRoot />);
        return root;
      },
      onRemove: (root) => {
        root?.unmount();
      },
    });

    ui.mount();
  },
});
