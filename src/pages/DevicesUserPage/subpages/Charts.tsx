import { DayjsDatePicker } from '@app/components/common/pickers/DayjsDatePicker';
import { Col, Row } from 'antd';
import { GradientStackedAreaChart } from './GradientStackedAreaChart';
import * as S from '@app/pages/uiComponentsPages/UIComponentsPage.styles';
import * as ST from './chartStyles';
import { Panel } from '@app/components/common/Collapse/Collapse';

const Charts = () => {
  return (
    <>
      <ST.CollapseWrapper defaultActiveKey={['1']}>
        <Panel header="Choose Date" key="1">
          <Row gutter={[30, 30]}>
            <Col xs={24} xl={12}>
              <Col>
                <S.Card title="Since">
                  <DayjsDatePicker />
                  <DayjsDatePicker.TimePicker />
                </S.Card>
              </Col>
            </Col>
            <Col xs={24} xl={12}>
              <Col>
                <S.Card title="To">
                  <DayjsDatePicker />
                  <DayjsDatePicker.TimePicker />
                </S.Card>
              </Col>
            </Col>
          </Row>
        </Panel>
      </ST.CollapseWrapper>

      {/* <Row gutter={[30, 30]}>
        <Col xs={24} xl={12}>
          <Col>
            <S.Card title="Since">
              <DayjsDatePicker />
              <DayjsDatePicker.TimePicker />
            </S.Card>
          </Col>
        </Col>
        <Col xs={24} xl={12}>
          <Col>
            <S.Card title="To">
              <DayjsDatePicker />
              <DayjsDatePicker.TimePicker />
            </S.Card>
          </Col>
        </Col>
      </Row> */}
      <GradientStackedAreaChart />
    </>
  );
};

export default Charts;
