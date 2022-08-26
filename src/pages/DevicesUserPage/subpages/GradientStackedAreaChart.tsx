import React from 'react';
import { useTheme } from 'styled-components';
import { useTranslation } from 'react-i18next';
import * as echarts from 'echarts';
import { BaseChart } from '@app/components/common/charts/BaseChart';
import { Card } from '@app/components/common/Card/Card';

export const GradientStackedAreaChart: React.FC = () => {
  const theme = useTheme();
  const { t } = useTranslation();

  const chartColors = theme.colors.charts;

  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        label: {
          backgroundColor: chartColors.tooltipLabel,
        },
      },
    },
    legend: {
      data: [`coal`].map((item) => t(`charts.${item}`)),
      top: 0,
      left: 10,
      textStyle: {
        color: theme.colors.text.main,
      },
    },
    grid: {
      top: 80,
      left: 20,
      right: 20,
      bottom: 0,
      containLabel: true,
    },
    xAxis: [
      {
        type: 'category',
        boundaryGap: false,
        data: ['Canada', 'China', 'Russia', 'Australia', 'Germany', 'France'],
        axisLabel: {
          fontSize: theme.commonFontSizes.xxs,
          fontWeight: theme.commonFontWeight.light,
          color: theme.colors.main.primary,
        },
      },
    ],
    yAxis: [
      {
        type: 'value',
        name: 'TWh',
        axisLabel: {
          fontSize: theme.commonFontSizes.xxs,
          fontWeight: theme.commonFontWeight.light,
          color: theme.colors.text.main,
        },
      },
    ],
    series: [
      {
        name: t('charts.coal'),
        type: 'line',
        stack: 'Total',
        smooth: true,
        lineStyle: {
          width: 0,
        },
        showSymbol: false,
        areaStyle: {
          opacity: 0.8,
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: chartColors.color1,
            },
            {
              offset: 1,
              color: chartColors.color1Tint,
            },
          ]),
        },
        emphasis: {
          focus: 'series',
        },
        data: [140, 232, 101, 264, 90, 340, 250],
      },
    ],
  };

  return (
    <Card padding="0 0 1.875rem" title={t('charts.gradientLabel')}>
      <BaseChart option={option} />
    </Card>
  );
};
