import { VariableData } from '@app/api/variable.api'
import { Col, Row } from 'antd'
import { QoS } from 'mqtt'
import React, { useContext, useEffect, useState } from 'react'
import * as S from '../TemplatesUserPage.styles'
import NumericDisplay from '../components/NumericDisplay'
import OptionsDropdown from '../components/OptionsDropdown'
import HookMqtt, { QosOption, QosOptionType } from './TestMqtt'

interface Props {
  templateId: string | null
  customerId: string | null
  rows: number
  variables: VariableData[]
  outputs: VariableData[]
}

function formatDateTime(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')

  const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
  return formattedDate
}

const MqttComponent: React.FC<Props> = ({
  templateId = '644e996039ca466fcc4a6a54',
  rows,
  variables,
  outputs,
  customerId
}) => {
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [mqttDataObj, setMqttDataObj] = useState<any>({})
  const [mqttInputObj, setMqttInputObj] = useState<any>({ 0: '0,0' })
  const {
    client,
    isSubed,
    payload,
    connectStatus,
    mqttConnect,
    mqttDisconnect,
    mqttPublish,
    mqttSub,
    mqttUnSub
  } = HookMqtt()

  // Ejemplo de cómo usar el contexto QosOption
  const qosOptions: QosOptionType[] = useContext(QosOption)

  // Resto de la lógica y el JSX de tu componente
  // ...

  useEffect(() => {
    const protocol = 'wss'
    const host = 'mqtt.smaf.com.co'
    const port = 8081
    const clientId = 'emqx_react_' + Math.random().toString(16).substring(2, 8)
    const username = 'smaf'
    const password = 'smaf310'

    const url = `${protocol}://${host}:${port}`

    const options = {
      clientId,
      username,
      password,
      clean: true,
      reconnectPeriod: 1000, // ms
      connectTimeout: 30 * 1000 // ms
    }

    mqttConnect(url, options)

    return () => {
      mqttDisconnect()
    }
  }, [])

  useEffect(() => {
    if (connectStatus === 'Connected' && !isSubscribed) {
      const subscription = {
        topic: ['sensor', 'output'],
        qos: 0 as QoS
      }
      const context = {
        topic: 'input',
        qos: 0 as QoS,
        payload: `${customerId}/${templateId}/0/0/update`
      }

      mqttSub(subscription)
      mqttPublish(context)
      setIsSubscribed(true)
    }
  }, [connectStatus, isSubscribed])

  useEffect(() => {
    if (payload.topic === 'sensor') {
      const data = payload.message.toString().split('/')
      if (data[1] === templateId) {
        setMqttDataObj((prevData: any) => ({
          ...prevData,
          [data[3]]: { value: data[4], date: formatDateTime(new Date()) }
        }))
      }
    }

    if (payload.topic === 'output') {
      const data = payload.message.toString().split('/')
      if (data[1] === templateId) {
        setMqttInputObj((prevData: any) => ({
          ...prevData,
          [data[3]]: data[4]
        }))
      }
    }
  }, [payload.topic, payload.message, templateId])

  const handleOutput = (vp?: number, msg?: string, customer?: string) => {
    const context = {
      topic: 'input',
      qos: 0 as QoS,
      payload: `${customer}/${templateId}/${Date.now()}/${vp}/${msg}`
    }

    mqttPublish(context)
  }

  return (
    <>
      {Array.from({ length: rows }, (_, i) => (
        <Row
          gutter={[16, 16]}
          key={i}
          style={{
            marginBottom: '16px',
            display: 'flex',
            justifyContent: 'center'
          }}>
          {variables.slice(i * 5, (i + 1) * 5).map((v, i) => {
            if (v.typePin !== 's' && v.typePin !== 'digitals') {
              return (
                <Col xs={24} sm={12} md={8} lg={6} xl={4} key={i}>
                  <S.TemplateCard style={{ textAlign: 'center', padding: 0 }}>
                    {/* @ts-ignore */}
                    <NumericDisplay
                      value={mqttDataObj[v.virtualPin]}
                      label={v.name}
                    />
                  </S.TemplateCard>
                </Col>
              )
            }
          })}
        </Row>
      ))}
      <Row gutter={[16, 16]}>
        {outputs &&
          outputs.map((o, i) => (
            <Col key={i} xs={24} sm={12} md={8} lg={6} xl={4}>
              <div style={{ width: '100%' }}>
                <OptionsDropdown
                  name={o.name}
                  handleOutput={handleOutput}
                  virtualPin={o.virtualPin}
                  customer={o.customer}
                  states={mqttInputObj}
                />
              </div>
            </Col>
          ))}
      </Row>
    </>
  )
}

export default MqttComponent
