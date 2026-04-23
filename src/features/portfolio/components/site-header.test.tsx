import {screen} from "@testing-library/react";
import {describe, expect, it} from "vitest";
import {SiteHeader} from "@/features/portfolio/components/site-header";
import {renderWithProviders} from "@/testing/render";

describe("SiteHeader", () => {
  it("renders the main navigation anchors and chat link", () => {
    renderWithProviders(<SiteHeader />);

    expect(screen.getByRole("link", {name: "Skills"})).toHaveAttribute(
      "href",
      "#skills"
    );
    expect(screen.getByRole("link", {name: "Experience"})).toHaveAttribute(
      "href",
      "#experience"
    );
    expect(screen.getByRole("link", {name: /chat/i})).toHaveAttribute(
      "href",
      "/chat"
    );
  });
});
