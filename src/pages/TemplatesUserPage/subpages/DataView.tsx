import React, { useEffect, useState } from 'react'

import { getTemplate, getTemplateMeasurements } from '@app/api/template.api'
import { VariableData } from '@app/api/variable.api'
import { Card } from '@app/components/common/Card/Card'
import { Loading } from '@app/components/common/Loading'
import { Button } from '@app/components/common/buttons/Button/Button'
import {
  BaseChart,
  getChartColors
} from '@app/components/common/charts/BaseChart'
import { DayjsDatePicker } from '@app/components/common/pickers/DayjsDatePicker'
import { AppDate } from '@app/constants/Dates'
import { Space } from 'antd'
import dayjs from 'dayjs'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router-dom'
import { useTheme } from 'styled-components'
import * as ST from '../../DevicesUserPage/subpages/chartStyles'
import { DataItem } from './Ch'
import SelectComponent, { Sensor } from './SelectComponent'
import Test2 from './Test2'

function findIndexWithMostKeys(data: Record<string, any>[]): number {
  let maxKeys = 0
  let maxKeysIndex = -1

  for (let i = 0; i < data.length; i++) {
    const keys = Object.keys(data[i])
    if (keys.length > maxKeys) {
      maxKeys = keys.length
      maxKeysIndex = i
    }
  }

  return maxKeysIndex
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

const DataView = () => {
  const theme = useTheme()
  const { t } = useTranslation()

  const chartColors = theme.colors.charts

  let [searchParams] = useSearchParams()

  const [startDate, setStartDate] = useState<AppDate>(dayjs(dt))
  const [endDate, setEndDate] = useState<AppDate>(dayjs())
  const [range, setRange] = useState<String | undefined>('6Hours')
  const [custom, setCustom] = useState<Boolean>(false)
  const [data, setData] = useState<ISeries[]>([])
  const [variables, setVariables] = useState<VariableData[]>([])
  const [maxMin, setMaxMin] = useState<Boolean>(false)
  const [loadingChart, setLoadingChart] = useState(false)
  const [ai, setAi] = useState<Sensor[]>([])
  const templateId = searchParams.get('template')
  const customerId = searchParams.get('customer')

  let dimensions: Set<string> = new Set<string>(['product'])

  const source: DataItem[] = data.map((d: any) => {
    const { timestamp, measurements } = d
    const variables = Object.keys(measurements)
    variables.forEach((v: string) => dimensions.add(v))
    return { product: new Date(timestamp).toLocaleString(), ...measurements }
  })

  const xData = source.length > 0 ? source.map((item) => item.product) : []

  const _series =
    source.length > 0 &&
    Object.keys(source[findIndexWithMostKeys(source)])
      .filter((key, index) => key !== 'product')
      .map((key, index) => ({
        name: key,
        type: 'line',
        smooth: true,
        data: source.map((item) => item[key] as number),
        yAxisIndex: index,
        markPoint: maxMin && {
          symbolSize: 50,
          data: [
            { type: 'max', name: 'Max' },
            { type: 'min', name: 'Min' }
          ],
          label: {
            //formatter: '{b}\n{c}',
            formatter: function (param: any) {
              return param.value.toFixed(2) //+ ' - ' + xData[param.data.coord[0]]
            }
          }
        }
        //   lineStyle: {
        //     color: 'blue', // Color de la serie 1 y del primer eje Y
        //   },
      }))
  let colorIndex = 0
  let marginIndex = 0
  const yAxis =
    source.length > 0 &&
    Object.keys(source[findIndexWithMostKeys(source)])
      .filter((key) => key !== 'product')
      .map((key, index) => {
        marginIndex = index
        const yAxisColor =
          getChartColors(theme)[colorIndex % getChartColors(theme).length]
        colorIndex++
        return {
          type: 'value',
          //   name: key,
          scale: true,
          position: 'left',
          offset: index * 40,
          axisLine: {
            // Configura la línea del eje Y
            show: true,
            lineStyle: {
              color: yAxisColor
            }
          },
          splitLine: {
            // Configura las líneas de división del eje Y
            show: true
          }
          //   gridIndex: index,
        }
      })

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

  const _option = {
    tooltip: {
      valueFormatter: (value: number) => {
        if (value == undefined) return 0
        return value.toFixed(1)
      },
      //   // @ts-ignore
      //   formatter: function(params: echarts.EChartOption.Tooltip.Format[]) {
      //     let tooltipContent = '';
      //     // Iterar sobre cada objeto en el array de `params`
      //    params.forEach(param => {
      //       // Obtener el valor del dato en el tooltip
      //       const value = param.value;

      //       // Especificar la unidad
      //       const unit = 'kg'; // Cambia 'kg' por la unidad deseada

      //       // Formatear el contenido del tooltip con la unidad
      //       const formattedValue = `${param.seriesName}: ${value} ${unit}`;
      //       tooltipContent += formattedValue + '<br>';
      //     });
      //     return tooltipContent;
      //     // Unir los valores formateados con un salto de línea
      //   },
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        label: {
          backgroundColor: chartColors.tooltipLabel
        }
      }
    },
    legend: {
      data:
        source.length > 0 &&
        Object.keys(source[findIndexWithMostKeys(source)]).filter(
          (key) => key !== 'product'
        )
    },
    xAxis: {
      type: 'category',
      data: xData
    },
    yAxis: yAxis,
    grid: {
      top: 80,
      left: Math.abs(marginIndex * 40 - 100),
      right: 20,
      bottom: 0,
      containLabel: true
    },
    series: _series
  }

  const fetchData = (
    startDate: AppDate,
    endDate: AppDate,
    templateId: string | null,
    queryString: string
  ) => {
    getTemplateMeasurements(startDate, endDate, templateId, queryString).then(
      ({ data }) => {
        setLoadingChart(false)
        setData(data)
      }
    )
  }

  useEffect(() => {
    setLoadingChart(true)

    // getTemplateMeasurements(startDate, endDate, templateId).then(({ data }) => {
    //   setLoadingChart(false)
    //   setData(data)
    // })
    getTemplate(templateId).then((data) => {
      setVariables(data.variables)
      const analogInputs = data.variables.filter(
        (obj) => obj.typePin === 'analogInput'
      )
      setAi(analogInputs as Sensor[])
      const firstVar = analogInputs[0] as Sensor
      //   fetchData(startDate, endDate, templateId, firstVar._id)
    })

    return () => {}
  }, [endDate, startDate])

  const rows = Math.ceil(variables.length / 5)

  const outputs = variables.filter((obj) => obj.typePin === 'digitalOutput')

  const handleFormSubmit = (selectedOptions: string[]) => {
    // Aquí puedes realizar la llamada a la API y enviar las selecciones
    const queryString = selectedOptions.join(',')

    fetchData(startDate, endDate, templateId, queryString)
  }

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
        <Button
          type="primary"
          severity="info"
          onClick={() => setMaxMin(!maxMin)}>
          Max/Min
        </Button>

        {/* <Button type="primary" severity="info" onClick={() => setMaxMin(!maxMin)}>
          Max/Min
        </Button>
        <Button type="primary" severity="info" onClick={() => setAverage(!average)}>
          {t('charts.averageValue')}
        </Button>

        <ExcelExport fileName={'Export - ' + Date.now()} excelData={newData}></ExcelExport> */}
      </Space>

      <SelectComponent options={ai} onSubmit={handleFormSubmit} />

      <Card
        padding="0"
        style={{ marginBottom: '16px' }}
        //title={t('charts.gradientLabel')}
      >
        {data.length === 0 ? (
          <span
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: 200
            }}>
            Seleccione al menos una variable
          </span>
        ) : !loadingChart ? (
          //@ts-ignore
          <BaseChart option={_option} />
        ) : (
          <Loading />
        )}
      </Card>

      <Test2
        rows={rows}
        variables={variables}
        outputs={outputs}
        templateId={templateId}
        customerId={customerId}
      />
    </>
  )
}

export default DataView
