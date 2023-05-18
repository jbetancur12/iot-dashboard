import { Typography } from 'antd'
import React from 'react'

const { Text } = Typography

interface NumericDataProps {
  value: { value: string | number; date: string }
  label?: string
}

const NumericData: React.FC<NumericDataProps> = ({ value, label }) => {
  return (
    <div>
      {label && <Text strong>{label} </Text>}
      <br />
      <Text>{value ? value.value : 0}</Text>
      <h6 style={{ color: 'gray', marginTop: '16px' }}>
        {value ? value.date : 0}
      </h6>
    </div>
  )
}

export default NumericData
