import type {PropsWithChildren} from "react";
import {Provider as ReduxProvider} from "react-redux";
import {ThemeProvider} from "@/features/theme/theme-provider";
import {appStore} from "@/state/store";

export function AppProvider({children}: PropsWithChildren) {
  return (
    <ReduxProvider store={appStore}>
      <ThemeProvider>{children}</ThemeProvider>
    </ReduxProvider>
  );
}
