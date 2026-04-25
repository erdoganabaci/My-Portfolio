import {configureStore} from "@reduxjs/toolkit";
import {chatReducer} from "@/features/chat/state/chat-slice";

export function createAppStore() {
  return configureStore({
    reducer: {
      chat: chatReducer
    }
  });
}

export const appStore = createAppStore();

export type AppStore = ReturnType<typeof createAppStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
