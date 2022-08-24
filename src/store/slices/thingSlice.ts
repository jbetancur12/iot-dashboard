import { createThing, ThingData } from '@app/api/thing.api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

const initialState: ThingData[] = [];

export const doCreateThing = createAsyncThunk('things/create', async (thingData: ThingData) => createThing(thingData));

const thingSlice = createSlice({
  name: 'thing',
  initialState,
  reducers: {},
});

export default thingSlice.reducer;
