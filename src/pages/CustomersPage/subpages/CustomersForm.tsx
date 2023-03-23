import { useEffect, useState } from 'react';
import { Form, notification } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { BaseForm } from '@app/components/common/forms/BaseForm/BaseForm';
import { useAppDispatch, useAppSelector } from '@app/hooks/reduxHooks';
import { notificationController } from '@app/controllers/notificationController';
import * as Auth from '@app/components/layouts/AuthLayout/AuthLayout.styles';
import { doCreateCustomer, doUpdateCustomer, retrieveCustomers } from '@app/store/slices/customerSlice';

enum TypeCustomer {
  natural,
  company,
}

interface CustomerFormData {
  name: string;
  typeCustomer: TypeCustomer;
  idCustomer: string;
  email: string;
  phone: string;
  lang: string;
  country: string;
  city: string;
  address1: string;
  address2: string;
  zipcode: number;
  password: string;
}

const CustomersForm = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { id } = useParams();
  const [isLoading, setLoading] = useState(false);
  const { customers } = useAppSelector((state) => state.customer);
  const [form] = Form.useForm();
  const { t } = useTranslation();
  const isAddMode = !id;

  const handleSubmit = (values: CustomerFormData) => {
    setLoading(true);
    return isAddMode ? createCustomer(values) : updateCustomer(id!, values);
  };

  const createCustomer = (data: CustomerFormData) => {
    dispatch(doCreateCustomer(data))
      .unwrap()
      .then((res) => {
        notificationController.success({
          message: t('customer.customerCreatedSuccessfully'),
          //   description: `${t('customer.createdCustomer')} ${res.data.name} (${res?.data._id})`,
        });
        navigate(-1);
      })
      .catch((err) => {
        notificationController.error({ message: err.message });
        setLoading(false);
      });
  };

  const updateCustomer = (id: string | undefined, data: CustomerFormData) => {
    const dataToUpdate = {
      id: id,
      data,
    };
    dispatch(doUpdateCustomer(dataToUpdate))
      .unwrap()
      .then((res) => {
        notificationController.success({
          message: t('customer.customerUpdatedSuccessfully'),
          //   description: `${t('customer.updatedCustomer')} ${res.data.name} (${res.data._id})`,
        });
        navigate(-1);
      })
      .catch((err) => {
        notificationController.error({ message: err.message });
        setLoading(false);
      });
  };

  const fetchCustomersList = () => {
    dispatch(retrieveCustomers())
      .unwrap()
      .then((res) => {})
      .catch((err) => {
        notificationController.error({ message: err.message });
      });
  };

  useEffect(() => {
    if (!customers?.length) {
      fetchCustomersList();
    }

    if (!isAddMode && customers?.length) {
      const customerToEditIndex = customers.findIndex((customer) => customer._id === id);
      const customerToEdit = customers[customerToEditIndex];
      form.setFields([
        { name: 'name', value: customerToEdit?.name },
        { name: 'email', value: customerToEdit?.email },
        { name: 'phone', value: customerToEdit?.phone },
        { name: 'city', value: customerToEdit?.city },
        { name: 'address1', value: customerToEdit?.address1 },
        { name: 'country', value: customerToEdit?.country },
      ]);
    }
  }, [form, customers?.length]);

  return (
    <Auth.FormWrapper>
      <BaseForm layout="vertical" onFinish={handleSubmit} requiredMark="optional" form={form}>
        <Auth.FormItem
          name="name"
          label={t('customer.name')}
          rules={[{ required: true, message: t('common.requiredField') }]}
        >
          <Auth.FormInput placeholder={t('common.name')} />
        </Auth.FormItem>
        <Auth.FormItem
          name="idCustomer"
          label={t('common.idCustomer')}
          rules={[{ required: true, message: t('common.requiredField') }]}
        >
          <Auth.FormInput placeholder={t('common.idCustomer')} />
        </Auth.FormItem>
        <Auth.FormItem
          name="email"
          label={t('common.email')}
          rules={[
            { required: true, message: t('common.requiredField') },
            {
              type: 'email',
              message: t('common.notValidEmail'),
            },
          ]}
        >
          <Auth.FormInput placeholder={t('common.email')} />
        </Auth.FormItem>
        <Auth.FormItem name="phone" label={t('common.phone')} rules={[{ required: true, message: t('common.phone') }]}>
          <Auth.FormInput placeholder={t('common.phone')} />
        </Auth.FormItem>
        <Auth.FormItem
          name="city"
          label={t('common.city')}
          rules={[{ required: true, message: t('common.requiredField') }]}
        >
          <Auth.FormInput placeholder={t('common.city')} />
        </Auth.FormItem>
        <Auth.FormItem
          name="address1"
          label={t('common.address')}
          rules={[{ required: true, message: t('common.requiredField') }]}
        >
          <Auth.FormInput placeholder={t('common.address')} />
        </Auth.FormItem>
        <Auth.FormItem
          label={t('common.country')}
          name="country"
          rules={[{ required: true, message: t('common.requiredField') }]}
        >
          <Auth.FormInput placeholder={t('common.country')} />
        </Auth.FormItem>
        <BaseForm.Item noStyle>
          <Auth.SubmitButton type="primary" htmlType="submit" loading={isLoading}>
            {t('common.signUp')}
          </Auth.SubmitButton>
        </BaseForm.Item>
      </BaseForm>
    </Auth.FormWrapper>
  );
};

export default CustomersForm;
