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
    timestamp: string;
    avgValue: Number
}

interface ISeries {
    timestamp: string;
    measurements: {}
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
    const [data, setData] = useState<ISeries[]>([]); 

    function generateChartTypeArray(size: number):any[] {
        if (size <= 1) return [];
        let chartTypeArray = new Array(size - 1).fill({ type: 'line' });
        return chartTypeArray;
     }

    let dimensions: Set<string> = new Set<string>(['product']);

    

    const source = data.map((d:any) => {
        const { timestamp, measurements } = d;
        const variables = Object.keys(measurements)
        variables.forEach((v: string)  => dimensions.add(v))
        return  {product: new Date(timestamp).toLocaleString(), ...measurements }
    })


    const series = generateChartTypeArray(dimensions.size)

 

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

        dataset: {
            // Provide a set of data.
  
            dimensions: Array.from(dimensions),
            source: source
          },

        tooltip: {
          valueFormatter: (value: number) => {
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
            axisLabel: {
              fontSize: theme.commonFontSizes.xxs,
              fontWeight: theme.commonFontWeight.light,
              color: theme.colors.main.primary,
            },
          },
        ],
        yAxis: {},
    
        series: series
      };
      
      console.log(option)

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
