import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Col } from 'antd'
import { useTheme } from 'styled-components'
import { MinusOutlined, PlusOutlined } from '@ant-design/icons'
import { Progress } from '@app/components/common/Progress/Progress'
import {
  Button,
  ButtonGroup
} from '@app/components/common/buttons/Button/Button'
import { PageTitle } from '@app/components/common/PageTitle/PageTitle'
import * as S from '@app/pages/uiComponentsPages//UIComponentsPage.styles'

const ProgressPage: React.FC = () => {
  const [percent, setPercent] = useState<number>(0)
  const theme = useTheme()
  const { t } = useTranslation()

  const dynamicSuccessColor = useMemo(
    () =>
      percent === 100 ? theme.colors.main.success : theme.colors.main.primary,
    [percent, theme.colors.main]
  )

  const increase = () => {
    let newPercent = percent + 10
    if (newPercent > 100) {
      newPercent = 100
    }
    setPercent(newPercent)
  }

  const decrease = () => {
    let newPercent = percent - 10
    if (newPercent < 0) {
      newPercent = 0
    }
    setPercent(newPercent)
  }

  return (
    <>
      <PageTitle>{t('common.progress')}</PageTitle>
      <Col>
        <S.Card title={t('progress.basic')}>
          <Progress percent={30} strokeColor={theme.colors.main.primary} />
          <Progress
            percent={50}
            status="active"
            strokeColor={theme.colors.main.primary}
          />
          <Progress
            percent={70}
            status="exception"
            strokeColor={theme.colors.main.error}
          />
          <Progress percent={100} strokeColor={theme.colors.main.success} />
          <Progress
            percent={50}
            showInfo={false}
            strokeColor={theme.colors.main.primary}
          />
        </S.Card>
        <S.Card title={t('progress.circle')}>
          <Progress
            type="circle"
            percent={75}
            strokeColor={theme.colors.main.primary}
          />
          <Progress
            type="circle"
            percent={70}
            status="exception"
            strokeColor={theme.colors.main.error}
          />
          <Progress
            type="circle"
            percent={100}
            strokeColor={theme.colors.main.success}
          />
        </S.Card>
        <S.Card title={t('progress.dynamic')}>
          <div>
            <Progress
              percent={percent}
              type="circle"
              strokeColor={dynamicSuccessColor}
            />
            <Progress percent={percent} strokeColor={dynamicSuccessColor} />
            <ButtonGroup>
              <Button onClick={decrease} icon={<MinusOutlined />} />
              <Button onClick={increase} icon={<PlusOutlined />} />
            </ButtonGroup>
          </div>
        </S.Card>
        <S.Card title={t('progress.dashboard')}>
          <Progress
            type="dashboard"
            percent={75}
            strokeColor={theme.colors.main.primary}
          />
          <Progress
            type="dashboard"
            percent={75}
            gapDegree={30}
            strokeColor={theme.colors.main.primary}
          />
        </S.Card>
        <S.Card title={t('progress.gradient')}>
          <div>
            <Progress
              strokeColor={{
                '0%': theme.colors.main.primary,
                '100%': theme.colors.main.secondary
              }}
              percent={99.9}
            />
            <Progress
              strokeColor={{
                from: theme.colors.main.primary,
                to: theme.colors.main.secondary
              }}
              percent={99.9}
              status="active"
            />
            <Progress
              type="circle"
              strokeColor={{
                '0%': theme.colors.main.primary,
                '100%': theme.colors.main.secondary
              }}
              percent={90}
            />
            <Progress
              type="circle"
              strokeColor={{
                '0%': theme.colors.main.primary,
                '100%': theme.colors.main.secondary
              }}
              percent={100}
            />
          </div>
        </S.Card>
      </Col>
    </>
  )
}

export default ProgressPage
