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

  const handleChartRendered = (e: any) => {
    const chartInstance = e?.getEchartsInstance?.()
    console.log(chartInstance)
    // const series = chartInstance.getOption().series;

    // series.forEach((serie: any, index: number) => {
    //   const yAxisIndex = serie.yAxisIndex || 0;
    //   const yAxisColor = defaultOption.color[index % defaultOption.color.length];

    //   chartInstance.setOption({
    //     yAxis: {
    //       yAxisIndex: yAxisIndex,
    //       axisLine: {
    //         lineStyle: {
    //           color: yAxisColor,
    //         },
    //       },
    //     },
    //   });
    // });
  }

  useEffect(() => {
    // TODO FIXME workaround to make sure that parent container is initialized before the chart
    // if(chartRef.current){
    //     const chartInstance = chartRef.current.getEchartsInstance()
    //     const series = chartInstance.getOption().series as any[] || [];
    //     let colorIndex = 0;
    //     series.forEach((serie, index) => {
    //         // console.log("🚀 ~ file: BaseChart.tsx:112 ~ series.forEach ~ serie:", serie)
    //         const yAxisIndex = serie.yAxisIndex || 0;
    //         const yAxisColor = getChartColors(theme)[colorIndex % getChartColors(theme).length];

    //       console.log({
    //         yAxis: {
    //             yAxisIndex,
    //             axisLine: {
    //                 lineStyle: {
    //                     color: yAxisColor,
    //                 },
    //             },
    //         },
    //     })

    //         // chartInstance.setOption({
    //         //     yAxis: {
    //         //         yAxisIndex,
    //         //         axisLine: {
    //         //             lineStyle: {
    //         //                 color: yAxisColor,
    //         //             },
    //         //         },
    //         //     },
    //         // });
    //         colorIndex++;
    //     });
    //     // console.log("🚀 ~ file: BaseChart.tsx:99 ~ series.forEach ~ yAxisColor:", chartRef.current.getEchartsInstance().getOption())
    // }
    setTimeout(() => {
      setLoading(false)
    }, 1000 / 2)
  }, [])

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
      onEvents={onEvents}
    />
  )
}
