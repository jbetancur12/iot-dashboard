import {
  createThing,
  deleteThing,
  getThings,
  ThingData,
  ThingDataResponse,
  updateThing
} from '@app/api/thing.api'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { stamenTerrain } from 'pigeon-maps/lib/providers'

interface ThingState {
  things: ThingDataResponse[]
  loading: 'idle' | 'pending' | 'succeeded' | 'failed'
}

const initialState = {
  things: [],
  loading: 'idle'
} as ThingState

export const doCreateThing = createAsyncThunk(
  'things/create',
  async (thingData: ThingData) => createThing(thingData)
)

export const doUpdateThing = createAsyncThunk(
  'things/update',
  async ({ id, data }: { id: string | undefined; data: ThingData }) =>
    updateThing(id, data)
)

export const doDeleteThing = createAsyncThunk(
  'things/delete',
  async (thingId: string) => deleteThing(thingId)
)

export const retrieveThings = createAsyncThunk('things/retrieve', async () =>
  getThings()
)

const thingSlice = createSlice({
  name: 'thing',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(retrieveThings.fulfilled, (state, action) => {
      return { ...state, things: action.payload }
    })
    builder.addCase(doDeleteThing.fulfilled, (state, action) => {
      const index = state.things.findIndex(
        ({ _id }) => _id === action.payload._id
      )
      state.things.splice(index, 1)
    })
  }
})

export default thingSlice.reducer
