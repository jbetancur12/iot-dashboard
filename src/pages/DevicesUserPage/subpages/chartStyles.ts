import { Button } from '@app/components/common/buttons/Button/Button';
import { Collapse } from '@app/components/common/Collapse/Collapse';
import styled, { css } from 'styled-components';

interface WrapperProps {
  $isSelected: boolean;
}

export const CollapseWrapper = styled(Collapse)`
  margin-bottom: 20px;
`;

export const containerDiv = styled.div`
  display: flex;
  flex-direction: row;

  border: solid 1px #f0f0f0;
  border-radius: 7px;
  margin-bottom: 10px;
  @media (max-width: 800px) {
    flex-direction: column;
  }
`;

export const divWrapper = styled.div<WrapperProps>`
  //flex-basis: 30%;
  border: solid 1px #f0f0f0;
  width: 100%;
  text-align: center;
  cursor: pointer;
  ${(props) =>
    props.$isSelected &&
    css`
      background: blue;
    `}
`;
