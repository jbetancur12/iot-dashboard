import { BaseForm } from '@app/components/common/forms/BaseForm/BaseForm';
import * as Auth from '@app/components/layouts/AuthLayout/AuthLayout.styles';
import { useAppDispatch } from '@app/hooks/reduxHooks';
import { useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import type { SelectProps } from 'antd/es/select';
import debounce from 'lodash.debounce';
import { Select, Spin } from 'antd';
import { doCreateThing } from '@app/store/slices/thingSlice';
import { notificationController } from '@app/controllers/notificationController';

export interface DebounceSelectProps<ValueType = any>
  extends Omit<SelectProps<ValueType | ValueType[]>, 'options' | 'children'> {
  fetchOptions: (search: string) => Promise<ValueType[]>;
  debounceTimeout?: number;
}

function DebounceSelect<ValueType extends { key?: string; label: React.ReactNode; value: string | number } = any>({
  fetchOptions,
  debounceTimeout = 800,
  ...props
}: DebounceSelectProps<ValueType>) {
  const [fetching, setFetching] = useState(false);
  const [options, setOptions] = useState<ValueType[]>([]);
  const fetchRef = useRef(0);

  const debounceFetcher = useMemo(() => {
    const loadOptions = (value: string) => {
      fetchRef.current += 1;
      const fetchId = fetchRef.current;
      setOptions([]);
      setFetching(true);

      fetchOptions(value).then((newOptions) => {
        if (fetchId !== fetchRef.current) {
          // for fetch callback order
          return;
        }

        setOptions(newOptions);
        setFetching(false);
      });
    };

    return debounce(loadOptions, debounceTimeout);
  }, [fetchOptions, debounceTimeout]);

  return (
    <Select
      labelInValue
      filterOption={false}
      onSearch={debounceFetcher}
      notFoundContent={fetching ? <Spin size="small" /> : null}
      {...props}
      options={options}
    />
  );
}

interface UserValue {
  label: string;
  value: string;
}

interface SignUpFormData {
  user: UserValue;
  mac: string;
  name: string;
}

async function fetchUserList(username: string): Promise<UserValue[]> {
  console.log('fetching user', username);

  return fetch('http://192.168.0.6:5000/api/users/?email=' + username)
    .then((response) => response.json())
    .then((body) => {
      console.log(body);
      return body.map((user: { email: { name: string }; id: string }) => ({
        label: `${user.email.name}`,
        value: user.id,
      }));
    });
}

const DevicesManagerForm: React.FC = () => {
  const [value, setValue] = useState<UserValue[]>([]);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [isLoading, setLoading] = useState(false);

  const handleSubmit = (values: SignUpFormData) => {
    const valuesToSend = { ...values, user: values.user.value };
    setLoading(true);
    dispatch(doCreateThing(valuesToSend))
      .unwrap()
      .then((res) => {
        notificationController.success({
          message: t('device.deviceCreatedSuccesfullly'),
          // @ts-ignored
          description: `${t('device.createdNewDevice')} ${res.data.name} ${t('device.and')} ${res.data.mac}`,
        });
        navigate(-1);
      })
      .catch((err) => {
        notificationController.error({ message: err.message });
        setLoading(false);
      });
  };

  return (
    <Auth.FormWrapper>
      <BaseForm layout="vertical" onFinish={handleSubmit} requiredMark="optional">
        {/* <S.Title>{t('common.signUp')}</S.Title> */}
        <Auth.FormItem
          name="user"
          label={t('device.user')}
          rules={[{ required: true, message: t('common.requiredField') }]}
        >
          <DebounceSelect
            showSearch={true}
            value={value}
            placeholder={t('device.user')}
            fetchOptions={fetchUserList}
            onChange={(newValue) => {
              setValue(newValue as UserValue[]);
            }}
            style={{ width: '100%' }}
          />
        </Auth.FormItem>

        <Auth.FormItem
          name="name"
          label={t('device.name')}
          rules={[{ required: true, message: t('common.requiredField') }]}
        >
          <Auth.FormInput placeholder={t('device.name')} />
        </Auth.FormItem>
        <Auth.FormItem
          name="mac"
          label={t('device.mac')}
          rules={[
            {
              pattern: new RegExp(/^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/i),
              message: 'Invalid MAC address',
            },
            { required: true, message: t('common.requiredField') },
          ]}
        >
          <Auth.FormInput placeholder={t('device.mac')} />
        </Auth.FormItem>

        <BaseForm.Item noStyle>
          <Auth.SubmitButton type="primary" htmlType="submit" loading={isLoading}>
            {t('device.create')}
          </Auth.SubmitButton>
        </BaseForm.Item>
      </BaseForm>
    </Auth.FormWrapper>
  );
};

export default DevicesManagerForm;
