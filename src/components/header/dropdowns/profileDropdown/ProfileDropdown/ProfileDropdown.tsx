import { useAppSelector } from '@app/hooks/reduxHooks'
import { useResponsive } from '@app/hooks/useResponsive'
import { Avatar, Col, Dropdown, Row } from 'antd'
import React from 'react'
import { ProfileOverlay } from '../ProfileOverlay/ProfileOverlay'
import * as S from './ProfileDropdown.styles'

export const ProfileDropdown: React.FC = () => {
  const { isTablet } = useResponsive()

  const user = useAppSelector((state) => state.user.user)

  return user ? (
    <Dropdown overlay={<ProfileOverlay />} trigger={['click']}>
      <S.ProfileDropdownHeader as={Row} gutter={[10, 10]} align="middle">
        <Col>
          {/* <Avatar src={user.imgUrl} alt="User" shape="circle" size={40} /> */}
          <Avatar size="large" style={{ verticalAlign: 'middle' }}>
            {`${user.firstName[0]}${user.lastName[0]}`}
          </Avatar>
        </Col>
        {/* {isTablet && (
          <Col>
            <H6>{`${user.firstName[0]}${user.lastName[0]}`}</H6>
          </Col>
        )} */}
      </S.ProfileDropdownHeader>
    </Dropdown>
  ) : null
}
