import { DayjsDatePicker } from '@app/components/common/pickers/DayjsDatePicker';
import { Col, DatePickerProps, Row } from 'antd';
import { GradientStackedAreaChart } from './GradientStackedAreaChart';
import * as S from '@app/pages/uiComponentsPages/UIComponentsPage.styles';
import * as ST from './chartStyles';
import { Panel } from '@app/components/common/Collapse/Collapse';
import { useEffect, useState } from 'react';
import { AppDate } from '@app/constants/Dates';
import dayjs from 'dayjs';
import { getThingMeasurements, ThingMeasure } from '@app/api/thing.api';
import { setDefaultHandler } from 'workbox-routing';
import { useTheme } from 'styled-components';
import { useTranslation } from 'react-i18next';
import { Card } from '@app/components/common/Card/Card';
import { BaseChart } from '@app/components/common/charts/BaseChart';
import * as echarts from 'echarts';

const dt: Date = new Date();
dt.setHours(dt.getHours() - 24);

const Charts = () => {
  const [startDate, setStartDate] = useState<AppDate>(dayjs(dt));
  const [endDate, setEndDate] = useState<AppDate>(dayjs());
  const [data, setData] = useState([]);

  useEffect(() => {
    getThingMeasurements(startDate, endDate, 'EC:62:60:93:7A:98').then(({ data }) => setData(data));
  }, [endDate, startDate]);

  const T: number[] = [];
  const D: string[] = [];
  data.forEach((dt: ThingMeasure) => {
    T.push(dt.averageT);
    D.push(new Date(dt._id).toLocaleString());
  });

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
      // data: [`coal`].map((item) => t(`charts.${item}`)),
      data: [`Temperature`].map((item) => item),
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
        show: false,
        type: 'category',
        boundaryGap: false,
        data: D,
        axisLabel: {
          fontSize: theme.commonFontSizes.xxs,
          fontWeight: theme.commonFontWeight.light,
          color: theme.colors.main.primary,
        },
      },
    ],
    yAxis: {
      type: 'value',
      name: 'C',
      scale: true,
      axisLabel: {
        fontSize: theme.commonFontSizes.xxs,
        fontWeight: theme.commonFontWeight.light,
        color: theme.colors.text.main,
      },
      axisTick: {
        show: false,
      },
    },

    series: [
      {
        // name: t('charts.coal'),
        name: 'Temperature',
        type: 'line',
        stack: 'Total',
        smooth: true,
        lineStyle: {
          width: 2,
        },
        showSymbol: true,
        // areaStyle: {
        //   opacity: 0.8,
        //   color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
        //     {
        //       offset: 0,
        //       color: chartColors.color1,
        //     },
        //     {
        //       offset: 1,
        //       color: chartColors.color1Tint,
        //     },
        //   ]),
        // },
        // emphasis: {
        //   focus: 'series',
        // },
        data: T,
      },
    ],
  };

  return (
    <>
      <ST.CollapseWrapper defaultActiveKey={['1']}>
        <Panel header="Choose Date" key="1">
          <Row gutter={[30, 30]}>
            <Col xs={24} xl={12}>
              <Col>
                <S.Card title="Since">
                  <DayjsDatePicker
                    onChange={(date) => setStartDate(date as AppDate)}
                    showTime
                    defaultValue={dayjs(dt)}
                  />
                </S.Card>
              </Col>
            </Col>
            <Col xs={24} xl={12}>
              <Col>
                <S.Card title="To">
                  <DayjsDatePicker onChange={(date) => setEndDate(date as AppDate)} showTime defaultValue={dayjs()} />
                </S.Card>
              </Col>
            </Col>
          </Row>
        </Panel>
      </ST.CollapseWrapper>

      {/* <Row gutter={[30, 30]}>
        <Col xs={24} xl={12}>
          <Col>
            <S.Card title="Since">
              <DayjsDatePicker />
              <DayjsDatePicker.TimePicker />
            </S.Card>
          </Col>
        </Col>
        <Col xs={24} xl={12}>
          <Col>
            <S.Card title="To">
              <DayjsDatePicker />
              <DayjsDatePicker.TimePicker />
            </S.Card>
          </Col>
        </Col>
      </Row> */}
      <Card padding="0 0 1.875rem" title={t('charts.gradientLabel')}>
        <BaseChart option={option} />
      </Card>
    </>
  );
};

export default Charts;
