import { useEffect, type RefObject } from "react";

// Closes a dropdown/menu when the user clicks outside of `ref`.
// Replaces the two copy-pasted mousedown-listener useEffects that used
// to live in Navbar and MoreDropdown.
export function useOutsideClick(ref: RefObject<HTMLElement | null>, onOutsideClick: () => void) {
  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        onOutsideClick();
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [ref, onOutsideClick]);
}