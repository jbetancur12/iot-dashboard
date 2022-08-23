import { Card } from '@app/components/common/Card/Card';
import { DashboardCard } from '@app/components/dashboard/DashboardCard/DashboardCard';
import { Col, Row } from 'antd';
import React from 'react';

interface DevicesCardProps {
  name?: string;
  mac?: string;
}

const DevicesPage: React.FC<DevicesCardProps> = ({ name, mac }) => {
  return (
    <Row gutter={32}>
      <Col xs={24} xl={8}>
        <DashboardCard>Hola</DashboardCard>
      </Col>
    </Row>
  );
};

export default DevicesPage;
