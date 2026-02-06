import { createSlice } from "@reduxjs/toolkit";

const propertySlice = createSlice({
  name: "property",
  initialState: {
    properties: [],
    totalProperties: 0,
    searchParams: {},
    error: null,
    loading: true, // ✅ IMPORTANT: true on first load
  },
  reducers: {
    // When API request starts
    getRequest(state) {
      state.loading = true;
      state.error = null;
    },

    // When API request is successful
    getProperties(state, action) {
      state.properties = action.payload.data;
      state.totalProperties = action.payload.all_properties;
      state.loading = false;
    },

    // Update search / pagination params
    updateSearchParams(state, action) {
      state.searchParams =
        Object.keys(action.payload).length === 0
          ? {}
          : {
              ...state.searchParams,
              ...action.payload,
            };
    },

    // When API request fails
    getErrors(state, action) {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const propertyAction = propertySlice.actions;
export default propertySlice;
