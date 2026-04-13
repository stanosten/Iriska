import { describe, expect, it } from "vitest";

import { resolveBackgroundColorForElement } from "@/lib/cursorBackground";

describe("cursorBackground - integration", () => {
  it("поднимается к родителю, если у текущего элемента прозрачный фон", () => {
    const parent = document.createElement("div");
    parent.style.backgroundColor = "rgb(10, 20, 30)";

    const child = document.createElement("span");
    child.style.backgroundColor = "transparent";
    parent.appendChild(child);
    document.body.appendChild(parent);

    const result = resolveBackgroundColorForElement(child, window);
    expect(result.r).toBe(10);
    expect(result.g).toBe(20);
    expect(result.b).toBe(30);

    parent.remove();
  });

  it("усредняет цвета градиента", () => {
    const block = document.createElement("div");
    block.style.backgroundImage = "linear-gradient(90deg, #ffffff 0%, #000000 100%)";
    document.body.appendChild(block);

    const result = resolveBackgroundColorForElement(block, window);
    expect(result.r).toBeGreaterThanOrEqual(120);
    expect(result.r).toBeLessThanOrEqual(136);
    expect(result.g).toBeGreaterThanOrEqual(120);
    expect(result.g).toBeLessThanOrEqual(136);
    expect(result.b).toBeGreaterThanOrEqual(120);
    expect(result.b).toBeLessThanOrEqual(136);

    block.remove();
  });

  it("использует fallback из body при отсутствии локального фона", () => {
    document.body.style.backgroundColor = "rgb(251, 243, 233)";

    const node = document.createElement("div");
    document.body.appendChild(node);

    const result = resolveBackgroundColorForElement(node, window);
    expect(result).toEqual({ r: 251, g: 243, b: 233, a: 1 });

    node.remove();
  });
});
