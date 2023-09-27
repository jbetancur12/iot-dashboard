import { Button, Card, Dropdown, Menu, MenuProps, Typography } from 'antd'
import React, { useEffect, useState } from 'react'
import { CSSProperties } from 'styled-components'

const { Text } = Typography

interface IProps {
  name?: string
  virtualPin?: number
  customer: string
  states: any

  handleOutput: (vp?: number, msg?: string, customer?: string) => void
}

const OptionsDropdown: React.FC<IProps> = ({
  name,
  handleOutput,
  virtualPin,
  customer,
  states
}) => {
  const [selectedOption, setSelectedOption] = useState<string | undefined>('  ')
  const [buttonColor, setButtonColor] = useState<string>('gray')
  const [stateColor, setStateColor] = useState<string>('gray')
  const [actualState, setActualState] = useState({ state: 0, operation: 0 })
  const [loading, setLoading] = useState(true)

  const handleMenuClick: MenuProps['onClick'] = (e) => {
    setLoading(false)
    handleOutput(virtualPin, e.key, customer)

    // actualizar el color del botón
    switch (e.key) {
      case '1':
        // setButtonColor('green')
        setSelectedOption('On')
        break
      case '0':
        // setButtonColor('red')
        setSelectedOption('Off')
        break
      case '2':
        // setButtonColor('orange')
        setSelectedOption('Auto')
        break
      default:
        // setButtonColor('gray')
        break
    }
  }

  const menu = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item key="1">On</Menu.Item>
      <Menu.Item key="0">Off</Menu.Item>
      <Menu.Item key="2">Auto</Menu.Item>
    </Menu>
  )

  const buttonText = selectedOption ? `${name} : ${selectedOption}` : name
  const cardStyle: CSSProperties = {
    display: 'flex',
    flexDirection: 'column', // establecer la dirección del eje principal en columna
    justifyContent: 'center',
    alignItems: 'center'
    //width: 'fit-content', // establecer el ancho al tamaño del contenido
  }
  const headStyle: CSSProperties = { borderBottom: 'none' }

  useEffect(() => {
    if (states[virtualPin as number] === undefined) return
    const aState = states[virtualPin as number].split(',')
    setActualState({ state: aState[0], operation: aState[1] })

    switch (aState[0]) {
      case '0':
        setButtonColor('#b31414')
        break
      case '1':
        if (aState[1] === '1') {
          setButtonColor('orange')
        } else {
          setButtonColor('green')
        }
        break
      default:
        setButtonColor('gray')
        break
    }

    switch (aState[1]) {
      case '0':
        setStateColor('#b31414')
        setSelectedOption('Off')
        setLoading(false)
        break
      case '1':
        setStateColor('orange')
        setSelectedOption('On')
        setLoading(false)
        break
      case '2':
        setStateColor('green')
        setSelectedOption('Auto')
        setLoading(false)
        break
      default:
        setStateColor('gray')
        break
    }
  }, [states])

  return (
    <Card title={name} style={cardStyle} headStyle={headStyle}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <div
          style={{
            width: '30px',
            height: '30px',
            borderRadius: '50%',
            backgroundColor: buttonColor,
            marginRight: '5px'
          }}
        />
        <Dropdown overlay={menu} placement="bottomCenter">
          <Button
            style={{ backgroundColor: stateColor, color: 'white' }}
            loading={loading}>
            {selectedOption}
          </Button>
        </Dropdown>
      </div>
    </Card>
  )
}

export default OptionsDropdown
