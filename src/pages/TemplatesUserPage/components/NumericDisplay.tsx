import { InfoCircleOutlined } from '@ant-design/icons'
import { Tooltip, Typography } from 'antd'
import React, { useState } from 'react'

const { Text } = Typography

interface NumericDataProps {
  value: { value: string | number; date: string }
  label?: string
  sensorType?: string
  virtualPin?: number
  unit?: string
}

const NumericData: React.FC<NumericDataProps> = ({
  value,
  label,
  sensorType,
  virtualPin,
  unit
}) => {
  const [isTooltipVisible, setTooltipVisible] = useState(false)

  const handleTooltipVisibleChange = (visible: boolean) => {
    setTooltipVisible(visible)
  }
  return (
    <div>
      <Tooltip
        title={
          <div>
            <p>
              <strong>Virtual Pin:</strong> {virtualPin ? virtualPin : 'NA'}
            </p>
            <p>
              <strong>Tipo Sensor:</strong> {sensorType ? sensorType : 'NA'}
            </p>
          </div>
        }
        visible={isTooltipVisible}
        onVisibleChange={handleTooltipVisibleChange}>
        <InfoCircleOutlined
          style={{
            position: 'absolute',
            top: 5,
            right: 5,
            cursor: 'pointer'
          }}
        />
      </Tooltip>
      {label && <Text strong>{label} </Text>}
      <br />
      <Text>{value ? `${value.value} ${unit}` : 0}</Text>
      <h6 style={{ color: 'gray', marginTop: '16px' }}>
        {value ? value.date : 0}
      </h6>
    </div>
  )
}

export default NumericData
