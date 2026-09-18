import { describe, it, expect } from "vitest";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { conceptBuilds } from "./work-entries";

const inPublic = (src: string) => join(process.cwd(), "public", src);

describe("concept builds", () => {
  it("gives every build a cover and a brand logo that exist on disk", () => {
    expect(conceptBuilds.length).toBeGreaterThan(0);
    for (const build of conceptBuilds) {
      expect(existsSync(inPublic(build.image)), `${build.name} cover`).toBe(true);
      expect(build.logo, `${build.name} logo`).toBeDefined();
      expect(existsSync(inPublic(build.logo!.src)), `${build.name} logo file`).toBe(true);
      expect(build.logo!.width).toBeGreaterThan(0);
      expect(build.logo!.height).toBeGreaterThan(0);
    }
  });

  it("links every build to its own demo", () => {
    for (const build of conceptBuilds) expect(build.href).toMatch(/^\/demo\/[a-z]+$/);
  });
});
