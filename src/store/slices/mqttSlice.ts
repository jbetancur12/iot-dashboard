import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import mqtt, { MqttClient, IClientOptions } from 'mqtt';

interface IMqttState {
  client?: MqttClient;
  error?: Error;
}

const initialState: IMqttState = {};

const mqttSlice = createSlice({
  name: 'mqtt',
  initialState,
  reducers: {
    setClient(state, action: PayloadAction<MqttClient>) {
      state.client = action.payload;
    },
    setError(state, action: PayloadAction<Error>) {
      state.error = action.payload;
    },
  },
});

export const { setClient, setError } = mqttSlice.actions;

export default mqttSlice.reducer;
