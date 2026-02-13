import { createContext, useContext } from "react";

export type FieldContextValue = {
  isFocused: boolean;
  setIsFocused: (focused: boolean) => void;
  isFilled: boolean;
  setIsFilled: (filled: boolean) => void;
  hasError: boolean;
  setHasError: (error: boolean) => void;
};

export const FieldContext = createContext<FieldContextValue | null>(null);

export function useFieldContext() {
  const context = useContext(FieldContext);
  return context;
}
