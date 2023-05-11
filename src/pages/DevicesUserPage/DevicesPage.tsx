import { getUserThings, ThingDataResponse } from '@app/api/thing.api'
import { readUser } from '@app/services/localStorage.service'
import { Col, Row } from 'antd'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import * as S from './DevicesPage.styles'

const DevicesPage: React.FC = () => {
  const userId = readUser()?.id

  const [things, setThings] = useState<ThingDataResponse[]>([])

  useEffect(() => {
    getUserThings(userId).then((res) => setThings(res))
  }, [])

  return (
    <Row gutter={[30, 30]}>
      {things.map((thing) => (
        <Col xs={24} xl={8} key={thing._id}>
          {/* <Link to={`charts?user=${userId}&mac=${thing.mac}`}> */}
          <Link
            to={{
              pathname: 'charts',
              search: `?user=${userId}&mac=${thing.mac}`
            }}>
            <S.DeviceCard key={thing._id}>
              <S.Title>{thing.name}</S.Title>
              <S.Text>{thing.mac}</S.Text>
            </S.DeviceCard>
          </Link>
        </Col>
      ))}
    </Row>
  )
}

export default DevicesPage
