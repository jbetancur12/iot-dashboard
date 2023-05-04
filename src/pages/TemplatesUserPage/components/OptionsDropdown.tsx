import React, { useState } from 'react';
import { Button, Menu, Dropdown } from 'antd';

const OptionsDropdown: React.FC = () => {
  const [selectedOption, setSelectedOption] = useState<string | undefined>(undefined);

  const handleMenuClick = (e: any) => {
    setSelectedOption(e.key);
  };

  const menu = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item key="on">On</Menu.Item>
      <Menu.Item key="off">Off</Menu.Item>
      <Menu.Item key="auto">Auto</Menu.Item>
    </Menu>
  );

  const buttonText = selectedOption ? `Selected: ${selectedOption}` : 'Select an option';

  return (
    <Dropdown overlay={menu} placement="bottomCenter">
      <Button>{buttonText}</Button>
    </Dropdown>
  );
};

export default OptionsDropdown;
