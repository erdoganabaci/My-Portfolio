import userEvent from "@testing-library/user-event";
import {screen} from "@testing-library/react";
import {describe, expect, it} from "vitest";
import {SiteHeader} from "@/features/portfolio/components/site-header";
import {renderWithProviders} from "@/testing/render";

describe("SiteHeader", () => {
  it("renders the main navigation anchors and chat link", async () => {
    const user = userEvent.setup();

    renderWithProviders(<SiteHeader />);

    const mobileMenuButton = screen.queryByRole("button", {
      name: /open navigation menu/i
    });

    if (mobileMenuButton) {
      await user.click(mobileMenuButton);
    }

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
