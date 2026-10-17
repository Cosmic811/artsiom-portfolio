"use client";
import { useMemo, useState, type PointerEvent } from "react";
import { WheelGesture } from "../lib/wheel";
export function useClickWheel(onStep: (direction: number) => void) {
  const gesture = useMemo(() => new WheelGesture(onStep), [onStep]);
  const [dragging, setDragging] = useState(false);
  return {
    dragging,
    onPointerDown(e: PointerEvent<HTMLElement>) {
      if (
        gesture.start(
          e.pointerId,
          e.button,
          { x: e.clientX, y: e.clientY },
          e.currentTarget.getBoundingClientRect(),
        )
      )
        setDragging(true);
    },
    onPointerMove(e: PointerEvent<HTMLElement>) {
      const capture = gesture.move(
        e.pointerId,
        { x: e.clientX, y: e.clientY },
        e.currentTarget.getBoundingClientRect(),
      );
      if (capture && !e.currentTarget.hasPointerCapture(e.pointerId))
        e.currentTarget.setPointerCapture(e.pointerId);
    },
    onPointerUp(e: PointerEvent<HTMLElement>) {
      if (gesture.end(e.pointerId)) {
        setDragging(false);
        if (e.currentTarget.hasPointerCapture(e.pointerId))
          e.currentTarget.releasePointerCapture(e.pointerId);
      }
    },
    onPointerCancel() {
      gesture.cancel();
      setDragging(false);
    },
    onPointerLeave(e: PointerEvent<HTMLElement>) {
      if (!e.currentTarget.hasPointerCapture(e.pointerId)) {
        gesture.cancel();
        setDragging(false);
      }
    },
    onClickCapture(e: React.MouseEvent<HTMLElement>) {
      if (gesture.consumeClick()) {
        e.stopPropagation();
        e.preventDefault();
      }
    },
  };
}
