import { useState, useEffect } from "react";
import AiChat from "@/pages/AiChat";

import closeIcon from "@/asset/icons/close.svg";
import maximizeIcon from "@/asset/icons/maximize.svg";

export default function AiWidget() {
  const [open, setOpen] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [initialMessage, setInitialMessage] = useState("");

  useEffect(() => {
    const handleOpen = (e) => {
      setOpen(true);

      if (e.detail?.message) {
        setInitialMessage(e.detail.message);
      }
    };

    window.addEventListener("open-ai-chat", handleOpen);

    return () =>
      window.removeEventListener("open-ai-chat", handleOpen);
  }, []);

  if (!open) return null;

  return (
    <div
      className={`fixed bg-white shadow-xl z-50 flex flex-col
      ${
        fullscreen
          ? "top-0 left-0 w-full h-full"
          : "bottom-6 right-6 w-[380px] h-[600px] rounded-2xl"
      }`}
    >
      {/* HEADER */}
      <div className="flex justify-between items-center p-3 border-b">

        <span className="font-medium">Renyou AI</span>

        <div className="flex gap-2">

          <button onClick={() => setFullscreen(!fullscreen)}>
            <img src={maximizeIcon} className="w-4 h-4" />
          </button>

          <button onClick={() => setOpen(false)}>
            <img src={closeIcon} className="w-4 h-4" />
          </button>

        </div>
      </div>

      {/* CHAT */}
      <div className="flex-1 overflow-hidden">
        <AiChat initialMessage={initialMessage} />
      </div>
    </div>
  );
}