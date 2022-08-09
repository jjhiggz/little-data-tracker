import { useCallback, useEffect } from "react";

type UseKeyProps = {
  onKey: "up" | "down" | "press";
  keys: (
    | "Escape"
    | "Enter"
    | "Tab"
    | "Shift"
    | "j"
    | "k"
    | "l"
    | "h"
    | "ArrowRight"
    | "ArrowLeft"
  )[];
  handler: () => void;
  activeWhen: boolean;
};

const useKeyListener = ({ onKey, keys, handler, activeWhen }: UseKeyProps) => {
  const eventListener = useCallback(
    (e: any) => {
      if (keys.includes(e.key)) {
        handler();
      }
    },
    [handler, keys]
  );

  useEffect(() => {
    if (activeWhen) {
      document.addEventListener("key" + onKey, eventListener);
    }
    if (!activeWhen) {
      document.removeEventListener("key" + onKey, eventListener);
    }
    return () => {
      document.removeEventListener("key" + onKey, eventListener);
    };
  }, [eventListener, activeWhen, onKey]);
};

export default useKeyListener;
