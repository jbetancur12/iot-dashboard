import React from 'react'
import { FormItemProps } from 'antd'
import { useTranslation } from 'react-i18next'
import { Input } from '@app/components/common/inputs/Input/Input'
import { BaseButtonsForm } from '@app/components/common/forms/BaseButtonsForm/BaseButtonsForm'

interface EmailItemProps extends FormItemProps {
  verified?: boolean
  onClick?: () => void
}

export const EmailItem: React.FC<EmailItemProps> = ({
  required,
  onClick,
  verified,
  ...props
}) => {
  const { t } = useTranslation()

  return (
    <BaseButtonsForm.Item
      name="email"
      $isSuccess={verified}
      $successText={t('profile.nav.personalInfo.verified')}
      label={t('common.email')}
      rules={[
        { required, message: t('common.requiredField') },
        {
          type: 'email',
          message: t('common.notValidEmail')
        }
      ]}
      {...props}>
      <Input disabled={verified} onClick={onClick} />
    </BaseButtonsForm.Item>
  )
}
