import React, { useState } from 'react';
import { Modal, Form, Input, Button } from 'antd';
import { CustomerData } from '@app/api/customer.api';

interface ICustomerModalProps {
  visible: boolean;
  onCreate: (values: any) => void;
  onUpdate: (id: string | undefined, data: CustomerData) => void;
  onCancel: () => void;
  user?: any;
  customer: string | undefined;
}

const CustomerModal: React.FC<ICustomerModalProps> = ({ visible, onCreate, onUpdate, onCancel, user, customer }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  form.setFieldsValue(user);

  form.setFieldsValue({
    customer: customer,
  });

  const handleOk = () => {
    // setLoading(true);
    form
      .validateFields()
      .then((values) => {
        user ? onUpdate(user._id, values) : onCreate(values);
        form.resetFields();
        //   setLoading(false);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleOnCancel = () => {
    form.resetFields();
    onCancel();
  };

  return (
    <Modal
      visible={visible}
      destroyOnClose
      title={user ? 'Editar Usuario' : 'Crear Usuario'}
      onCancel={handleOnCancel}
      footer={[
        <Button key="cancel" onClick={handleOnCancel}>
          Cancelar
        </Button>,
        <Button key="submit" type="primary" loading={loading} onClick={handleOk}>
          {user ? 'Actualizar' : 'Crear'}
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="firstName"
          label="Nomber"
          rules={[
            {
              required: true,
              message: 'Por favor ingrese el nombre',
            },
          ]}
        >
          <Input placeholder="Ingrese el nombre" />
        </Form.Item>
        <Form.Item
          name="lastName"
          label="Apellido"
          rules={[
            {
              required: true,
              message: 'Por favor ingrese el apellido',
            },
          ]}
        >
          <Input placeholder="Ingrese el nombre" />
        </Form.Item>
        <Form.Item
          name="email"
          label="Email"
          rules={[
            {
              required: true,
              type: 'email',
              message: 'Por favor ingrese un correo electrónico válido',
            },
          ]}
        >
          <Input placeholder="Ingrese el correo electrónico" />
        </Form.Item>

        <Form.Item
          name="customer"
          label="Customer"
          rules={[
            {
              required: true,
              message: 'Por favor ingrese un customer',
            },
          ]}
        >
          <Input placeholder="Ingrese el customer" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CustomerModal;
