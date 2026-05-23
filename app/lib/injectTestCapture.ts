// ─────────────────────────────────────────────────────────────────────────────
// GENERIC IFRAME INJECTOR
// Save this as: lib/injectTestCapture.ts
//
// This function is called from your [id]/page.tsx onLoad handler.
// It injects a script into the iframe that:
//   1. Watches for ANY submit/finish button click
//   2. Reads the score from the page (looks for common patterns)
//   3. Sends a postMessage to the parent with { type: "TEST_COMPLETE", score }
//
// HOW TO USE in your [id]/page.tsx:
//
//   const iframeRef = useRef<HTMLIFrameElement>(null)
//
//   const handleIframeLoad = () => {
//     injectTestCapture(iframeRef.current)
//   }
//
//   <iframe ref={iframeRef} onLoad={handleIframeLoad} ... />
// ─────────────────────────────────────────────────────────────────────────────

export function injectTestCapture(iframe: HTMLIFrameElement | null) {
  if (!iframe) return

  try {
    const doc = iframe.contentDocument || iframe.contentWindow?.document
    if (!doc) return

    // The script we inject into the iframe
    const script = `
      (function() {
        if (window.__testCaptureInjected) return;
        window.__testCaptureInjected = true;

        function extractScore() {
          // Strategy 1: look for elements with common score patterns
          const patterns = [
            // text like "Score: 32/40" or "32 / 40" or "32 correct"
            /score[:\\s]*([0-9]+)\\s*\\/\\s*40/i,
            /([0-9]+)\\s*\\/\\s*40/,
            /([0-9]+)\\s*correct/i,
            /result[:\\s]*([0-9]+)/i,
          ];

          const allText = document.body.innerText || "";
          for (const pattern of patterns) {
            const match = allText.match(pattern);
            if (match) {
              const score = parseInt(match[1]);
              if (!isNaN(score) && score >= 0 && score <= 40) return score;
            }
          }

          // Strategy 2: count checked/correct answer elements
          const correct = document.querySelectorAll(
            '.correct, .right, .answer-correct, [data-correct="true"], .score-correct'
          ).length;
          if (correct > 0) return correct;

          // Strategy 3: look for a dedicated score element
          const scoreEl = document.querySelector(
            '#score, #result, .score, .result, [id*="score"], [class*="score"]'
          );
          if (scoreEl) {
            const num = parseInt(scoreEl.textContent || "");
            if (!isNaN(num) && num >= 0 && num <= 40) return num;
          }

          return null;
        }

        function sendResult() {
          const score = extractScore();
          window.parent.postMessage({ type: "TEST_COMPLETE", score: score }, "*");
        }

        // Watch for submit/finish button clicks
        document.addEventListener("click", function(e) {
          const el = e.target;
          if (!el || !(el instanceof HTMLElement)) return;

          const tag = el.tagName.toLowerCase();
          const text = (el.textContent || "").toLowerCase().trim();
          const id = (el.id || "").toLowerCase();
          const cls = (el.className || "").toLowerCase();

          const isSubmitBtn =
            (tag === "button" || tag === "input" || tag === "a") &&
            (
              text.includes("submit") ||
              text.includes("finish") ||
              text.includes("check") ||
              text.includes("done") ||
              text.includes("end test") ||
              id.includes("submit") ||
              id.includes("finish") ||
              cls.includes("submit") ||
              cls.includes("finish")
            );

          if (isSubmitBtn) {
            // Small delay to let the page update with results
            setTimeout(sendResult, 800);
          }
        }, true);

        // Also watch for navigation away (user closes test)
        window.addEventListener("beforeunload", function() {
          const score = extractScore();
          if (score !== null) {
            window.parent.postMessage({ type: "TEST_COMPLETE", score: score }, "*");
          }
        });

        console.log("[CDI] Test capture injected");
      })();
    `

    // Inject via a script tag
    const scriptEl = doc.createElement("script")
    scriptEl.textContent = script
    doc.head?.appendChild(scriptEl) ?? doc.body?.appendChild(scriptEl)

  } catch (e) {
    // Cross-origin — injection failed, fall back to manual postMessage in HTML
    console.warn("[CDI] Could not inject into iframe (cross-origin?):", e)
  }
}
