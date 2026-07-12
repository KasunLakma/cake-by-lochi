import { describe, it, expect } from "vitest";
import { formatEventDate } from "../lib/dates";

describe("Date Formatting Utility", () => {
  it("should format abbreviated date strings to full long month format", () => {
    expect(formatEventDate("Sept 20, 2026")).toBe("September 20, 2026");
    expect(formatEventDate("Jul 15, 2026")).toBe("July 15, 2026");
    expect(formatEventDate("Aug 08, 2026")).toBe("August 08, 2026");
  });

  it("should keep full month date strings unchanged", () => {
    expect(formatEventDate("July 15, 2026")).toBe("July 15, 2026");
    expect(formatEventDate("August 08, 2026")).toBe("August 08, 2026");
    expect(formatEventDate("September 20, 2026")).toBe("September 20, 2026");
  });

  it("should return the original string if the date is invalid", () => {
    expect(formatEventDate("Not a Date")).toBe("Not a Date");
    expect(formatEventDate("")).toBe("");
  });
});

describe("Currency Rendering & Computation Checks", () => {
  it("should correctly format numbers to locale currency representation strings", () => {
    const price = 72000;
    const quantity = 2;
    const formatted = `Rs. ${(price * quantity).toLocaleString()}`;
    expect(formatted).toBe("Rs. 144,000");
  });
});
