import {
  TemplateData,
  TemplateDataResponse,
  createTemplate,
  deleteTemplate,
  getTemplate,
  getTemplates,
  updateTemplate,
} from '@app/api/template.api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

interface TemplateState {
  templates: any[];
  loading: 'idle' | 'pending' | 'succeeded' | 'failed';
}

const initialState = {
  templates: [],
  loading: 'idle',
} as TemplateState;

export const doCreateTemplate = createAsyncThunk('templates/create', async (templateData: TemplateData) =>
  createTemplate(templateData),
);

export const doUpdateTemplate = createAsyncThunk(
  'templates/update',
  async ({ id, data }: { id: string | undefined; data: TemplateData }) => updateTemplate(id, data),
);

export const doDeleteTemplate = createAsyncThunk('templates/delete', async (templateId: string) =>
  deleteTemplate(templateId),
);

export const retrieveTemplates = createAsyncThunk('templates/retrieve', async () => getTemplates());

export const retrieveTemplate = createAsyncThunk('templates/retrieveOne', async (templateId: any) =>
  getTemplate(templateId),
);

const templateSlice = createSlice({
  name: 'template',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(retrieveTemplates.fulfilled, (state, action) => {
      return { ...state, templates: action.payload };
    });
    builder.addCase(doCreateTemplate.fulfilled, (state, action) => {
      state.templates.push(action.payload);
    });
    builder.addCase(doUpdateTemplate.fulfilled, (state, action) => {
      const tt = state.templates.map((_) => {
        if (_._id === action.payload._id) {
          return action.payload;
        }
        return _;
      });
      return { ...state, templates: tt };
    });
    builder.addCase(doDeleteTemplate.fulfilled, (state, action) => {
      const index = state.templates.findIndex(({ _id }) => _id === action.payload._id);
      state.templates.splice(index, 1);
    });
  },
});

export default templateSlice.reducer;
