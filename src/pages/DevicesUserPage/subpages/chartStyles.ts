import { Button } from '@app/components/common/buttons/Button/Button';
import { Collapse } from '@app/components/common/Collapse/Collapse';
import styled, { css } from 'styled-components';

interface WrapperProps {
  $isSelected: boolean;
}

export const CollapseWrapper = styled(Collapse)`
  margin-bottom: 20px;
`;

export const divWrapper = styled.div<WrapperProps>`
  display: inline-block;
  width: 25%;
  text-align: center;
  border: solid 1px #f0f0f0;
  height: 100%;
  cursor: pointer;
  ${(props) =>
    props.$isSelected &&
    css`
      background: blue;
    `}
`;
