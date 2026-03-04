import { describe, it, expect, beforeEach } from "vitest";
import { renderHook } from "@testing-library/react";
import useDocumentTitle from "@/hooks/useDocumentTitle";

const BASE_TITLE = "Scholar Today";

describe("useDocumentTitle", () => {
  beforeEach(() => {
    document.title = BASE_TITLE;
  });

  it("should set document title with page name", () => {
    renderHook(() => useDocumentTitle("Home"));
    expect(document.title).toBe("Scholar Today - Home");
  });

  it("should set base title when no argument provided", () => {
    renderHook(() => useDocumentTitle());
    expect(document.title).toBe("Scholar Today");
  });

  it("should set base title when undefined is passed", () => {
    renderHook(() => useDocumentTitle(undefined));
    expect(document.title).toBe("Scholar Today");
  });

  it("should update document title when title changes", () => {
    const { rerender } = renderHook(
      ({ title }) => useDocumentTitle(title),
      { initialProps: { title: "Home" } },
    );

    expect(document.title).toBe("Scholar Today - Home");

    rerender({ title: "Profile" });
    expect(document.title).toBe("Scholar Today - Profile");
  });

  it("should restore base title on unmount", () => {
    const { unmount } = renderHook(() => useDocumentTitle("Home"));
    expect(document.title).toBe("Scholar Today - Home");

    unmount();
    expect(document.title).toBe("Scholar Today");
  });
});
