import { BaseChart } from '@app/components/common/charts/BaseChart'

export interface DataItem {
  product: string
  [key: string]: number | string
}

const Ch = (source: DataItem[]) => {
  console.log('🚀 ~ file: Ch.tsx:10 ~ Ch ~ source:', source)

  const _series = Object.keys(source[0])
    .filter((key) => key !== 'product')
    .map((key) => ({
      name: key,
      type: 'line',
      data: source.map((item) => item[key] as number),
      yAxisIndex: 0
    }))

  const yAxis = Object.keys(source[0])
    .filter((key) => key !== 'product')
    .map((key, index) => ({
      type: 'value',
      name: key,
      gridIndex: index
    }))

  const _option = {
    title: {
      text: 'Gráfico de ejemplo'
    },
    legend: {
      data: Object.keys(source[0]).filter((key) => key !== 'product')
    },
    xAxis: {
      type: 'category',
      data: source.map((item) => item.product)
    },
    yAxis: yAxis,
    grid: yAxis.map((_, index) => ({
      containLabel: true
    })),
    series: _series
  }

  return <BaseChart option={_option} />
}

export default Ch
