import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SectionState {
  activeSection: string | null;
}

const initialState: SectionState = {
  activeSection: null,
};

const sectionSlice = createSlice({
  name: "section",
  initialState,
  reducers: {
    setActiveSection: (state, action: PayloadAction<string | null>) => {
      state.activeSection = action.payload;
    },
  },
});

export const { setActiveSection } = sectionSlice.actions;
export default sectionSlice.reducer;