import {render, screen} from "@testing-library/react";
import {RouterProvider} from "react-router-dom";
import {describe, expect, it} from "vitest";
import {createTestRouter} from "@/app/router";
import {AppProvider} from "@/app/providers/app-provider";

describe("app router", () => {
  it("renders the portfolio route on /", async () => {
    render(
      <AppProvider>
        <RouterProvider router={createTestRouter(["/"])} />
      </AppProvider>
    );

    expect(
      await screen.findByRole("heading", {name: /Hi all, I'm Erdogan/i})
    ).toBeInTheDocument();
  });

  it("renders the chat route on /chat", async () => {
    render(
      <AppProvider>
        <RouterProvider router={createTestRouter(["/chat"])} />
      </AppProvider>
    );

    expect(
      await screen.findByRole("heading", {name: "Chat with Erdogan's profile"})
    ).toBeInTheDocument();
  });
});
