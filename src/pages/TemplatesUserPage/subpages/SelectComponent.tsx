import { Button } from '@app/components/common/buttons/Button/Button'
import { Select } from 'antd'
import React, { useState } from 'react'

export interface Sensor {
  _id: string
  name: string
  sensorType: string
  unit: string
  typePin: string
  customer: string
  template: string
  virtualPin: number
  createdAt: string
  updatedAt: string
}

interface SensorListProps {
  options: Sensor[]
  onSubmit: (selectedOptions: string[]) => void
  setVariablesQuery: (selectedOptions: string[]) => void
}

const SelectComponent: React.FC<SensorListProps> = ({
  options,
  onSubmit,
  setVariablesQuery
}) => {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([])
  const [numberOfTagsSelects, setNumberOfTagsSelects] = useState(0)

  const ops = options.map((op) => ({
    value: op._id,
    label: op.name
  }))

  const handleSelectChange = (value: any) => {
    if (value.length <= 5) {
      setSelectedOptions(value)
      setVariablesQuery(value)
      setNumberOfTagsSelects(value.length)
    }
  }

  const handleFormSubmit = () => {
    onSubmit(selectedOptions)
  }

  const isButtonDisabled = selectedOptions.length === 0 // Verificar si no hay tags seleccionados

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Select
          mode="tags"
          style={{ flex: '1', marginRight: '10px' }}
          value={selectedOptions}
          onChange={handleSelectChange}
          placeholder="Seleccione una o mas variables"
          maxTagCount={5}
          maxTagTextLength={25}>
          {ops.map((opcion) => (
            <Select.Option key={opcion.value} value={opcion.value}>
              {opcion.label}
            </Select.Option>
          ))}
        </Select>

        <Button
          type="primary"
          onClick={handleFormSubmit}
          disabled={isButtonDisabled}>
          Enviar
        </Button>
      </div>
      <span style={{ margin: '10px', fontSize: 12 }}>
        {numberOfTagsSelects} de 5 variables seleccionadas
      </span>
    </>
  )
}

export default SelectComponent
