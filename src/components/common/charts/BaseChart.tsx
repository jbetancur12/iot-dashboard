import {
  EChartsOption,
  default as EChartsReact,
  default as ReactECharts
} from 'echarts-for-react'
import React, { CSSProperties, useEffect, useRef, useState } from 'react'
import { DefaultTheme, useTheme } from 'styled-components'
import { Loading } from '../Loading'

export interface BaseChartProps {
  option?: EChartsOption
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onEvents?: Record<string, (e: any) => void>
  width?: string | number
  height?: string | number
  style?: CSSProperties
  classname?: string
}

interface DefaultTooltipStyles {
  borderColor: string
  borderWidth: number
  borderRadius: number
  textStyle: {
    fontWeight: number
    fontSize: number
    color: string
  }
}

export const getChartColors = (theme: DefaultTheme): string[] => [
  theme.colors.charts.color1,
  theme.colors.charts.color2,
  theme.colors.charts.color3,
  theme.colors.charts.color4,
  theme.colors.charts.color5
]

export const getDefaultTooltipStyles = (
  theme: DefaultTheme
): DefaultTooltipStyles => ({
  borderColor: theme.colors.charts.color1,
  borderWidth: 2,
  borderRadius: Number.parseInt(theme.border.radius),
  textStyle: {
    fontWeight: 600,
    fontSize: 16,
    color: theme.colors.charts.color1
  }
})

export const BaseChart: React.FC<BaseChartProps> = ({
  option,
  width,
  height,
  onEvents,
  style,
  ...props
}) => {
  const theme = useTheme()
  const [loading, setLoading] = useState(true)

  const chartRef = useRef<EChartsReact | null>(null)

  const chartHeight = height || '400px'

  const defaultOption = {
    color: getChartColors(theme)
  }

  useEffect(() => {
    setTimeout(() => {
      setLoading(!loading)
    }, 1000 / 2)
  }, [])

  const onLegendselectchanged = (params: any) => {
    const selected = params.selected
    const chartInstance = chartRef.current?.getEchartsInstance()

    if (chartInstance) {
      // @ts-ignore
      const legendData = chartInstance.getOption().legend[0].data
      const updatedOption = { ...option }
      legendData.forEach((label: string, index: number) => {
        updatedOption.yAxis[index].axisLine = { show: selected[label] }
        // updatedOption.yAxis[index].offset = selected[label] ? updatedOption.yAxis[index].offset : updatedOption.yAxis[index].offset - 40
      })
      chartInstance.setOption(updatedOption)
    }
  }

  return loading ? (
    <Loading />
  ) : (
    <ReactECharts
      ref={chartRef}
      {...props}
      option={{ ...defaultOption, ...option }}
      style={{
        ...style,
        height: chartHeight,
        minHeight: height === '100%' ? 400 : 'unset',
        width,
        zIndex: 0
      }}
      //   onEvents={{...onEvents,  legendselectchanged: onLegendselectchanged}}
      onEvents={{ ...onEvents, legendselectchanged: onLegendselectchanged }}
    />
  )
}
