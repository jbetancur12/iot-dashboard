import { DayjsDatePicker } from '@app/components/common/pickers/DayjsDatePicker';
import { Col, DatePickerProps, Empty, Row, Space } from 'antd';
import { GradientStackedAreaChart } from './GradientStackedAreaChart';
import * as S from '@app/pages/uiComponentsPages/UIComponentsPage.styles';
import * as ST from './chartStyles';
import { Panel } from '@app/components/common/Collapse/Collapse';
import { useEffect, useRef, useState } from 'react';
import { AppDate } from '@app/constants/Dates';
import dayjs from 'dayjs';
import { getThingMeasurements, ThingMeasure } from '@app/api/thing.api';
import { setDefaultHandler } from 'workbox-routing';
import { useTheme } from 'styled-components';
import { useTranslation } from 'react-i18next';
import { Card } from '@app/components/common/Card/Card';
import { BaseChart, getChartColors } from '@app/components/common/charts/BaseChart';
import * as echarts from 'echarts';
import { useSearchParams } from 'react-router-dom';
import { Button } from '@app/components/common/buttons/Button/Button';
import ExcelExport from '../../../utils/ExcelExport';

import './Charts.css';

const dt: Date = new Date();
dt.setHours(dt.getHours() - 6);

// const ranges = ['Last Hour', '6 Hours', '1 Day', '1 Week', '1 Month', '3 Months', 'Custom'];
const ranges = ['lastHour', '6Hours', '1Day', '1Week', '1Month', '3Months', 'custom'];

interface ThingMeasurex {
  date: string;
  temperature: number;
  humidity: number;
}

const Charts = () => {
  const btnRef = useRef<HTMLButtonElement>(null);

  const [startDate, setStartDate] = useState<AppDate>(dayjs(dt));
  const [endDate, setEndDate] = useState<AppDate>(dayjs());
  const [range, setRange] = useState<String | undefined>('6Hours');
  const [custom, setCustom] = useState<Boolean>(false);
  const [maxMin, setMaxMin] = useState<Boolean>(false);
  const [average, setAverage] = useState<Boolean>(false);
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

  const newData: ThingMeasurex[] = [];
  data.forEach(function (obj: ThingMeasure) {
    newData.push({
      date: new Date(obj._id).toLocaleString(),
      temperature: Number(obj.averageT.toFixed(1)),
      humidity: Number(obj.averageH.toFixed(1)),
    });
  });

  const theme = useTheme();
  const { t } = useTranslation();

  const chartColors = theme.colors.charts;

  const handleClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const dt: Date = new Date();
    //const value = event.currentTarget.innerText;
    const value = event.currentTarget.dataset.value;

    setCustom(false);

    switch (value) {
      case 'lastHour':
        dt.setHours(dt.getHours() - 1);
        break;
      case '6Hours':
        dt.setHours(dt.getHours() - 6);
        break;
      case '1Day':
        dt.setHours(dt.getHours() - 24);
        break;
      case '1Week':
        dt.setHours(dt.getHours() - 168);
        break;
      case '1Month':
        dt.setHours(dt.getHours() - 730);
        break;
      case '3Months':
        dt.setHours(dt.getHours() - 2190);
        break;
      case 'custom':
        setCustom(true);
        dt.setHours(dt.getHours() - 6);
        break;

      default:
        break;
    }

    setStartDate(dayjs(dt));
    setRange(value);
  };

  const defaultOption = {
    color: getChartColors(theme),
  };

  const option = {
    tooltip: {
      valueFormatter: (value: number) => {
        console.log(value);
        return value.toFixed(1);
      },
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
          //color: theme.colors.text.main,
          formatter: '{value} °C',
        },
        axisLine: {
          show: true,
          lineStyle: {
            color: defaultOption.color[0],
            width: 2,
          },
        },
        axisTick: {
          show: true,
        },
      },
      {
        type: 'value',
        scale: true,
        name: 'H',
        axisLabel: {
          fontSize: theme.commonFontSizes.xxs,
          fontWeight: theme.commonFontWeight.light,
          formatter: '{value} %',
        },
        axisLine: {
          show: true,
          lineStyle: {
            color: defaultOption.color[1],
            width: 2,
          },
        },
        axisTick: {
          show: false,
        },
      },
    ],

    series: [
      {
        name: t('charts.temperature'),
        type: 'line',
        yAxisIndex: 0,
        smooth: true,
        sampling: 'average',
        lineStyle: {
          width: 2,
        },
        showSymbol: true,
        data: T,
        markPoint: maxMin && {
          symbolSize: 50,
          data: [
            { type: 'max', name: 'Max' },
            { type: 'min', name: 'Min' },
          ],
          label: {
            //formatter: '{b}\n{c}',
            formatter: function (param: any) {
              return param.value.toFixed(2) + ' °C' + ' - ' + D[param.data.coord[0]];
            },
          },
        },
        markLine: average && {
          data: [
            {
              // Use the same name with starting and ending point
              name: t('charts.averageValue'),
              type: 'average',
              label: {
                position: 'middle',
                formatter: '{b} - {c} °C',
              },
            },
          ],
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
        name: t('charts.humidity'),
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
      {/* <ST.containerDiv>
        {ranges.map((value) => (
          <ST.divWrapper $isSelected={range === value} onClick={handleClick} data-value={value}>
            {t(`charts.ranges.${value}`)}
          </ST.divWrapper>
        ))}
      </ST.containerDiv> */}

      <Space size="small" wrap style={{ marginBottom: '10px' }}>
        {ranges.map((value, idx) => (
          <ST.rangeButton
            type="primary"
            severity="info"
            $isSelected={range === value}
            onClick={handleClick}
            data-value={value}
            key={idx}
          >
            {t(`charts.ranges.${value}`)}
          </ST.rangeButton>
        ))}
        {custom && (
          <DayjsDatePicker.RangePicker
            allowClear={false}
            defaultValue={[dayjs(dt), dayjs()]}
            onChange={(dt: any) => {
              setStartDate(dt[0] as AppDate);
              setEndDate(dt[1] as AppDate);
            }}
          />
        )}

        <Button type="primary" severity="info" onClick={() => setMaxMin(!maxMin)}>
          Max/Min
        </Button>
        <Button type="primary" severity="info" onClick={() => setAverage(!average)}>
          {t('charts.averageValue')}
        </Button>

        <ExcelExport fileName={'Export - ' + Date.now()} excelData={newData}></ExcelExport>
      </Space>
      {/* {custom && (
        <ST.CollapseWrapper defaultActiveKey={['1']}>
          <Panel header={t('dateTimePickers.choose')} key="1">
            <Row gutter={[30, 30]}>
              <Col xs={24} xl={12}>
                <Col>
                  <S.Card title={t('dateTimePickers.since')}>
                    <DayjsDatePicker
                      onChange={(date) => setStartDate(date as AppDate)}
                      //showTime
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
                      //showTime
                      defaultValue={dayjs()}
                      allowClear={false}
                    />
                  </S.Card>
                </Col>
              </Col>
            </Row>
          </Panel>
        </ST.CollapseWrapper>
      )} */}

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
        {data.length > 0 ? (
          <BaseChart option={option} />
        ) : (
          <div style={{ marginTop: '30px' }}>
            <Empty />
          </div>
        )}
      </Card>
    </>
  );
};

export default Charts;
