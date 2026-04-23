import type {PropsWithChildren, ReactElement} from "react";
import {render} from "@testing-library/react";
import {MemoryRouter} from "react-router-dom";
import {ThemeProvider} from "@/features/theme/theme-provider";

type RenderWithProvidersOptions = {
  route?: string;
};

function Wrapper({
  children,
  route = "/"
}: PropsWithChildren<RenderWithProvidersOptions>) {
  return (
    <MemoryRouter initialEntries={[route]}>
      <ThemeProvider>{children}</ThemeProvider>
    </MemoryRouter>
  );
}

export function renderWithProviders(
  ui: ReactElement,
  options?: RenderWithProvidersOptions
) {
  return render(ui, {
    wrapper: ({children}) => <Wrapper {...options}>{children}</Wrapper>
  });
}
