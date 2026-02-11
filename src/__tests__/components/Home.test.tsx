import { render, screen } from "@testing-library/react";
import Home from "@/app/page";
import { describe, it, expect } from "vitest";

describe("Home Page", () => {
    it("renders the welcome text", () => {
        render(<Home />);
        const heading = screen.getByRole("heading", { level: 1 });
        expect(heading).toHaveTextContent("To get started, edit the page.tsx file.");
    });
});
