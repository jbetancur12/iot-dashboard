import { Col, Row, Space } from "antd";
import { Link } from "react-router-dom";
import { Button } from '@app/components/common/buttons/Button/Button';
import { PlusOutlined } from '@ant-design/icons';

import * as S from './CustomersPage.styles'
import { useTranslation } from "react-i18next";
import { CustomersTable } from "./components/CustomersTable";

const CustomersPage: React.FC = () => {

    const { t } = useTranslation();
    return (
        <>
        <Space>
            <Link to="new-user">
                <Button type="primary" icon={<PlusOutlined />}>
                    {t('customer.new')}
                </Button>
            </Link>
        </Space>
            <S.TablesWrapper>
                <CustomersTable />
            </S.TablesWrapper>
            </>
    );
}

export default CustomersPage;