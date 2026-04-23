import type {PropsWithChildren} from "react";
import {ThemeProvider} from "@/features/theme/theme-provider";

export function AppProvider({children}: PropsWithChildren) {
  return <ThemeProvider>{children}</ThemeProvider>;
}
