import mqtt, { IClientOptions, MqttClient, QoS } from 'mqtt'
import { createContext, useEffect, useState } from 'react'

export interface QosOptionType {
  label: string
  value: number
}

export const QosOption = createContext<QosOptionType[]>([])

const qosOption: QosOptionType[] = [
  {
    label: '0',
    value: 0
  },
  {
    label: '1',
    value: 1
  },
  {
    label: '2',
    value: 2
  }
]

const HookMqtt = () => {
  const [client, setClient] = useState<MqttClient | null>(null)
  const [isSubed, setIsSub] = useState(false)
  const [payload, setPayload] = useState<{ topic: string; message: string }>({
    topic: '',
    message: ''
  })
  const [connectStatus, setConnectStatus] = useState('Connect')

  const mqttConnect = (host: string, mqttOption?: IClientOptions) => {
    setConnectStatus('Connecting')
    setClient(mqtt.connect(host, mqttOption))
  }

  useEffect(() => {
    if (client) {
      client.on('connect', () => {
        setConnectStatus('Connected')
        console.log('connection successful')
      })

      client.on('error', (err: Error) => {
        console.error('Connection error: ', err)
        client.end()
      })

      client.on('reconnect', () => {
        setConnectStatus('Reconnecting')
      })

      client.on('message', (topic: string, message: Buffer) => {
        const payload = { topic, message: message.toString() }
        setPayload(payload)
      })
    }
  }, [client])

  const mqttDisconnect = () => {
    if (client) {
      try {
        client.end(false, () => {
          setConnectStatus('Connect')
          console.log('disconnected successfully')
        })
      } catch (error) {
        console.log('disconnect error:', error)
      }
    }
  }

  const mqttPublish = (context: {
    topic: string
    qos: QoS
    payload: string
  }) => {
    if (client) {
      const { topic, qos, payload } = context
      client.publish(topic, payload, { qos }, (error?: Error) => {
        if (error) {
          console.log('Publish error: ', error)
        }
      })
    }
  }

  const mqttSub = (subscription: { topic: string[]; qos: QoS }) => {
    if (client) {
      const { topic, qos } = subscription
      client.subscribe(topic, { qos }, (error?: Error) => {
        if (error) {
          console.log('Subscribe to topics error', error)
          return
        }
        console.log(`Subscribe to topics: ${topic}`)
        setIsSub(true)
      })
    }
  }

  const mqttUnSub = (subscription: { topic: string; qos: number }) => {
    if (client) {
      const { topic, qos } = subscription
      client.unsubscribe(topic, { qos }, (error?: Error) => {
        if (error) {
          console.log('Unsubscribe error', error)
          return
        }
        console.log(`unsubscribed topic: ${topic}`)
        setIsSub(false)
      })
    }
  }

  return {
    client,
    isSubed,
    payload,
    connectStatus,
    mqttConnect,
    mqttDisconnect,
    mqttPublish,
    mqttSub,
    mqttUnSub
  }
}

export default HookMqtt
