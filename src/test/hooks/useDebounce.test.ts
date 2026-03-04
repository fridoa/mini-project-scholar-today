import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import useDebounce from "@/hooks/useDebounce";

describe("useDebounce", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  it("should not call function immediately", () => {
    const callback = vi.fn();
    const { result } = renderHook(() => useDebounce());

    act(() => {
      result.current(callback, 500);
    });

    expect(callback).not.toHaveBeenCalled();
  });

  it("should call function after delay", () => {
    const callback = vi.fn();
    const { result } = renderHook(() => useDebounce());

    act(() => {
      result.current(callback, 500);
    });

    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(callback).toHaveBeenCalledTimes(1);
  });

  it("should cancel previous call when called again within delay", () => {
    const callback1 = vi.fn();
    const callback2 = vi.fn();
    const { result } = renderHook(() => useDebounce());

    act(() => {
      result.current(callback1, 500);
    });

    act(() => {
      vi.advanceTimersByTime(300);
    });

    act(() => {
      result.current(callback2, 500);
    });

    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(callback1).not.toHaveBeenCalled();
    expect(callback2).toHaveBeenCalledTimes(1);
  });

  it("should only execute the last call in rapid succession", () => {
    const callback = vi.fn();
    const { result } = renderHook(() => useDebounce());

    act(() => {
      result.current(callback, 300);
      result.current(callback, 300);
      result.current(callback, 300);
    });

    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(callback).toHaveBeenCalledTimes(1);
  });

  it("should handle different delay values", () => {
    const callback = vi.fn();
    const { result } = renderHook(() => useDebounce());

    act(() => {
      result.current(callback, 1000);
    });

    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(callback).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(callback).toHaveBeenCalledTimes(1);
  });
});
