import { useCallback, useEffect, useRef, useState } from "react";

type DocumentPiPWindow = Window & {
  documentPictureInPicture?: {
    requestWindow: (options: { width: number; height: number }) => Promise<Window>;
  };
};

export function useDocumentPiP() {
  // Kept out of React state/props on purpose: React's dev perf tracing enumerates
  // prop objects on every commit, and enumerating a closed Window throws.
  const pipWindowRef = useRef<Window | null>(null);
  const [pipContainer, setPipContainer] = useState<HTMLElement | null>(null);
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    setIsSupported("documentPictureInPicture" in window);
  }, []);

  const copyStylesheets = useCallback(
    (pipDocument: Document, sourceDocument: Document) => {
      const styleSheets = sourceDocument.styleSheets;

      for (let i = 0; i < styleSheets.length; i++) {
        try {
          const sheet = styleSheets[i];
          if (sheet.href) {
            const link = pipDocument.createElement("link");
            link.rel = "stylesheet";
            link.href = sheet.href;
            pipDocument.head.appendChild(link);
          } else {
            const style = pipDocument.createElement("style");
            const rules = sheet.cssRules;
            for (let j = 0; j < rules.length; j++) {
              try {
                style.appendChild(
                  pipDocument.createTextNode(rules[j].cssText),
                );
              } catch {
                // Skip rules that can't be accessed
              }
            }
            pipDocument.head.appendChild(style);
          }
        } catch {
          // Skip stylesheets that can't be accessed (e.g., cross-origin)
        }
      }

      const pipStyle = pipDocument.createElement("style");
      const computedRoot = getComputedStyle(sourceDocument.documentElement);
      pipStyle.textContent = `
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        html, body {
          width: 100%;
          height: 100%;
          font-family: system-ui, -apple-system, sans-serif;
          background: ${computedRoot.getPropertyValue("--background") || "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"};
          color: ${computedRoot.getPropertyValue("--text-primary") || "white"};
        }
        body {
          position: relative;
          overflow: hidden;
        }
      `;
      pipDocument.head.appendChild(pipStyle);
    },
    [],
  );

  // ThemeProvider writes theme tokens as inline styles on <html>, not in a stylesheet
  const mirrorTheme = useCallback(
    (pipDocument: Document, sourceDocument: Document) => {
      const source = sourceDocument.documentElement;
      const target = pipDocument.documentElement;

      target.className = source.className;
      target.style.cssText = source.style.cssText;

      const dataTheme = source.getAttribute("data-theme");
      if (dataTheme) target.setAttribute("data-theme", dataTheme);
    },
    [],
  );

  const requestPiP = useCallback(async () => {
    const api = (window as DocumentPiPWindow).documentPictureInPicture;
    if (!api) return;

    try {
      const win = await api.requestWindow({ width: 400, height: 500 });

      copyStylesheets(win.document, document);
      mirrorTheme(win.document, document);

      const container = win.document.createElement("div");
      container.style.cssText = "position: relative; width: 100%; height: 100%;";
      win.document.body.appendChild(container);

      win.addEventListener("pagehide", () => {
        // Move the container back to the main document so React's unmount never touches a dying window's DOM
        try {
          document.adoptNode(container);
        } catch {
          // Window already torn down; nothing left to move
        }
        pipWindowRef.current = null;
        setPipContainer(null);
      });

      pipWindowRef.current = win;
      setPipContainer(container);
    } catch (error) {
      console.error("Failed to open Picture-in-Picture window:", error);
      pipWindowRef.current = null;
      setPipContainer(null);
    }
  }, [copyStylesheets, mirrorTheme]);

  const closePiP = useCallback(() => {
    pipWindowRef.current?.close();
  }, []);

  const isPiPActive = pipContainer !== null;

  const togglePiP = useCallback(() => {
    if (isPiPActive) {
      closePiP();
    } else {
      void requestPiP();
    }
  }, [isPiPActive, closePiP, requestPiP]);

  return {
    pipContainer,
    isPiPActive,
    isSupported,
    requestPiP,
    closePiP,
    togglePiP,
  };
}
