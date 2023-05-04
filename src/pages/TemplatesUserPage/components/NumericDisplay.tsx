import React from 'react';
import { Typography } from 'antd';

const { Text } = Typography;

interface NumericDataProps {
  value: number | string ;
  label?: string;
}

const NumericData: React.FC<NumericDataProps> = ({ value, label }) => {
  return (
    <div>
      {label && <Text strong>{label} </Text>}
      <br/>
      <Text>{value}</Text>
    </div>
  );
};

export default NumericData;