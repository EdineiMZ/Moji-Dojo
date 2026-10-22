import { createContext, useContext } from 'react';
import type { View } from 'react-native';

/** Algo que sabe se medir dentro da rolagem (View, TextInput...). */
export type ScrollTarget = Pick<View, 'measureLayout'>;

type ScrollIntoView = (target: ScrollTarget | null) => void;

/** O `Screen` fornece uma função que rola até um campo (ex.: ao focar um TextInput com o teclado aberto). */
export const ScrollIntoViewContext = createContext<ScrollIntoView>(() => undefined);

export const useScrollIntoView = (): ScrollIntoView => useContext(ScrollIntoViewContext);
