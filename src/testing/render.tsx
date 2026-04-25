import {useState, type PropsWithChildren, type ReactElement} from "react";
import {render} from "@testing-library/react";
import {Provider as ReduxProvider} from "react-redux";
import {MemoryRouter} from "react-router-dom";
import {ThemeProvider} from "@/features/theme/theme-provider";
import {createAppStore, type AppStore} from "@/state/store";

type RenderWithProvidersOptions = {
  route?: string;
};

function Wrapper({
  children,
  route = "/"
}: PropsWithChildren<RenderWithProvidersOptions>) {
  const [store] = useState<AppStore>(() => createAppStore());

  return (
    <ReduxProvider store={store}>
      <MemoryRouter initialEntries={[route]}>
        <ThemeProvider>{children}</ThemeProvider>
      </MemoryRouter>
    </ReduxProvider>
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
