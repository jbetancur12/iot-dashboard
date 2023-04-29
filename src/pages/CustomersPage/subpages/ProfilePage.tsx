import React, { useEffect, useState } from 'react';
import { Button, Card, Descriptions, Space, Table } from 'antd';
import { useAppDispatch, useAppSelector } from '@app/hooks/reduxHooks';
import { useNavigate, useParams } from 'react-router-dom';
import { retrieveCustomer } from '@app/store/slices/customerSlice';
import { CustomerDataResponse, updateCustomer } from '@app/api/customer.api';
import { PlusOutlined } from '@ant-design/icons';
import UserModal from '../components/userModal'
import { doSignUp } from '@app/store/slices/authSlice';
import { notificationController } from '@app/controllers/notificationController';
import { useTranslation } from 'react-i18next';
import { Tabs, TabPane } from '@app/components/common/Tabs/Tabs';
import { doCreateTemplate, retrieveTemplates } from '@app/store/slices/templateSlice';
import TemplateModal from '../components/TemplateModal';


const { Meta } = Card;


interface SignUpFormData {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    customer?: string;
}

const UserProfile = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [customer, setCustomer] = useState<Partial<CustomerDataResponse>>({})
    const [users, setUsers] = useState([])
    const [templates, setTemplates] = useState([])
    const [open, setOpen] = useState(false)
    const [openTemplate, setOpenTemplate] = useState(false)
    const dispatch = useAppDispatch();

    const { customers } = useAppSelector((state) => state.customer)



    let { id } = useParams();

    const fetchCustomer = () => {
        dispatch(retrieveCustomer(id))
            .unwrap()
            .then(res => {
                setCustomer(res)
                setUsers(res.users)
            })
    }

    const fetchTemplates
        = () => {
            dispatch(retrieveTemplates())
                .unwrap()
                .then((res) => {
                    setTemplates(res)

                })
        }

    useEffect(() => {
        const customerExist = customers.filter(customer => customer._id === id)
        fetchCustomer()
        fetchTemplates()

    }, [])

    const showModal = () => {
        setOpen(true);
    };

    const showModalTemplate = () => {
        setOpenTemplate(true);
    };

    const createUser = (values: SignUpFormData) => {
        dispatch(doSignUp(values))
            .unwrap()
            .then((res) => {
                if (res !== undefined) {
                    // @ts-ignore
                    setUsers(current => [...current, res.user])
                }
                setOpen(false)

                notificationController.success({
                    message: t('auth.signUpSuccessMessage'),
                    description: t('auth.signUpSuccessDescription'),
                });
            })
            .catch((err) => {
                notificationController.error({ message: err.message });
            });
    }



    const createTemplate = (values: any) => {
        dispatch(doCreateTemplate(values))
            .unwrap()
            .then((res) => {
                if (res !== undefined) {
                    // @ts-ignore
                    setTemplates(current => [...current, res.data])
                }
                setOpenTemplate(false)

                notificationController.success({
                    message: t('auth.signUpSuccessMessage'),
                    description: t('auth.signUpSuccessDescription'),
                });
            })
            .catch((err) => {
                notificationController.error({ message: err.message });
            });
    }



    const onCancel = () => {
        setOpen(false)
    }

    const onCancelTemplate = () => {
        setOpenTemplate(false)
    }

    const updateUser = () => {

    }

    const updateTemplate = () => {

    }


    const columns = [
        {
            title: 'Name',
            dataIndex: 'firstName',
            key: 'firstName',
        },
        {
            title: 'LastName',
            dataIndex: 'lastName',
            key: 'lastName',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
    ];

    const columnsTemplates = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
        },
    ];




    return (
        <div>
            <Card
                title="Información del Cliente"
            //   style={{ width: 500, margin: '0 auto' }}
            >
                <Meta title={customer.name} />
                <Space />
                <Descriptions size="small">
                    <Descriptions.Item label="Email">
                        {customer.email}
                    </Descriptions.Item>
                    <Descriptions.Item label="Identificación">
                        {customer.IdCustomer}
                    </Descriptions.Item>
                    <Descriptions.Item label="Dirección">
                        {customer.address1}
                    </Descriptions.Item>
                    <Descriptions.Item label="País">
                        {customer.country}
                    </Descriptions.Item>
                    <Descriptions.Item label="Ciudad">
                        {customer.city}
                    </Descriptions.Item>
                </Descriptions>
                <Space />
                <Tabs defaultActiveKey="1">
                    <TabPane tab={`Usuarios`} key="1">
                        <Button type="primary" icon={<PlusOutlined />} onClick={showModal}>Agregar Usuario</Button>
                        <Table dataSource={users} columns={columns} />
                    </TabPane>
                    <TabPane tab={`Plantillas`} key="2">
                        <Button type="primary" icon={<PlusOutlined />} onClick={showModalTemplate}>Agregar Plantilla</Button>
                        <Table dataSource={templates} columns={columnsTemplates} onRow={(record, rowIndex) => {
                            return {
                                onClick: event => {
                                    // @ts-ignore
                                    navigate(`customers/${customer._id}/template/${record._id}`)
                                }
                            }
                        }
                        } />
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
    );
}

export default UserProfile;