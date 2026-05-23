/**
 * ielts-checker.js
 * ─────────────────────────────────────────────────────────────────
 * Drop this <script src="/js/ielts-checker.js"></script> into every
 * static writing-test-N.html file.
 *
 * Each HTML file only needs to define one constant before this script:
 *
 *   <script>
 *     const TEST_ID = "writing-test-1";   // matches key in route.ts TEST_LIBRARY
 *   </script>
 *   <script src="/js/ielts-checker.js"></script>
 *
 * The module reads partData (already set by the test's own JS) and
 * exposes one function:  submitForFeedback()
 * ─────────────────────────────────────────────────────────────────
 */

// ── CONFIG ────────────────────────────────────────────────────────
const API_ENDPOINT = "/api/check-writing";   // your Next.js route
// ─────────────────────────────────────────────────────────────────


/**
 * Call from the test's submit button handler.
 * Requires `partData` and `TEST_ID` to exist in the page scope.
 *
 * @param {Function} onLoading  - called immediately (show spinner)
 * @param {Function} onSuccess  - called with (feedbackObject)
 * @param {Function} onError    - called with (errorMessage string)
 */
async function submitForFeedback(onLoading, onSuccess, onError) {
  if (typeof TEST_ID === "undefined" || !TEST_ID) {
    onError("TEST_ID is not defined on this page. Add <script>const TEST_ID = 'writing-test-N';</script> before loading ielts-checker.js.");
    return;
  }

  const essay1 = (partData?.[1]?.content ?? "").trim();
  const essay2 = (partData?.[2]?.content ?? "").trim();

  if (!essay1 && !essay2) {
    onError("Please write at least one response before submitting.");
    return;
  }

  onLoading();

  try {
    const response = await fetch(API_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        testId:     TEST_ID,
        essay1:     essay1,
        essay2:     essay2,
        wordCount1: partData?.[1]?.wordCount ?? 0,
        wordCount2: partData?.[2]?.wordCount ?? 0,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      // Backend returned a structured error
      throw new Error(data.error ?? `Server error (${response.status})`);
    }

    onSuccess(data);

  } catch (err) {
    onError(err.message ?? "Unknown error. Please try again.");
  }
}
