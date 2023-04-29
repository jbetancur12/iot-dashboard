import React from 'react';
import  SetPasswordForm  from '@app/components/auth/SetPasswordForm/SetPasswordForm';
import { useTranslation } from 'react-i18next';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';

const SecurityCodePage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <>
      <PageTitle>{t('common.securityCode')}</PageTitle>
      <SetPasswordForm />
    </>
  );
};

export default SecurityCodePage;
