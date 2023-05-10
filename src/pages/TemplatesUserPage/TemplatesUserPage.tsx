import { readUser } from '@app/services/localStorage.service';
import { Col, Row } from 'antd';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import * as S from './TemplatesUserPage.styles';
import { getCustomerTemplates, TemplateDataResponse } from '@app/api/template.api';

const TemplatesPage: React.FC = () => {
  const customer = readUser()?.customer;
  const [templates, setTemplates] = useState<TemplateDataResponse[]>([]);

  useEffect(() => {
    getCustomerTemplates(customer?._id).then((res) => setTemplates(res));
  }, []);

  console.log(templates);

  return (
    <Row gutter={[30, 30]}>
      {templates.map((template) => (
        <Col xs={24} xl={8} key={template._id}>
          <Link
            to={{
              pathname: 'charts',
              search: `?template=${template._id}`,
            }}
          >
            <S.TemplateCard key={template._id}>
              <S.Title>{template.name}</S.Title>
              <S.Text>{template.description}</S.Text>
              <S.Text>{template.type}</S.Text>
            </S.TemplateCard>
          </Link>
        </Col>
      ))}
    </Row>
  );
};

export default TemplatesPage;
