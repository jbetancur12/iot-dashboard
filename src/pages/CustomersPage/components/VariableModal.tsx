import React, { useState } from 'react';
import { Modal, Form, Input, Button } from 'antd';
import { VariableData } from '@app/api/variable.api';

interface IVariableModalProps {
  visible: boolean;
  onCreate: (values: any) => void;
  onUpdate: (id: string | undefined, data:VariableData) => void;
  onCancel: () => void;
  variable?: any;
  template: string | undefined
  customer: string | undefined

}


const VariableModal: React.FC<IVariableModalProps> = ({ visible, onCreate, onUpdate, onCancel, template, customer, variable }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  
  
  form.setFieldsValue(template)

  form.setFieldsValue({
    "template": template,
    "customer": customer
  })

  const handleOk = () => {
    // setLoading(true);
    form.validateFields().then(values => {
      variable ? onUpdate(variable._id, values) : onCreate(values);
      form.resetFields();
    //   setLoading(false);
    }).catch(error =>{
        console.log(error)
    });
  }

  const handleOnCancel = () => {
    form.resetFields()
    onCancel()
  }


  return (
    <Modal
      visible={visible}
      destroyOnClose
      title={variable ? 'Editar Variable' : 'Crear Variable'}
      onCancel={handleOnCancel}
      footer={[
        <Button key="cancel" onClick={handleOnCancel}>Cancelar</Button>,
        <Button key="submit" type="primary" loading={loading} onClick={handleOk}>
          {variable ? 'Actualizar' : 'Crear'}
        </Button>,
      ]}
    >

        
      <Form
        form={form}
        layout="vertical"

      >
        <Form.Item
          name="name"
          label="Nombre"
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
          name="sensorType"
          label="Tipo de Sensor"
          rules={[
            {
              required: true,
              message: 'Por favor ingrese le tipo de sensor'
            },
          ]}
        >
          <Input placeholder="Ingrese el tipo de sensor" />
        </Form.Item>

        <Form.Item
          name="unit"
          label="Ingrese La Unidad"
          rules={[
            {
              required: true,
              message: 'Por favor ingrese la unidad',
            },
          ]}
        >
          <Input placeholder="Ingrese el customer" />
        </Form.Item>

        <Form.Item
          name="virtualPin"
          label="Ingrese Pin"
          rules={[
            {
              required: true,
              message: 'Por favor ingrese la Pin',
            },
          ]}
        >
          <Input placeholder="Ingrese el Pin" />
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

        <Form.Item
          name="template"
          label="Template"
          rules={[
            {
              required: true,
              message: 'Por favor ingrese un template',
            },
          ]}
        >
          <Input placeholder="Ingrese el template" />
        </Form.Item>

        
      </Form>
    </Modal>
  );
};

export default VariableModal;
