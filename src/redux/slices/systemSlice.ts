import { SubCategory } from "@/types/category.types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SystemData {
  systemData: SubCategory | null;
}

const initialState: SystemData = {
  systemData: null,
};

const systemSlice = createSlice({
  name: "systemData",
  initialState,
  reducers: {
    setSystemData: (state, action: PayloadAction<SubCategory | null>) => {
      state.systemData = action.payload;
    },
    clearSystemData: (state) => {
      state.systemData = null;
    },
  },
});

export const { setSystemData, clearSystemData } = systemSlice.actions;
export default systemSlice.reducer;
