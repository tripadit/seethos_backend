import { create, SetState } from 'zustand';

export type State = {
  botStep: number | undefined;
  setBotStep: (step: number) => void;
  resetBotStep: () => void;
  isDemoAccount: boolean;
  setIsDemoAccount: (isDemoAccount: boolean) => void;
};

export const useStore = create<State>((set: SetState<State>) => ({
  isDemoAccount: false,
  botStep: undefined,
  resetBotStep: () =>
    set((state) => ({
      ...state,
      botStep: undefined,
    })),
  setBotStep: (step: number) =>
    set((state) => ({
      ...state,
      botStep: step,
    })),
  setIsDemoAccount: (isDemoAccount: boolean) =>
    set((state) => ({
      ...state,
      isDemoAccount,
    })),
}));
