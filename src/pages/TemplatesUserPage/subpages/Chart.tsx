import React, { useContext, useEffect, useState } from 'react'

import {
  TemplateDataResponse,
  getTemplate,
  getTemplateMeasurements
} from '@app/api/template.api'
import { AppDate } from '@app/constants/Dates'
import dayjs from 'dayjs'
import { useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useTheme } from 'styled-components'
import {
  BaseChart,
  getChartColors
} from '@app/components/common/charts/BaseChart'
import { Col, Empty, Row, Space, message } from 'antd'
import { Button } from '@app/components/common/buttons/Button/Button'
import { DayjsDatePicker } from '@app/components/common/pickers/DayjsDatePicker'
import ExcelExport from '../../../utils/ExcelExport'
import * as ST from '../../DevicesUserPage/subpages/chartStyles'
import { Card } from '@app/components/common/Card/Card'
import NumericDisplay from '../components/NumericDisplay'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@app/store/store'
import { createMqttClient } from '@app/utils/mqtt'
import { setClient } from '@app/store/slices/mqttSlice'
import OptionsDropdown from '../components/OptionsDropdown'
import { VariableData } from '@app/api/variable.api'

interface Meas {
  variableName: string
  variableUnit: string
  timestamp: string
  avgValue: Number
}

interface ISeries {
  timestamp: string
  measurements: {}
}

const dt: Date = new Date()
dt.setHours(dt.getHours() - 6)

const ranges = [
  'lastHour',
  '6Hours',
  '1Day',
  '1Week',
  '1Month',
  '3Months',
  'custom'
]

const Chart = () => {
  const theme = useTheme()
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const { client, error } = useSelector((state: RootState) => state.mqtt)

  const chartColors = theme.colors.charts

  let [searchParams] = useSearchParams()

  const [startDate, setStartDate] = useState<AppDate>(dayjs(dt))
  const [endDate, setEndDate] = useState<AppDate>(dayjs())
  const [range, setRange] = useState<String | undefined>('6Hours')
  const [custom, setCustom] = useState<Boolean>(false)
  const [data, setData] = useState<ISeries[]>([])
  const [variables, setVariables] = useState<VariableData[]>([])
  const [mqttData, setMqttData] = useState<string>('No data yet')
  const [mqttDataObj, setMqttDataObj] = useState<any>({})
  const [mqttInputObj, setMqttInputObj] = useState<any>({ 0: '0,0' })
  const templateId = searchParams.get('template')

  const handleOnMessage = (topic: string, message: Buffer) => {
    const data = message.toString().split('/')
    if (data[1] === templateId) {
      const IncomingData = { [data[2]]: data[3] }
      setMqttDataObj({ ...mqttDataObj, [data[2]]: data[3] })
    }

    setMqttData(message.toString()) // Actualizar el estado local con los datos recibidos
  }

  function generateChartTypeArray(size: number): any[] {
    if (size <= 1) return []
    let chartTypeArray = new Array(size - 1).fill({ type: 'line' })
    return chartTypeArray
  }

  let dimensions: Set<string> = new Set<string>(['product'])

  const source = data.map((d: any) => {
    const { timestamp, measurements } = d
    const variables = Object.keys(measurements)
    variables.forEach((v: string) => dimensions.add(v))
    return { product: new Date(timestamp).toLocaleString(), ...measurements }
  })

  const series = generateChartTypeArray(dimensions.size)

  const handleOutput = (vp?: number, msg?: string, customer?: string) => {
    console.log(vp, msg)
    client?.publish(
      'input',
      `${customer}/${templateId}/${Date.now()}/${vp}/${msg}`
    )
  }

  const handleClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const dt: Date = new Date()
    //const value = event.currentTarget.innerText;
    const value = event.currentTarget.dataset.value

    setCustom(false)

    switch (value) {
      case 'lastHour':
        dt.setHours(dt.getHours() - 1)
        break
      case '6Hours':
        dt.setHours(dt.getHours() - 6)
        break
      case '1Day':
        dt.setHours(dt.getHours() - 24)
        break
      case '1Week':
        dt.setHours(dt.getHours() - 168)
        break
      case '1Month':
        dt.setHours(dt.getHours() - 730)
        break
      case '3Months':
        dt.setHours(dt.getHours() - 2190)
        break
      case 'custom':
        setCustom(true)
        dt.setHours(dt.getHours() - 6)
        break

      default:
        break
    }

    setStartDate(dayjs(dt))
    setRange(value)
  }

  const defaultOption = {
    color: getChartColors(theme)
  }

  const option = {
    dataset: {
      // Provide a set of data.

      dimensions: Array.from(dimensions),
      source: source
    },

    tooltip: {
      valueFormatter: (value: number) => {
        return value.toFixed(1)
      },
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        label: {
          backgroundColor: chartColors.tooltipLabel
        }
      }
    },
    legend: {
      // data: [`coal`].map((item) => t(`charts.${item}`)),
      // data: [`Temperature`, `Humedad`].map((item) => item),
      // top: 0,
      // left: 10,
      // textStyle: {
      //     color: theme.colors.text.main,
      // },
    },
    grid: {
      top: 80,
      left: 20,
      right: 20,
      bottom: 0,
      containLabel: true
    },
    xAxis: [
      {
        show: true,
        type: 'category',
        boundaryGap: false,
        axisLabel: {
          fontSize: theme.commonFontSizes.xxs,
          fontWeight: theme.commonFontWeight.light,
          color: theme.colors.main.primary
        }
      }
    ],
    yAxis: {},

    series: series
  }

  useEffect(() => {
    getTemplateMeasurements(startDate, endDate, templateId).then(({ data }) =>
      setData(data)
    )
    getTemplate(templateId).then((data) => setVariables(data.variables))

    if (!client) {
      dispatch(
        createMqttClient('wss://mqtt.smaf.com.co:8081', ['json', 'output'], {
          clientId:
            'mqtt-react-test-' + Math.random().toString(16).substring(2, 8),
          username: 'smaf',
          password: 'smaf310'
        })
      )
      client
    } else {
      client?.publish('input', `12345678/${templateId}/0/0/update`)
    }

    return () => {
      if (client) {
        client.end()
        // @ts-ignore
        dispatch(setClient(undefined))
      }
    }
  }, [endDate, startDate, client, dispatch])

  useEffect(() => {
    // Actualizar el estado local con los datos recibidos del topic
    const onMessage = (topic: string, message: string) => {
      const data = message.toString().split('/')
      if (data[1] === templateId && topic === 'sensor') {
        const IncomingData = { ...mqttDataObj, [data[3]]: data[4] }
        setMqttDataObj((prevData: any) => ({ ...prevData, [data[3]]: data[4] }))
      }

      if (topic === 'output') {
        console.log('XXXXXX', data)
        const receivedData = {
          pinVirtual: data[3],
          operationStatus: data[4].split(',')[0],
          operation: data[4].split(',')[1]
        }

        setMqttInputObj((prevData: any) => ({
          ...prevData,
          [data[3]]: data[4]
        }))
      }

      setMqttData(message.toString())
    }

    client?.on('message', onMessage)

    // Retornar una función de limpieza para remover el listener cuando se desmonte el componente
    return () => {
      client?.removeListener('message', onMessage)
    }
  }, [client])

  const rows = Math.ceil(variables.length / 5)

  const outputs = variables.filter((obj) => obj.typePin === 'digitalOutput')

  return (
    <>
      <Space size="small" wrap style={{ marginBottom: '10px' }}>
        {ranges.map((value, idx) => (
          <ST.rangeButton
            type="primary"
            severity="info"
            $isSelected={range === value}
            onClick={handleClick}
            data-value={value}
            key={idx}>
            {t(`charts.ranges.${value}`)}
          </ST.rangeButton>
        ))}
        {custom && (
          <DayjsDatePicker.RangePicker
            allowClear={false}
            defaultValue={[dayjs(dt), dayjs()]}
            onChange={(dt: any) => {
              setStartDate(dt[0] as AppDate)
              setEndDate(dt[1] as AppDate)
            }}
          />
        )}

        {/* <Button type="primary" severity="info" onClick={() => setMaxMin(!maxMin)}>
          Max/Min
        </Button>
        <Button type="primary" severity="info" onClick={() => setAverage(!average)}>
          {t('charts.averageValue')}
        </Button>

        <ExcelExport fileName={'Export - ' + Date.now()} excelData={newData}></ExcelExport> */}
      </Space>

      <Card
        padding="0"
        style={{ marginBottom: '16px' }}
        //title={t('charts.gradientLabel')}
      >
        {data.length > 0 ? (
          <BaseChart option={option} />
        ) : (
          <div style={{ marginTop: '30px' }}>
            <Empty />
          </div>
        )}
      </Card>

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
            if (v.typePin !== 'output' && v.typePin !== 'digitalOutput') {
              return (
                <Col xs={24} sm={12} md={8} lg={6} xl={4} key={i}>
                  <Card style={{ textAlign: 'center' }}>
                    {/* @ts-ignore */}
                    <NumericDisplay
                      value={mqttDataObj[v.virtualPin]}
                      label={v.name}
                    />
                  </Card>
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

export default Chart
