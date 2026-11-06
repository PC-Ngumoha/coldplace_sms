const KEY = "has_session";

interface SessionHintHandlers {
  onSessionStarted: () => void;
  onSessionEnded: () => void;
}

export const sessionHint = {
  exists(): boolean {
    try {
      return window.localStorage.getItem(KEY) === "1";
    } catch {
      return true;
    }
  },

  set(): void {
    try {
      window.localStorage.setItem(KEY, "1");
    } catch {
      /**Ignore */
    }
  },

  clear(): void {
    try {
      window.localStorage.removeItem(KEY);
    } catch {
      {
        /**Ignore */
      }
    }
  },

  subscribe({
    onSessionStarted,
    onSessionEnded,
  }: SessionHintHandlers): () => void {
    const listener = (e: StorageEvent) => {
      if (e.key === null) {
        onSessionEnded();
      } else if (e.key === KEY) {
        if (e.newValue === "1") onSessionStarted();
        else if (e.newValue === null) onSessionEnded();
      }
    };

    window.addEventListener("storage", listener);
    return () => window.removeEventListener("storage", listener);
  },
};
