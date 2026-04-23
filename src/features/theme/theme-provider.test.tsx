import {screen} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {describe, expect, it} from "vitest";
import {renderWithProviders} from "@/testing/render";
import {
  THEME_STORAGE_KEY,
  useTheme
} from "@/features/theme/theme-provider";

function ThemeHarness() {
  const {theme, toggleTheme} = useTheme();

  return (
    <div>
      <p>{theme}</p>
      <button onClick={toggleTheme} type="button">
        Toggle
      </button>
    </div>
  );
}

describe("ThemeProvider", () => {
  it("uses system preference when no stored theme exists", () => {
    window.localStorage.removeItem(THEME_STORAGE_KEY);

    renderWithProviders(<ThemeHarness />);

    expect(screen.getByText("dark")).toBeInTheDocument();
    expect(document.documentElement.classList.contains("dark")).toBe(true);
  });

  it("toggles theme and persists it to localStorage", async () => {
    const user = userEvent.setup();

    window.localStorage.setItem(THEME_STORAGE_KEY, "light");

    renderWithProviders(<ThemeHarness />);

    await user.click(screen.getByRole("button", {name: "Toggle"}));

    expect(screen.getByText("dark")).toBeInTheDocument();
    expect(window.localStorage.getItem(THEME_STORAGE_KEY)).toBe("dark");
  });
});
