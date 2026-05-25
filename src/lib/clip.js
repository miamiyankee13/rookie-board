function isIOS() {
  // Covers iPhone/iPad/iPod and iPadOS Safari, which can report as Mac
  const ua = navigator?.userAgent || "";
  const isAppleTouch =
    (navigator?.platform === "MacIntel" && navigator?.maxTouchPoints > 1) ||
    /iPad|iPhone|iPod/.test(ua);

  return isAppleTouch;
}

export async function copyText(text) {
  try {
    const value = String(text ?? "");

    // iOS Safari is more reliable with the textarea fallback.
    const forceFallback = isIOS();

    if (!forceFallback && navigator?.clipboard?.writeText) {
      await navigator.clipboard.writeText(value);
      return true;
    }

    const ta = document.createElement("textarea");
    ta.value = value;

    // iOS compatibility
    ta.setAttribute("readonly", "");
    ta.setAttribute("aria-hidden", "true");

    // Prevent zoom / scroll jumps on iOS
    ta.style.position = "fixed";
    ta.style.top = "0";
    ta.style.left = "0";
    ta.style.opacity = "0";
    ta.style.pointerEvents = "none";

    document.body.appendChild(ta);
    ta.focus();
    ta.select();
    ta.setSelectionRange(0, ta.value.length);

    const ok = document.execCommand("copy");
    document.body.removeChild(ta);

    return ok;
  } catch {
    return false;
  }
}