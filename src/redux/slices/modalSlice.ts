import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ModalState {
  isOpen: boolean;
  plainText: string;
}

const initialState: ModalState = {
  isOpen: false,
  plainText: "",
};

const modalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    setIsOpen: (state, action: PayloadAction<boolean>) => {
      state.isOpen = action.payload;
    },
    setPlainText: (state, action: PayloadAction<string>) => {
      state.plainText = action.payload;
    },
  },
});

export const { setIsOpen, setPlainText } = modalSlice.actions;
export default modalSlice.reducer;
