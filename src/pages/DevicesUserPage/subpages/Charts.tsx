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
import { useSearchParams } from 'react-router-dom';

const dt: Date = new Date();
dt.setHours(dt.getHours() - 24);

const Charts = () => {
  const [startDate, setStartDate] = useState<AppDate>(dayjs(dt));
  const [endDate, setEndDate] = useState<AppDate>(dayjs());
  const [data, setData] = useState([]);
  let [searchParams] = useSearchParams();
  const mav = searchParams.get('mac');

  useEffect(() => {
    getThingMeasurements(startDate, endDate, mav).then(({ data }) => setData(data));
  }, [endDate, startDate]);

  const T: number[] = [];
  const H: number[] = [];
  const D: string[] = [];
  data.forEach((dt: ThingMeasure) => {
    const temp: number = dt.averageT;
    const hum: number = dt.averageH;

    T.push(temp);
    H.push(hum);
    D.push(new Date(dt._id).toLocaleString());
  });

  const theme = useTheme();
  const { t } = useTranslation();

  const chartColors = theme.colors.charts;

  const option = {
    tooltip: {
      valueFormatter: (value: number) => value.toFixed(1),
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
      containLabel: true,
    },
    xAxis: [
      {
        show: true,
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
    yAxis: [
      {
        type: 'value',
        name: 'T',
        scale: true,
        axisLabel: {
          fontSize: theme.commonFontSizes.xxs,
          fontWeight: theme.commonFontWeight.light,
          color: theme.colors.text.main,
          formatter: '{value} °C',
        },
        axisTick: {
          show: false,
        },
      },
      {
        type: 'value',
        scale: true,
        name: 'H',
        axisLabel: {
          fontSize: theme.commonFontSizes.xxs,
          fontWeight: theme.commonFontWeight.light,
          color: theme.colors.text.main,
          formatter: '{value} %',
        },
        axisTick: {
          show: false,
        },
      },
    ],

    series: [
      {
        name: 'Temperature',
        type: 'line',
        yAxisIndex: 0,
        smooth: true,
        lineStyle: {
          width: 2,
        },
        showSymbol: true,
        data: T,
        markPoint: {
          label: {
            formatter: '{b}\n{c}',
          },
        },
        // markLine: {
        //   data: [
        //     {
        //       name: 'average line',
        //       type: 'average',
        //       symbol: 'none',
        //       lineStyle: {
        //         color: '#FF0002',
        //       },
        //       label: {
        //         position: 'middle',
        //       },
        //     },
        //     {
        //       name: 'Horizontal line with Y value at 100',
        //       yAxis: 24,
        //       label: {
        //         position: 'middle',
        //       },
        //     },
        //   ],
        // },
      },

      {
        name: 'Humidity',
        type: 'line',
        //stack: 'Total',
        yAxisIndex: 1,
        smooth: true,
        lineStyle: {
          width: 2,
        },
        showSymbol: true,
        data: H,
        // markLine: {
        //   data: [
        //     {
        //       name: 'average line',
        //       type: 'average',
        //       symbol: 'none',
        //       lineStyle: {
        //         color: '#FF0000',
        //       },
        //       label: {
        //         position: 'middle',
        //       },
        //     },
        //     {
        //       name: 'Horizontal line with Y value at 100',
        //       yAxis: 90,
        //       label: {
        //         position: 'middle',
        //       },
        //     },
        //   ],
        // },
      },
    ],
  };

  return (
    <>
      <ST.CollapseWrapper defaultActiveKey={['1']}>
        <Panel header={t('dateTimePickers.choose')} key="1">
          <Row gutter={[30, 30]}>
            <Col xs={24} xl={12}>
              <Col>
                <S.Card title={t('dateTimePickers.since')}>
                  <DayjsDatePicker
                    onChange={(date) => setStartDate(date as AppDate)}
                    showTime
                    defaultValue={dayjs(dt)}
                    allowClear={false}
                  />
                </S.Card>
              </Col>
            </Col>
            <Col xs={24} xl={12}>
              <Col>
                <S.Card title={t('dateTimePickers.to')}>
                  <DayjsDatePicker
                    onChange={(date) => setEndDate(date as AppDate)}
                    showTime
                    defaultValue={dayjs()}
                    allowClear={false}
                  />
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
      <Card
        padding="0 0 1.875rem"
        //title={t('charts.gradientLabel')}
      >
        <BaseChart option={option} />
      </Card>
    </>
  );
};

export default Charts;
