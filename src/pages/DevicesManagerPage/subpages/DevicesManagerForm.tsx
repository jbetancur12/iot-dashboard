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

interface UserForm {
  value: string;
  label: string;
}

interface SignUpFormData {
  user: UserForm;
  mac: string;
  name: string;
}

const initValues = {
  firstName: 'Christopher',
  lastName: 'Johnson',
  email: 'christopher.johnson@altence.com',
  password: 'test-pass',
  confirmPassword: 'test-pass',
  termOfUse: true,
};

interface UserValue {
  label: string;
  value: string;
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

  // return fetch('https://randomuser.me/api/?results=5')
  //   .then((response) => response.json())
  //   .then((body) =>
  //     body.results.map((user: { name: { first: string; last: string }; login: { username: string } }) => ({
  //       label: `${user.name.first} ${user.name.last}`,
  //       value: user.login.username,
  //     })),
  //   );
}

const DevicesManagerForm: React.FC = () => {
  const [value, setValue] = useState<UserValue[]>([]);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [isLoading, setLoading] = useState(false);

  const handleSubmit = (values: SignUpFormData) => {
    setLoading(true);
    console.log(values.user.value);
  };

  return (
    <Auth.FormWrapper>
      <BaseForm layout="vertical" onFinish={handleSubmit} requiredMark="optional" initialValues={initValues}>
        {/* <S.Title>{t('common.signUp')}</S.Title> */}
        <Auth.FormItem
          name="user"
          label={t('device.user')}
          rules={[{ required: true, message: t('common.requiredField') }]}
        >
          <DebounceSelect
            showSearch={true}
            value={value}
            placeholder="Select users"
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
          rules={[{ required: true, message: t('common.requiredField') }]}
        >
          <Auth.FormInput placeholder={t('device.mac')} />
        </Auth.FormItem>

        <BaseForm.Item noStyle>
          <Auth.SubmitButton type="primary" htmlType="submit" loading={isLoading}>
            {t('common.signUp')}
          </Auth.SubmitButton>
        </BaseForm.Item>

        <Auth.FooterWrapper>
          <Auth.Text>
            {t('signup.alreadyHaveAccount')}{' '}
            <Link to="/auth/login">
              <Auth.LinkText>{t('common.here')}</Auth.LinkText>
            </Link>
          </Auth.Text>
        </Auth.FooterWrapper>
      </BaseForm>
    </Auth.FormWrapper>
  );
};

export default DevicesManagerForm;
