export interface Point {
  x: number;
  y: number;
}
export interface WheelBounds {
  left: number;
  top: number;
  width: number;
  height: number;
}
export function angularDelta(current: number, previous: number) {
  return ((current - previous + 540) % 360) - 180;
}
function angle(point: Point, bounds: WheelBounds) {
  return (
    (Math.atan2(
      point.y - bounds.top - bounds.height / 2,
      point.x - bounds.left - bounds.width / 2,
    ) *
      180) /
    Math.PI
  );
}
function insideCenter(point: Point, bounds: WheelBounds) {
  return (
    Math.hypot(
      point.x - bounds.left - bounds.width / 2,
      point.y - bounds.top - bounds.height / 2,
    ) <
    bounds.width * 0.21
  );
}
function crossesCenter(from: Point, to: Point, bounds: WheelBounds) {
  const dx = to.x - from.x,
    dy = to.y - from.y;
  const length = dx * dx + dy * dy;
  if (!length) return insideCenter(to, bounds);
  const projection = Math.max(
    0,
    Math.min(
      1,
      ((bounds.left + bounds.width / 2 - from.x) * dx +
        (bounds.top + bounds.height / 2 - from.y) * dy) /
        length,
    ),
  );
  return insideCenter(
    { x: from.x + projection * dx, y: from.y + projection * dy },
    bounds,
  );
}
/** Pointer-type independent: mouse, touch and pen share the same gesture rules. */
export class WheelGesture {
  private drag: {
    id: number;
    angle: number;
    total: number;
    distance: number;
    point: Point;
  } | null = null;
  private dragged = false;
  private onStep: (direction: number) => void;
  constructor(onStep: (direction: number) => void) {
    this.onStep = onStep;
  }
  start(id: number, button: number, point: Point, bounds: WheelBounds) {
    if (button !== 0 || this.drag || insideCenter(point, bounds)) return false;
    this.drag = {
      id,
      angle: angle(point, bounds),
      total: 0,
      distance: 0,
      point,
    };
    this.dragged = false;
    return true;
  }
  move(id: number, point: Point, bounds: WheelBounds) {
    const drag = this.drag;
    if (!drag || drag.id !== id) return false;
    const next = angle(point, bounds);
    const crossedCenter = crossesCenter(drag.point, point, bounds);
    drag.distance += Math.hypot(point.x - drag.point.x, point.y - drag.point.y);
    drag.point = point;
    if (drag.distance > 9) this.dragged = true;
    if (crossedCenter) {
      drag.angle = next;
      drag.total = 0;
      return this.dragged;
    }
    drag.total += angularDelta(next, drag.angle);
    drag.angle = next;
    if (this.dragged && Math.abs(drag.total) >= 25) {
      const direction = Math.sign(drag.total);
      drag.total -= direction * 25;
      this.onStep(direction);
    }
    return this.dragged;
  }
  end(id: number) {
    if (this.drag?.id !== id) return false;
    this.drag = null;
    return true;
  }
  cancel() {
    this.drag = null;
    this.dragged = false;
  }
  consumeClick() {
    const value = this.dragged;
    this.dragged = false;
    return value;
  }
}
