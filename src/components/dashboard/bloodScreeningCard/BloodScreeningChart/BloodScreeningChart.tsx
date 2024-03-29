import React, { useContext, useMemo } from 'react'
import { EChartsInstance } from 'echarts-for-react'
import { ThemeContext } from 'styled-components'
import { BaseChart } from '../../../common/charts/BaseChart'
import { Dates } from '@app/constants/Dates'
import { useResponsive } from 'hooks/useResponsive'

interface BloodScreeningChartsProps {
  data: number[]
}

export const BloodScreeningChart: React.FC<BloodScreeningChartsProps> = ({
  data
}) => {
  const themeContext = useContext(ThemeContext)
  const { isTablet, isDesktop, isMobile } = useResponsive()
  const months = Dates.getMonths()

  const option = {
    grid: {
      top: 27,
      bottom: 0,
      left: -20,
      right: -20
    },
    tooltip: {
      trigger: 'axis',
      formatter: function (label: EChartsInstance) {
        return `${label[0].axisValue}`
      },
      axisPointer: {
        show: false,
        lineStyle: {
          width: 0
        }
      }
    },
    xAxis: {
      type: 'category',
      data: months,
      show: false,
      lineStyle: {
        width: 0
      }
    },
    yAxis: {
      type: 'value',
      show: false,
      lineStyle: {
        width: 0
      }
    },
    series: [
      {
        data,
        type: 'line',
        smooth: true,
        showSymbol: false,
        symbol: 'circle',
        itemStyle: {
          color: themeContext.colors.charts.color5,
          borderColor: themeContext.colors.main.mainBackground,
          borderWidth: 5,
          shadowColor: themeContext.colors.shadow.color,
          shadowOffsetX: 0,
          shadowOffsetY: 5,
          opacity: 1
        },
        symbolSize: 18,
        areaStyle: {
          color: themeContext.colors.main.chartSecondaryGradient
        },
        lineStyle: {
          width: 2,
          color: themeContext.colors.main.error
        }
      }
    ]
  }

  const chartHeight = useMemo(
    () => (isDesktop && 100) || (isTablet && 200) || (isMobile && 100) || 100,
    [isTablet, isDesktop, isMobile]
  )

  return <BaseChart option={option} height={chartHeight} />
}
