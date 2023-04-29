import React, { useState } from 'react';
import { Modal, Form, Input, Button } from 'antd';
import { TemplateData } from '@app/api/template.api';

interface ITemplateModalProps {
  visible: boolean;
  onCreate: (values: any) => void;
  onUpdate: (id: string | undefined, data:TemplateData) => void;
  onCancel: () => void;
  template?: any;
  customer: string | undefined
}


const TemplateModal: React.FC<ITemplateModalProps> = ({ visible, onCreate, onUpdate, onCancel, template, customer }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  
  
  form.setFieldsValue(template)

  form.setFieldsValue({
    "customer": customer
  })

  const handleOk = () => {
    // setLoading(true);
    form.validateFields().then(values => {
      template ? onUpdate(template._id, values) : onCreate(values);
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
      title={template ? 'Editar Usuario' : 'Crear Usuario'}
      onCancel={handleOnCancel}
      footer={[
        <Button key="cancel" onClick={handleOnCancel}>Cancelar</Button>,
        <Button key="submit" type="primary" loading={loading} onClick={handleOk}>
          {template ? 'Actualizar' : 'Crear'}
        </Button>,
      ]}
    >

        
      <Form
        form={form}
        layout="vertical"

      >
        <Form.Item
          name="name"
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
          name="description"
          label="Description"
          rules={[
            {
              required: true,
              message: 'Por favor ingrese una Description'
            },
          ]}
        >
          <Input placeholder="Ingrese el nombre" />
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

export default TemplateModal;
