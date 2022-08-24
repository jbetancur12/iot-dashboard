import { PlusOutlined } from '@ant-design/icons';
import { Button } from '@app/components/common/buttons/Button/Button';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { DevicesManagerTable } from './components/DevicesManagerTable';
import * as S from './DevicesManagerPage.styles';

const DevicesManagerPage = () => {
  const { t } = useTranslation();
  return (
    <>
      <Link to="new-user">
        <Button type="primary" icon={<PlusOutlined />}>
          New User
        </Button>
      </Link>
      <Link to="new-device">
        <Button type="primary" icon={<PlusOutlined />}>
          New Device
        </Button>
      </Link>
      <S.TablesWrapper>
        <DevicesManagerTable />
      </S.TablesWrapper>
    </>
  );
};

export default DevicesManagerPage;
