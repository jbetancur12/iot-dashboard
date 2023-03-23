import { createVariable, getVariables, VariableDataResponse, VariableData, updateVariable, deleteVariable } from '@app/api/variable.api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { stamenTerrain } from 'pigeon-maps/lib/providers';

interface VariableState {
  variables: VariableDataResponse[];
  loading: 'idle' | 'pending' | 'succeeded' | 'failed';
}

const initialState = {
  variables: [],
  loading: 'idle',
} as VariableState;

export const doCreateVariable = createAsyncThunk('variables/create', async (variableData: VariableData) => createVariable(variableData));

export const doUpdateVariable = createAsyncThunk(
  'variables/update',
  async ({ id, data }: { id: string | undefined; data: VariableData }) => updateVariable(id, data),
);

export const doDeleteVariable = createAsyncThunk('variables/delete', async (variableId: string) => deleteVariable(variableId));

export const retrieveVariables = createAsyncThunk('variables/retrieve', async () => getVariables());

const variableSlice = createSlice({
  name: 'variable',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(retrieveVariables.fulfilled, (state, action) => {
      return { ...state, variables: action.payload };
    });
    builder.addCase(doDeleteVariable.fulfilled, (state, action) => {
      const index = state.variables.findIndex(({ _id }) => _id === action.payload._id);
      state.variables.splice(index, 1);
    });
  },
});

export default variableSlice.reducer;
