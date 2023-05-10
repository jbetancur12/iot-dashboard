import { PlusOutlined } from '@ant-design/icons'
import { Button } from '@app/components/common/buttons/Button/Button'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { CustomersTable } from './components/CustomersTable'
import * as S from './CustomersPage.styles'
import { useState } from 'react'
import CustomerModal from './components/CustomerModal'
import {
  doCreateCustomer,
  doDeleteCustomer,
  doUpdateCustomer
} from '@app/store/slices/customerSlice'
import { useAppDispatch } from '@app/hooks/reduxHooks'
import { notificationController } from '@app/controllers/notificationController'
import { CustomerData } from '@app/api/customer.api'

const CustomersPage = () => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const [open, setOpen] = useState(false)
  const [isLoading, setLoading] = useState(false)
  const [customer, setCustomer] = useState(null)

  const createCustomer = (data: any) => {
    dispatch(doCreateCustomer(data))
      .unwrap()
      .then((res) => {
        setOpen(false)
      })
      .catch((err) => {
        notificationController.error({ message: err.message })
        setLoading(false)
        setOpen(false)
      })
  }

  const updateCustomer = (id: string | undefined, data: CustomerData) => {
    const dataToUpdate = {
      id: id,
      data
    }
    dispatch(doUpdateCustomer(dataToUpdate))
      .unwrap()
      .then((res) => {
        setCustomer(null)
        setOpen(false)
      })
      .catch((err) => {
        notificationController.error({ message: err.message })
        setLoading(false)
      })
  }

  const deleteCustomer = (id: string) => {
    dispatch(doDeleteCustomer(id))
      .unwrap()
      .then((data) => {
        notificationController.success({
          message: t('device.deviceDeletedSuccesfullly'),
          // @ts-ignored
          description: data.name
        })
      })
      .catch((err) => {
        notificationController.error({ message: err.message })
      })
  }

  const onCancel = () => {
    setCustomer(null)
    setOpen(false)
  }

  const showModal = () => {
    setOpen(true)
  }

  return (
    <>
      <Button type="primary" icon={<PlusOutlined />} onClick={showModal}>
        New Company
      </Button>
      <CustomerModal
        visible={open}
        onCreate={createCustomer}
        onCancel={onCancel}
        onUpdate={updateCustomer}
        user={customer}
      />
      <S.TablesWrapper>
        <CustomersTable
          setCustomer={setCustomer}
          setOpen={setOpen}
          onDelete={deleteCustomer}
        />
      </S.TablesWrapper>
    </>
  )
}

export default CustomersPage
