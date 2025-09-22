import { store } from "@/store";
import React, { ReactNode } from "react";
import { Provider } from "react-redux";

interface AppProviderProps {
  children: ReactNode;
}

export default function AppProvider({ children }: AppProviderProps) {
  return <Provider store={store}>{children}</Provider>;
}
