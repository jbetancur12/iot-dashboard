import React, { useEffect, useState } from 'react'

import { getTemplateMeasurements } from '@app/api/template.api';
import { AppDate } from '@app/constants/Dates';
import dayjs from 'dayjs';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'styled-components';
import {BaseChart, getChartColors } from '@app/components/common/charts/BaseChart';
import { Empty, Space } from 'antd';
import { Button } from '@app/components/common/buttons/Button/Button';
import { DayjsDatePicker } from '@app/components/common/pickers/DayjsDatePicker';
import ExcelExport from '../../../utils/ExcelExport';
import * as ST from '../../DevicesUserPage/subpages/chartStyles';
import { Card } from '@app/components/common/Card/Card';

interface Meas {
    variableName: string;
    variableUnit: string;
    timestamp: Date;
    avgValue: Number
}


const dt: Date = new Date();
dt.setHours(dt.getHours() - 6);

const ranges = ['lastHour', '6Hours', '1Day', '1Week', '1Month', '3Months', 'custom'];

const Chart = () => {

    const theme = useTheme();
    const { t } = useTranslation();

    const chartColors = theme.colors.charts;

    let [searchParams] = useSearchParams();

    const [startDate, setStartDate] = useState<AppDate>(dayjs(dt));
    const [endDate, setEndDate] = useState<AppDate>(dayjs());
    const [range, setRange] = useState<String | undefined>('6Hours');
    const [custom, setCustom] = useState<Boolean>(false);
    const [data, setData] = useState([]);
    // console.log("🚀 ~ file: Chart.tsx:22 ~ Chart ~ data:", data)
    //@ts-ignored
    var holder = {};

    var obj = [
        { 'name': 'P1', 'value': 150 },
        { 'name': 'P1', 'value': 150 },
        { 'name': 'P2', 'value': 200 },
        { 'name': 'P3', 'value': 450 }
    ];

    const yu = [
        { "variableName": "Test", "variableUnit": "N", "timestamp": "2023-04-30T01:15:00.000Z", "avgValue": 28 }, 
        { "variableName": "Humedad", "variableUnit": "ºC", "timestamp": "2023-04-30T00:15:00.000Z", "avgValue": 80 }, 
        { "variableName": "Test", "variableUnit": "N", "timestamp": "2023-04-30T00:15:00.000Z", "avgValue": 28 }, 
        { "variableName": "Test", "variableUnit": "N", "timestamp": "2023-04-30T00:30:00.000Z", "avgValue": 28 }, 
        { "variableName": "Humedad", "variableUnit": "ºC", "timestamp": "2023-04-30T00:00:00.000Z", "avgValue": 80 }, 
        { "variableName": "Humedad", "variableUnit": "ºC", "timestamp": "2023-04-30T01:45:00.000Z", "avgValue": 80 }, 
        { "variableName": "Humedad", "variableUnit": "ºC", "timestamp": "2023-04-30T01:30:00.000Z", "avgValue": 80 }
    ]

    var holder = {};

    let D = new Set<Date>([]);
    
    data.forEach(function (d:Meas) {
        if (holder.hasOwnProperty(d.variableName)) {
            //@ts-ignored
            holder[d.variableName].push({
                variableUnit: d.variableUnit,
                timeStamp: d.timestamp,
                value: d.avgValue
            });
            D.add(d.timestamp)
        } else {
            //@ts-ignored
            holder[d.variableName] = [{
                variableUnit: d.variableUnit,
                timeStamp: d.timestamp,
                value: d.avgValue
            }];
            
            D.add(d.timestamp)
        }
    });

    const _variablesNames = Object.keys(holder)

    var obj2 = [];

    for (var prop in holder) {
        //@ts-ignored
        obj2.push({ name: prop, value: holder[prop] });
    }
    // console.log("🚀 ~ file: Chart.tsx:48 ~ y ~ y:", obj2)

    const series = _variablesNames.map(dt => {
        const name = dt
        //@ts-ignored
        const data: number[] = []
         //@ts-ignored
        holder[dt].forEach(element => {
            data.push(element.value)
        });

        return {
              name: name,
              type: 'line',
              yAxisIndex: 1,
              smooth: true,
              lineStyle: {
                width: 2,
              },
              showSymbol: true,
              
              data: data,
            }
          
    })

    console.log(series)

 

    const templateId = searchParams.get('template');

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
    
        series: series
      };

    useEffect(() => {
        getTemplateMeasurements(startDate, endDate, templateId).then(({ data }) => setData(data));
    }, [endDate, startDate]);

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

                {/* <Button type="primary" severity="info" onClick={() => setMaxMin(!maxMin)}>
          Max/Min
        </Button>
        <Button type="primary" severity="info" onClick={() => setAverage(!average)}>
          {t('charts.averageValue')}
        </Button>

        <ExcelExport fileName={'Export - ' + Date.now()} excelData={newData}></ExcelExport> */}
            </Space>

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
    )
}

export default Chart
