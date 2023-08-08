import { PlusOutlined } from '@ant-design/icons'
import { deleteUser } from '@app/api/auth.api'
import { CustomerDataResponse } from '@app/api/customer.api'
import {
  TemplateDataResponse,
  getCustomerTemplates
} from '@app/api/template.api'
import { TabPane, Tabs } from '@app/components/common/Tabs/Tabs'
import { notificationController } from '@app/controllers/notificationController'
import { useAppDispatch, useAppSelector } from '@app/hooks/reduxHooks'
import { doSignUp } from '@app/store/slices/authSlice'
import { retrieveCustomer } from '@app/store/slices/customerSlice'
import {
  doCreateTemplate,
  doDeleteTemplate
} from '@app/store/slices/templateSlice'
import { Button, Card, Descriptions, Space, Table } from 'antd'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'
import TemplateModal from '../components/TemplateModal'
import UserModal from '../components/userModal'

const { Meta } = Card

interface SignUpFormData {
  firstName: string
  lastName: string
  email: string
  password: string
  customer?: string
}

interface User extends Omit<SignUpFormData, 'password'> {
  id: string
}

const UserProfile = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [customer, setCustomer] = useState<Partial<CustomerDataResponse>>({})
  const [users, setUsers] = useState<User[]>([])
  const [templates, setTemplates] = useState<TemplateDataResponse[]>([])
  const [open, setOpen] = useState(false)
  const [openTemplate, setOpenTemplate] = useState(false)
  const dispatch = useAppDispatch()

  const { customers } = useAppSelector((state) => state.customer)

  let { id } = useParams()

  const fetchCustomer = () => {
    dispatch(retrieveCustomer(id))
      .unwrap()
      .then((res) => {
        setCustomer(res)
        setUsers(res.users)
      })
  }

  //   const fetchTemplates = () => {
  //     dispatch(retrieveTemplates())
  //       .unwrap()
  //       .then((res) => {
  //         setTemplates(res)
  //       })
  //   }

  const fetchTemplates = () => {
    getCustomerTemplates(id).then((res) => setTemplates(res))
  }

  const handleDeleteTemplateRow = (
    e: React.MouseEvent<HTMLElement, MouseEvent>,
    rowId: string
  ) => {
    e.stopPropagation()
    dispatch(doDeleteTemplate(rowId))
      .unwrap()
      .then((data) => {
        notificationController.success({
          message: 'Template eliminada',
          // @ts-ignored
          description: data.name
        })
      })
      .catch((err) => {
        notificationController.error({ message: err.message })
      })
  }

  useEffect(() => {
    const customerExist = customers.filter((customer) => customer._id === id)
    fetchCustomer()
    fetchTemplates()
  }, [])

  const showModal = () => {
    setOpen(true)
  }

  const showModalTemplate = () => {
    setOpenTemplate(true)
  }

  const createUser = (values: SignUpFormData) => {
    dispatch(doSignUp(values))
      .unwrap()
      .then((res) => {
        if (res !== undefined) {
          // @ts-ignore
          setUsers((current) => [...current, res.user])
        }
        setOpen(false)

        notificationController.success({
          message: t('auth.signUpSuccessMessage'),
          description: t('auth.signUpSuccessDescription')
        })
      })
      .catch((err) => {
        notificationController.error({ message: err.message })
      })
  }

  const createTemplate = (values: any) => {
    dispatch(doCreateTemplate(values))
      .unwrap()
      .then((res) => {
        if (res !== undefined) {
          // @ts-ignore
          setTemplates((current) => [...current, res.data])
        }
        setOpenTemplate(false)

        notificationController.success({
          message: t('auth.signUpSuccessMessage'),
          description: t('auth.signUpSuccessDescription')
        })
      })
      .catch((err) => {
        notificationController.error({ message: err.message })
      })
  }

  const onCancel = () => {
    setOpen(false)
  }

  const onDelete = (id: string) => {
    deleteUser(id).then((res) => {
      const updatedUsers = users.filter((user) => user.id !== id)
      setUsers(updatedUsers)
    })
  }

  const onCancelTemplate = () => {
    setOpenTemplate(false)
  }

  const updateUser = () => {}

  const updateTemplate = () => {}

  const columns = [
    {
      title: 'Name',
      dataIndex: 'firstName',
      key: 'firstName'
    },
    {
      title: 'LastName',
      dataIndex: 'lastName',
      key: 'lastName'
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email'
    },
    {
      title: t('tables.actions'),
      dataIndex: 'actions',
      width: '15%',
      render: (text: string, record: { firstName: string; id: string }) => {
        return (
          <Space>
            {/* <Button type="ghost" onClick={() => handleEdit(record)}>
                {t('tables.edit')}
              </Button> */}
            <Button type="default" danger onClick={() => onDelete(record.id)}>
              {t('tables.delete')}
            </Button>
          </Space>
        )
      }
    }
  ]

  const columnsTemplates = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description'
    },
    {
      title: 'Tipo',
      dataIndex: 'type',
      key: 'type'
    },
    {
      title: t('tables.actions'),
      dataIndex: 'actions',
      width: '15%',
      render: (text: string, record: { name: string; _id: string }) => {
        return (
          <Space>
            <Button
              type="default"
              danger
              onClick={(e) => handleDeleteTemplateRow(e, record._id)}>
              {t('tables.delete')}
            </Button>
          </Space>
        )
      }
    }
  ]

  return (
    <div>
      <Card
        title="Información del Cliente"
        //   style={{ width: 500, margin: '0 auto' }}
      >
        <Meta title={customer.name} />
        <Space />
        <Descriptions size="small">
          <Descriptions.Item label="Email">{customer.email}</Descriptions.Item>
          <Descriptions.Item label="Identificación">
            {customer.IdCustomer}
          </Descriptions.Item>
          <Descriptions.Item label="Dirección">
            {customer.address1}
          </Descriptions.Item>
          <Descriptions.Item label="País">{customer.country}</Descriptions.Item>
          <Descriptions.Item label="Ciudad">{customer.city}</Descriptions.Item>
        </Descriptions>
        <Space />
        <Tabs defaultActiveKey="1">
          <TabPane tab={`Usuarios`} key="1">
            <Button type="primary" icon={<PlusOutlined />} onClick={showModal}>
              Agregar Usuario
            </Button>
            <Table dataSource={users} columns={columns} />
          </TabPane>
          <TabPane tab={`Plantillas`} key="2">
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={showModalTemplate}>
              Agregar Plantilla
            </Button>
            <Table
              dataSource={templates}
              columns={columnsTemplates}
              onRow={(record, rowIndex) => {
                return {
                  onClick: (event) => {
                    // @ts-ignore
                    navigate(
                      `/customers/${customer._id}/template/${record._id}`
                    )
                  }
                }
              }}
            />
          </TabPane>
          <TabPane tab={`Variables`} key="3">
            {t('tabs.tabContent')} 3
          </TabPane>
        </Tabs>
      </Card>
      <UserModal
        visible={open}
        onCreate={createUser}
        onCancel={onCancel}
        onUpdate={updateUser}
        user={null}
        customer={customer._id}
      />
      <TemplateModal
        visible={openTemplate}
        onCreate={createTemplate}
        onCancel={onCancelTemplate}
        onUpdate={updateTemplate}
        template={null}
        customer={customer._id}
      />
    </div>
  )
}

export default UserProfile
