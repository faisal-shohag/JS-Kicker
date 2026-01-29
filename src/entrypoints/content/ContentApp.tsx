import { useState, useEffect } from "react";
import About from "../../components/About";
// import toast from "react-hot-toast";
import "./globals.css";
// import { CircleCheck } from 'lucide-react'
type ViewType = "manual" | "about" | "sync" | null;

const ContentApp = () => {
  const [currentView, setCurrentView] = useState<ViewType>(null);

  useEffect(() => {
    const handleMessage = (message: any) => {
      if (message.action === "run_manually") {
        setCurrentView("manual");
      } else if (message.action === "sync") {
        setCurrentView("sync");
      }
       else if (message.action === "about") {
        setCurrentView("about");
      }
    };

    chrome.runtime.onMessage.addListener(handleMessage);
    return () => chrome.runtime.onMessage.removeListener(handleMessage);
  }, []);

  if (!currentView) return null;

  return (
    <>
      <div className="fixed border border-zinc-700 inset-0 flex items-center justify-center z-9999451 dark:text-white font-outfit">
        <div className="max-w-[90vh] max-h-[90vh] bg-white dark:bg-zinc-800 rounded-lg p-4 shadow-lg relative">
          <button
            onClick={() => {
              setCurrentView(null);
              // toast.success("About closed!", {
              //   icon: <CircleCheck className="text-green-500 mr-2" size={20} />,
              //   style: {
              //     display: "flex",
              //     alignItems: "center",
              //     background: "#fff",
              //     color: "#363636",
              //     lineHeight: 1.3,
              //     willChange: "transform",
              //     boxShadow:
              //       "0 3px 10px rgba(0, 0, 0, 0.1), 0 3px 3px rgba(0, 0, 0, 0.05)",
              //     maxWidth: "350px",
              //     pointerEvents: "auto",
              //     padding: "8px 10px",
              //     borderRadius: "8px",
              //   },
              // });
            }}
            className="absolute top-6 right-6 text-gray-500 hover:text-gray-700 cursor-pointer"
          >
            ✕
          </button>
          {/* {currentView === 'manual' && <ManualChecker />} */}
          {currentView === "sync" && <SyncTestcases />}
          {currentView === "about" && <About />}
        </div>
      </div>
    </>
  );
};

export default ContentApp;
