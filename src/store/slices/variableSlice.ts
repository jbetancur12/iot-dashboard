import {
  VariableData,
  VariableDataResponse,
  createVariable,
  deleteVariable,
  getVariable,
  getVariables,
  updateVariable
} from '@app/api/variable.api'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

interface VariableState {
  variables: any[]
  loading: 'idle' | 'pending' | 'succeeded' | 'failed'
}

const initialState = {
  variables: [],
  loading: 'idle'
} as VariableState

export const doCreateVariable = createAsyncThunk(
  'variables/create',
  async (variableData: VariableData) => createVariable(variableData)
)

export const doUpdateVariable = createAsyncThunk(
  'variables/update',
  async ({ id, data }: { id: string | undefined; data: VariableData }) =>
    updateVariable(id, data)
)

export const doDeleteVariable = createAsyncThunk(
  'variables/delete',
  async (variableId: string) => deleteVariable(variableId)
)

export const retrieveVariables = createAsyncThunk(
  'variables/retrieve',
  async () => getVariables()
)

export const retrieveVariable = createAsyncThunk(
  'variables/retrieveOne',
  async (variableId: any) => getVariable(variableId)
)

const variableSlice = createSlice({
  name: 'variable',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(retrieveVariables.fulfilled, (state, action) => {
      return { ...state, variables: action.payload }
    })
    builder.addCase(doCreateVariable.fulfilled, (state, action) => {
      state.variables.push(action.payload)
    })
    builder.addCase(doUpdateVariable.fulfilled, (state, action) => {
      const tt = state.variables.map((_) => {
        if (_._id === action.payload._id) {
          return action.payload
        }
        return _
      })
      return { ...state, variables: tt }
    })
    builder.addCase(doDeleteVariable.fulfilled, (state, action) => {
      const index = state.variables.findIndex(
        ({ _id }) => _id === action.payload._id
      )
      state.variables.splice(index, 1)
    })
  }
})

export default variableSlice.reducer
