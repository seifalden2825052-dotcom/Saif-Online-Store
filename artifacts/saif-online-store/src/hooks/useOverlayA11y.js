import { useEffect, useRef } from "react";

// Keep the scroll lock and focus stack outside of individual overlays. This
// means an overlay opening while another one is animating out cannot restore
// the body's original overflow too early.
const activeOverlays = [];
const knownOverlayRefs = new Set();
const bodyLocks = new Set();
let originalBodyOverflow = null;

const focusableSelector = [
  "a[href]",
  "area[href]",
  "button:not([disabled])",
  "input:not([disabled]):not([type='hidden'])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "iframe",
  "object",
  "embed",
  "[contenteditable]",
  "[tabindex]:not([tabindex='-1'])",
].join(",");

function getFocusable(container) {
  if (!container) return [];
  return [...container.querySelectorAll(focusableSelector)].filter(
    (element) => element.getAttribute("aria-hidden") !== "true",
  );
}

function lockBody(id) {
  if (bodyLocks.has(id)) return;
  if (bodyLocks.size === 0) {
    originalBodyOverflow = document.body.style.overflow;
  }
  bodyLocks.add(id);
  document.body.style.overflow = "hidden";
}

function unlockBody(id) {
  bodyLocks.delete(id);
  if (bodyLocks.size === 0 && originalBodyOverflow !== null) {
    document.body.style.overflow = originalBodyOverflow;
    originalBodyOverflow = null;
  }
}

function isTopmost(id) {
  return activeOverlays[activeOverlays.length - 1]?.id === id;
}

/**
 * Adds the behavior shared by dialogs and drawers:
 * - initial focus and focus restoration
 * - a keyboard focus trap
 * - Escape-to-close for the topmost overlay
 * - a reference-counted body scroll lock
 *
 * The returned ref belongs on the dialog/drawer element. The caller can
 * provide a ref to a preferred initial focus target (usually the close button).
 */
export function useOverlayA11y({ isOpen, onClose, initialFocusRef } = {}) {
  const overlayRef = useRef(null);
  const idRef = useRef(null);
  const previousFocusRef = useRef(null);
  const onCloseRef = useRef(onClose);

  if (!idRef.current) {
    idRef.current = Symbol("overlay");
  }
  knownOverlayRefs.add(overlayRef);
  onCloseRef.current = onClose;

  useEffect(() => {
    if (!isOpen) return undefined;

    const id = idRef.current;
    const previouslyFocused = document.activeElement;
    previousFocusRef.current =
      previouslyFocused instanceof HTMLElement ? previouslyFocused : null;
    activeOverlays.push({ id, containerRef: overlayRef });
    lockBody(id);

    let focusFrame;
    let usedAnimationFrame = false;
    const focusInitialTarget = (preventScroll) => {
      const container = overlayRef.current;
      const target = initialFocusRef?.current ?? getFocusable(container)[0] ?? container;
      target?.focus?.(preventScroll ? { preventScroll: true } : undefined);
    };
    if (typeof window.requestAnimationFrame === "function") {
      usedAnimationFrame = true;
      focusFrame = window.requestAnimationFrame(() => focusInitialTarget(true));
    } else {
      focusFrame = window.setTimeout(() => focusInitialTarget(false), 0);
    }

    const onKeyDown = (event) => {
      if (!isTopmost(id)) return;

      if (event.key === "Escape") {
        event.preventDefault();
        event.stopPropagation();
        onCloseRef.current?.();
        return;
      }

      if (event.key !== "Tab") return;
      const container = overlayRef.current;
      if (!container) return;

      const focusable = getFocusable(container);
      if (focusable.length === 0) {
        event.preventDefault();
        container.focus?.();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const current = document.activeElement;
      if (
        event.shiftKey
          ? current === first || !container.contains(current)
          : current === last || !container.contains(current)
      ) {
        event.preventDefault();
        (event.shiftKey ? last : first).focus();
      }
    };

    document.addEventListener("keydown", onKeyDown, true);

    return () => {
      if (usedAnimationFrame && typeof window.cancelAnimationFrame === "function") {
        window.cancelAnimationFrame(focusFrame);
      } else {
        window.clearTimeout(focusFrame);
      }
      document.removeEventListener("keydown", onKeyDown, true);
      const index = activeOverlays.findIndex((entry) => entry.id === id);
      if (index >= 0) activeOverlays.splice(index, 1);
      unlockBody(id);

      const restoreTarget = previousFocusRef.current;
      const containingOverlayRefs = [...knownOverlayRefs].filter((ref) =>
        ref.current?.contains(restoreTarget),
      );
      const isInsideInactiveOverlay =
        containingOverlayRefs.length > 0 &&
        !containingOverlayRefs.some((ref) =>
          activeOverlays.some((entry) => entry.containerRef === ref),
        );
      if (
        restoreTarget?.isConnected &&
        !isInsideInactiveOverlay &&
        !restoreTarget.closest("[aria-hidden='true']")
      ) {
        restoreTarget.focus?.({ preventScroll: true });
      }
      previousFocusRef.current = null;
    };
  }, [initialFocusRef, isOpen]);

  return { overlayRef };
}