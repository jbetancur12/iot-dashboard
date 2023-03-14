import { BaseForm } from '@app/components/common/forms/BaseForm/BaseForm';
import * as Auth from '@app/components/layouts/AuthLayout/AuthLayout.styles';
import { useAppDispatch, useAppSelector } from '@app/hooks/reduxHooks';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import type { SelectProps } from 'antd/es/select';
import debounce from 'lodash.debounce';
import { Form, Select, Spin } from 'antd';
import { doCreateThing, doUpdateThing } from '@app/store/slices/thingSlice';
import { notificationController } from '@app/controllers/notificationController';
import { createUnparsedSourceFile } from 'typescript';
import { ThingData } from '@app/api/thing.api';
import { readToken } from '@app/services/localStorage.service';

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

interface DeviceFormData {
  user: UserValue;
  mac: string;
  name: string;
}

interface DeviceRequestData extends Omit<DeviceFormData, 'user'> {
  user: string;
  mac: string;
  name: string;
  [index: string]: any;
}
interface DeviceUpdateData {
  id: string;
  data: DeviceRequestData;
}

async function fetchUserList(username: string): Promise<UserValue[]> {
  console.log('fetching user', username);

  return fetch(`${process.env.REACT_APP_BASE_URL}api/users/?email=${username}`, {
    method: 'GET',
    headers: {
      'x-access-token': readToken(),
    } as { [key: string]: string },
  })
    .then((response) => response.json())
    .then((body) => {
      console.log(body);
      return body.map((user: { email: string; id: string }) => ({
        label: `${user.email}`,
        value: user.id,
      }));
    });
}

//comments

const DevicesManagerForm: React.FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  let { id } = useParams();
  const dispatch = useAppDispatch();
  const { things } = useAppSelector((state) => state.thing);
  const { t } = useTranslation();
  const isAddMode = !id;

  const [value, setValue] = useState<UserValue[]>([]);
  const [isLoading, setLoading] = useState(false);

  const handleSubmit = (values: DeviceFormData) => {
    const valuesToSend = { ...values, user: values.user.value };
    setLoading(true);
    return isAddMode ? createDevice(valuesToSend) : updateDevice(id, valuesToSend);
  };

  const createDevice = (data: DeviceRequestData) => {
    dispatch(doCreateThing(data))
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

  const updateDevice = (id: string | undefined, data: ThingData) => {
    const dataToUpdate = {
      id: id,
      data,
    };
    dispatch(doUpdateThing(dataToUpdate))
      .unwrap()
      .then((res) => {
        console.log(res);
        notificationController.success({
          message: t('device.deviceUpdatedCreatedSuccesfullly'),
          // @ts-ignored
          description: `${t('device.updatedDevice')} ${res.name} ${t('device.and')} ${res.mac}`,
        });
        navigate(-1);
      })
      .catch((err) => {
        notificationController.error({ message: err.message });
        setLoading(false);
      });
  };

  const getUser = async (id: string | undefined) => {
    const res = await fetch(process.env.REACT_APP_BASE_URL + 'api/users/' + id);
    const user = await res.json();
    console.log(user.email);
    // @ts-ignore
    form.setFields([{ name: 'user', value: { label: user.email, value: user.id } }]);
  };

  useEffect(() => {
    if (!isAddMode) {
      const deviceToEditIndex = things.findIndex((thing) => thing._id === id);
      const deviceToEdit = things[deviceToEditIndex];
      getUser(deviceToEdit.user);
      form.setFields([
        { name: 'mac', value: deviceToEdit.mac },
        { name: 'name', value: deviceToEdit.name },
      ]);
    }
  }, []);

  return (
    <Auth.FormWrapper>
      <BaseForm layout="vertical" onFinish={handleSubmit} requiredMark="optional" form={form}>
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
