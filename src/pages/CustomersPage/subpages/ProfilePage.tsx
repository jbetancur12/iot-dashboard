import React, { useEffect, useState } from 'react';
import { Button, Card, Descriptions, Space, Table } from 'antd';
import { useAppDispatch, useAppSelector } from '@app/hooks/reduxHooks';
import { useParams } from 'react-router-dom';
import { retrieveCustomer } from '@app/store/slices/customerSlice';
import { CustomerDataResponse, updateCustomer } from '@app/api/customer.api';
import { PlusOutlined } from '@ant-design/icons';
import UserModal from '../components/userModal'
import { doSignUp } from '@app/store/slices/authSlice';
import { notificationController } from '@app/controllers/notificationController';
import { useTranslation } from 'react-i18next';
import { setUser } from '@app/store/slices/userSlice';

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
    const [customer, setCustomer] = useState<Partial<CustomerDataResponse>>({})
    const [users, setUsers] = useState([])
    const [open, setOpen] = useState(false)
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

    useEffect(() => {
        const customerExist = customers.filter(customer => customer._id === id)   
            fetchCustomer()      

    }, [])

    const showModal = () => {
        setOpen(true);
    };

    const createUser = (values: SignUpFormData) => {
        dispatch(doSignUp( values ))
            .unwrap()
            .then((res) => {
               if(res !== undefined){
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


  
    const onCancel = () => {
        setOpen(false)
    }

    const updateUser = () => {

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
                <Button type="primary" icon={<PlusOutlined />} onClick={showModal}>Agregar Usuario</Button>
                <Table dataSource={users} columns={columns} />

            </Card>
            <UserModal
                visible={open}
                onCreate={createUser}
                onCancel={onCancel}
                onUpdate={updateUser}
                user={null}
                customer={customer._id}
            />
        </div>
    );
}

export default UserProfile;