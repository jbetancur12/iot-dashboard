import { Col, Row } from 'antd'
import React from 'react'
import { HeaderSearch } from '../HeaderSearch/HeaderSearch'
import { ProfileDropdown } from '../dropdowns/profileDropdown/ProfileDropdown/ProfileDropdown'
import { SettingsDropdown } from '../dropdowns/settingsDropdown/SettingsDropdown'

import * as S from '../Header/Header.styles'

interface DesktopHeaderProps {
  isTwoColumnsLayout: boolean
}

export const DesktopHeader: React.FC<DesktopHeaderProps> = ({
  isTwoColumnsLayout
}) => {
  const leftSide = isTwoColumnsLayout ? (
    <S.SearchColumn lg={16}>
      <Row justify="space-between">
        <Col xl={15} xxl={12}>
          <HeaderSearch />
        </Col>
        <Col>{/* <S.GHButton /> */}</Col>
      </Row>
    </S.SearchColumn>
  ) : (
    <>
      <Col lg={10} xxl={8}>
        <HeaderSearch />
      </Col>
      <Col>{/* <S.GHButton /> */}</Col>
    </>
  )

  return (
    <Row justify="space-between" align="middle">
      {/* {leftSide} */}
      <div />

      <S.ProfileColumn xl={8} xxl={8} $isTwoColumnsLayout={isTwoColumnsLayout}>
        <Row align="middle" justify="end" gutter={[30, 30]}>
          <Col>
            <Row gutter={[15, 15]}>
              <Col>{/* <NotificationsDropdown /> */}</Col>

              <Col>
                <SettingsDropdown />
              </Col>
            </Row>
          </Col>

          <Col>
            <ProfileDropdown />
          </Col>
        </Row>
      </S.ProfileColumn>
    </Row>
  )
}
