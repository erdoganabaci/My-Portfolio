import {screen} from "@testing-library/react";
import {describe, expect, it} from "vitest";
import {HomeRoute} from "@/features/portfolio/routes/home-route";
import {renderWithProviders} from "@/testing/render";

describe("HomeRoute", () => {
  it("renders the portfolio shell and core sections", () => {
    renderWithProviders(<HomeRoute />);

    expect(
      screen.getByRole("heading", {name: /Hi all, I'm Erdogan/i})
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {name: "What I do"})
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {name: "Professional experience"})
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {name: "Selected repositories"})
    ).toBeInTheDocument();

    const monaGenLink = screen.getByRole("link", {name: /monagenie\.com/i});
    expect(monaGenLink).toHaveAttribute("href", "https://monagenie.com/");
    expect(monaGenLink).toHaveAttribute("target", "_blank");

    const auroraLink = screen.getByRole("link", {name: /auroragenie\.com/i});
    expect(auroraLink).toHaveAttribute("href", "https://auroragenie.com/");
    expect(auroraLink).toHaveAttribute("target", "_blank");
  });
});
