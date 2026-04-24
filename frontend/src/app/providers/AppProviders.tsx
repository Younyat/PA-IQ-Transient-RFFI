import { PropsWithChildren } from "react";
import { PreferencesProvider } from "./PreferencesProvider";

export function AppProviders({ children }: PropsWithChildren) {
  return <PreferencesProvider>{children}</PreferencesProvider>;
}
