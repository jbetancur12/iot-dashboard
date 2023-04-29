import { DashboardCard } from '@app/components/dashboard/DashboardCard/DashboardCard';
import { Typography } from 'antd';
import styled from 'styled-components';

export const Title = styled(Typography.Text)`
  font-size: ${(props) => props.theme.commonFontSizes.xs};
  font-weight: ${(props) => props.theme.commonFontWeight.bold};

  @media only screen and ${(props) => props.theme.media.md} {
    font-size: ${(props) => props.theme.commonFontSizes.md};
  }

  @media only screen and ${(props) => props.theme.media.xl} {
    font-size: ${(props) => props.theme.commonFontSizes.lg};
  }
`;

export const Text = styled(Typography.Text)`
  font-size: ${(props) => props.theme.commonFontSizes.xs};
  font-weight: ${(props) => props.theme.commonFontWeight.medium};
`;

export const TemplateCard = styled(DashboardCard)`
  .ant-card-body {
    display: flex;
    align-items: center;
    flex-direction: column;
  }
  &:hover {
    cursor: pointer;
    opacity: 0.9;
    transform: scale(1.01);
  }
`;
