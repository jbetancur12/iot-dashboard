import { Dispatch } from 'redux'
// import { setClient, setError } from '';
import { setClient, setError } from '@app/store/slices/mqttSlice'
import mqtt, { IClientOptions } from 'mqtt'

export const createMqttClient =
  (url: string, topics: string[], options?: IClientOptions) =>
  (dispatch: Dispatch) => {
    const client = mqtt.connect(url, {
      ...options,
      reconnectPeriod: 1000,
      connectTimeout: 30 * 1000,
      rejectUnauthorized: false
    })

    client.on('connect', () => {
      console.log('Connected to MQTT broker')
      dispatch(setClient(client))
      client.subscribe(topics)
      client.setMaxListeners(20)
    })

    client.on('error', (error: Error) => {
      console.error('MQTT error:', error)
      dispatch(setError(error))
    })

    return client
  }
