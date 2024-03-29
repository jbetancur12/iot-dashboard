import React from 'react'
import { Col, Row } from 'antd'
import { NotificationsDropdown } from '../dropdowns/notificationsDropdown/NotificationsDropdown'
import { ProfileDropdown } from '../dropdowns/profileDropdown/ProfileDropdown/ProfileDropdown'
import { HeaderSearch } from '../HeaderSearch/HeaderSearch'
import { SettingsDropdown } from '../dropdowns/settingsDropdown/SettingsDropdown'
import * as S from '../Header/Header.styles'

interface MobileHeaderProps {
  toggleSider: () => void
  isSiderOpened: boolean
}

export const MobileHeader: React.FC<MobileHeaderProps> = ({
  toggleSider,
  isSiderOpened
}) => {
  return (
    <Row justify="space-between" align="middle">
      <Col>
        <ProfileDropdown />
      </Col>

      <Col>
        <Row align="middle">
          <Col>
            <NotificationsDropdown />
          </Col>

          <Col>
            <HeaderSearch />
          </Col>

          <Col>
            <SettingsDropdown />
          </Col>
        </Row>
      </Col>

      <S.BurgerCol>
        <S.MobileBurger onClick={toggleSider} isCross={isSiderOpened} />
      </S.BurgerCol>
    </Row>
  )
}
