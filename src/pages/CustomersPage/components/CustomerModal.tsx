import React, { useState } from 'react'
import { Modal, Form, Input, Button } from 'antd'
import { CustomerData } from '@app/api/customer.api'

interface ICustomerModalProps {
  visible: boolean
  onCreate: (values: any) => void
  onUpdate: (id: string | undefined, data: CustomerData) => void
  onCancel: () => void
  user?: any
}

const initialValues = {
  name: '',
  IdCustomer: '',
  email: '',
  phone: '',
  country: '',
  city: '',
  address1: ''
}

const CustomerModal: React.FC<ICustomerModalProps> = ({
  visible,
  onCreate,
  onUpdate,
  onCancel,
  user
}) => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)

  form.setFieldsValue(user)

  const handleOk = () => {
    // setLoading(true);
    form
      .validateFields()
      .then((values) => {
        user ? onUpdate(user._id, values) : onCreate(values)
        form.resetFields()
        //   setLoading(false);
      })
      .catch((error) => {
        console.log(error)
      })
  }

  const handleOnCancel = () => {
    form.resetFields()
    onCancel()
  }

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
        <Button
          key="submit"
          type="primary"
          loading={loading}
          onClick={handleOk}>
          {user ? 'Actualizar' : 'Crear'}
        </Button>
      ]}>
      <Form form={form} layout="vertical">
        <Form.Item
          name="name"
          label="Nombre"
          rules={[
            {
              required: true,
              message: 'Por favor ingrese el nombre'
            }
          ]}>
          <Input placeholder="Ingrese el nombre" />
        </Form.Item>
        <Form.Item
          name="email"
          label="Email\"
          rules={[
            {
              required: true,
              type: 'email',
              message: 'Por favor ingrese un correo electrónico válido'
            }
          ]}>
          <Input placeholder="Ingrese el correo electrónico" />
        </Form.Item>
        <Form.Item
          name="IdCustomer"
          label="ID"
          rules={[
            {
              required: !user,
              message: 'Por favor ingrese identificacion'
            }
          ]}>
          <Input placeholder="Ingrese identificacion" />
        </Form.Item>
        <Form.Item
          name="phone"
          label="phone"
          rules={[
            {
              required: true,
              message: 'Por favor ingrese Telefono'
            }
          ]}>
          <Input placeholder="Ingrese Telefono" />
        </Form.Item>
        <Form.Item
          name="country"
          label="country"
          rules={[
            {
              required: true,
              message: 'Por favor ingrese Pais'
            }
          ]}>
          <Input placeholder="Ingrese Pais" />
        </Form.Item>
        <Form.Item
          name="city"
          label="city"
          rules={[
            {
              required: true,
              message: 'Por favor ingrese Ciudad'
            }
          ]}>
          <Input placeholder="Ingrese Ciudad" />
        </Form.Item>
        <Form.Item
          name="address1"
          label="address1"
          rules={[
            {
              required: true,
              message: 'Por favor ingrese Direccion'
            }
          ]}>
          <Input placeholder="Ingrese Direccion" />
        </Form.Item>
        {/* <Form.Item
          name="password"
          label="Contraseña"
          rules={[
            {
              required: !user,
              message: 'Por favor ingrese una contraseña',
            },
          ]}
          hasFeedback
        >
          <Input.Password placeholder="Ingrese una contraseña" />
        </Form.Item> */}
      </Form>
    </Modal>
  )
}

export default CustomerModal
