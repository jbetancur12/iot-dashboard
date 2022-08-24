import { createThing, deleteThing, getThings, ThingData, ThingDataResponse } from '@app/api/thing.api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

const initialState: ThingDataResponse[] = [];

export const doCreateThing = createAsyncThunk('things/create', async (thingData: ThingData) => createThing(thingData));

export const doDeleteThing = createAsyncThunk('things/delete', async (thingId: string) => deleteThing(thingId));

export const retrieveThings = createAsyncThunk('things/retrieve', async () => getThings());

const thingSlice = createSlice({
  name: 'thing',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(retrieveThings.fulfilled, (state, action) => [...action.payload]);
    builder.addCase(doDeleteThing.fulfilled, (state, action) => {
      const index = state.findIndex(({ _id }) => _id === action.payload._id);
      state.splice(index, 1);
    });
  },
});

export default thingSlice.reducer;
