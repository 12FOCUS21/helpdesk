import { describe, expect, it } from "vitest";
import { assertTransition, canTransition, InvalidTransitionError } from "./status";
import { TICKET_STATUSES } from "./constants";

describe("canTransition", () => {
  it("permite avanzar de abierto a en progreso", () => {
    expect(canTransition("abierto", "en_progreso")).toBe(true);
  });

  it("permite cerrar un ticket en progreso", () => {
    expect(canTransition("en_progreso", "cerrado")).toBe(true);
  });

  it("permite reabrir un ticket cerrado", () => {
    expect(canTransition("cerrado", "abierto")).toBe(true);
  });

  it("no permite cerrar un ticket abierto sin atenderlo", () => {
    expect(canTransition("abierto", "cerrado")).toBe(false);
  });

  it("no permite volver de en progreso a abierto", () => {
    expect(canTransition("en_progreso", "abierto")).toBe(false);
  });

  it("no permite cerrar un ticket ya cerrado", () => {
    expect(canTransition("cerrado", "cerrado")).toBe(false);
  });

  it("solo permite las transiciones definidas para cada estado", () => {
    const expected: Record<string, string[]> = {
      abierto: ["en_progreso"],
      en_progreso: ["cerrado"],
      cerrado: ["abierto"],
    };

    for (const from of TICKET_STATUSES) {
      for (const to of TICKET_STATUSES) {
        expect(canTransition(from, to)).toBe(expected[from].includes(to));
      }
    }
  });
});

describe("assertTransition", () => {
  it("no lanza error con una transición válida", () => {
    expect(() => assertTransition("abierto", "en_progreso")).not.toThrow();
  });

  it("lanza InvalidTransitionError con una transición inválida", () => {
    expect(() => assertTransition("abierto", "cerrado")).toThrow(
      InvalidTransitionError,
    );
  });
});
