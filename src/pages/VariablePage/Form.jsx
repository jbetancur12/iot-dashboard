import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Modal, Form, Input, InputNumber, Select, Spin } from 'antd';
import { useTranslation } from 'react-i18next';
import debounce from 'lodash.debounce';

async function fetchUserList(name) {
    try {
        const response =await fetch(`${process.env.REACT_APP_BASE_URL}api/customers/?name=${name}`)
        const body = await response.json();
        return body.map((customer) => ({
            label:`${customer.name}`,
            value: customer._id,
        }));
    } catch (error) {
        console.error(error);
    }
     
}

function DebounceSelect({
    fetchOptions,
    debounceTimeout = 800,
    ...props
}) {
    const [fetching, setFetching] = useState(false);
    const [options, setOptions] = useState([]);

    const fetchRef = useRef(0);

    const debounceFetcher = useMemo(() => {
        const loadOptions = (value) => {
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

const CrudModal = ({ visible, record, onSave, onCancel, loading }) => {
    const [form] = Form.useForm();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [value, setValue] = useState([]);
    const { t } = useTranslation();
    const isEditMode = !!record

    useEffect(() => {
        form.resetFields();
        if (record) {
            form.setFieldsValue(record);
        }
    }, [form, record]);
    
  
    const handleOk = () => {
        form.validateFields().then(values => {
            setIsSubmitting(true);
            onSave(isEditMode, values, record._id)
        });
    };

    const handleCancel = () => {
        form.resetFields();
        onCancel();
    };
    return (
        <Modal
            visible={visible}
            title={record ? 'Edit Variable' : 'Add Variable'}
            onOk={handleOk}
            onCancel={handleCancel}
            confirmLoading={loading}
        >
            <Form form={form}>
                <Form.Item
                    label="Name"
                    name="name"
                    rules={[{ required: true, message: 'Please input user name' }]}
                >
             <Input></Input>
                </Form.Item>

                <Form.Item
                    label="Sensor Type"
                    name="sensorType"
                    rules={[{ required: true, message: 'Please input sensor Type' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Unit"
                    name="unit"
                    rules={[{ required: true, message: 'Please input unit' }]}
                >
                    <Input />
                </Form.Item>

            { !record &&   <Form.Item
                    label="Customer"
                    name="customer"
                    rules={[{ required: true, message: 'Please input customer' }]}
                >
                          <DebounceSelect
                        showSearch={true}
                        value={value}
                        placeholder={t('device.user')}
                        fetchOptions={fetchUserList}
                        onChange={(newValue) => {
                            setValue(newValue);
                        }}
                        style={{ width: '100%' }}
                    />
                </Form.Item>}

                <Form.Item
                    label="Template"
                    name="template"
                    rules={[{ required: true, message: 'Please input template' }]}
                >
                    <InputNumber />
                </Form.Item>
                <Form.Item
                    label="Virtual Pin"
                    name="virtualPin"
                    rules={[{ required: true, message: 'Please input Virtual Pin' }]}
                >
                    <InputNumber />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default CrudModal;