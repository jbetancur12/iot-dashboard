import React, { useEffect, useState } from 'react';
import { Button, Card, Descriptions, Space, Table } from 'antd';
import { useAppDispatch, useAppSelector } from '@app/hooks/reduxHooks';
import { useParams } from 'react-router-dom';
// import { retrieveCustomer } from '@app/store/slices/templateSlice';
// import { CustomerDataResponse, updateCustomer } from '@app/api/template.api';
import { PlusOutlined } from '@ant-design/icons';
import { notificationController } from '@app/controllers/notificationController';
import { useTranslation } from 'react-i18next';
import { retrieveTemplate} from '@app/store/slices/templateSlice';
import { TemplateDataResponse } from '@app/api/template.api';
import VariableModal from '../components/VariableModal';
import { doCreateVariable, doDeleteVariable } from '@app/store/slices/variableSlice';
import { VariableData } from '@app/api/variable.api';


const { Meta } = Card;



const TemplateProfile = () => {
    const { t } = useTranslation();
    const [template, setTemplate] = useState<Partial<TemplateDataResponse>>({})
    const [variables, setVariables] = useState([])
    const [open, setOpen] = useState(false)
    const dispatch = useAppDispatch();

    const { templates } = useAppSelector((state) => state.template)



    let { id, idTemplate } = useParams();


    const fetchTemplate = () => {
        dispatch(retrieveTemplate(idTemplate))
            .unwrap()
            .then(res => {
                setTemplate(res)
    
                // @ts-ignore
                setVariables(res.variables)                
            })
    }



    useEffect(() => {
        fetchTemplate()
    }, [])

    const showModal = () => {
        setOpen(true);
    };





    const createVariable = (values: VariableData) => {
      
        dispatch(doCreateVariable(values))
        .unwrap()
        .then((res) => {
            if (res !== undefined) {
                console.log("XXXXXXXXXXX", res)
                // @ts-ignore
                setVariables(current => [...current, res.data])
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

    const handleDeleteRow = (rowId: string) => {
        dispatch(doDeleteVariable(rowId))
          .unwrap()
          .then((data) => {
            notificationController.success({
              message: "Variable eliminada",
              // @ts-ignored
              description: data.name,
            });
          })
          .catch((err) => {
            notificationController.error({ message: err.message });
          });
      };



    const onCancel = () => {
        setOpen(false)
    }


    const updateVariable = () => {

    }


    const columns = [
        {
            title: 'Nombre',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Tipo de Sensor',
            dataIndex: 'sensorType',
            key: 'sensorType',
        },
        {
            title: 'Unidad',
            dataIndex: 'unit',
            key: 'unit',
        },
        {
            title: 'Pin Virtual',
            dataIndex: 'virtualPin',
            key: 'virtualPin',
        },
        {
            title: 'Tipo',
            dataIndex: 'typePin',
            key: 'typePin',
        },
        {
            title: t('tables.actions'),
            dataIndex: 'actions',
            width: '15%',
            render: (text: string, record: { name: string; _id: string }) => {
              return (
                <Space>
                  <Button type="default" danger onClick={() => handleDeleteRow(record._id)}>
                    {t('tables.delete')}
                  </Button>
                </Space>
              );
            },
          },
    ];





    return (
        <div>
            <Card
                title="Información de la Plantilla"
            //   style={{ width: 500, margin: '0 auto' }}
            >
                <Meta title={template.name} />
                <Space />
                <Descriptions size="small">
                    <Descriptions.Item label="Name">
                        {template.name}
                    </Descriptions.Item>
                    <Descriptions.Item label="Description">
                        {template.description}
                    </Descriptions.Item>
                    <Descriptions.Item label="Tipo">
                        {template.type}
                    </Descriptions.Item>
                </Descriptions>
                <Space />
                <Button type="primary" icon={<PlusOutlined />} onClick={showModal}>Agregar Variable</Button>
                <Table dataSource={variables} columns={columns} />


            </Card>
            <VariableModal
                visible={open}
                onCreate={createVariable}
                onCancel={onCancel}
                onUpdate={updateVariable}
                customer={id}
                template={idTemplate}
                variable={null}
            />

        </div>
    );
}

export default TemplateProfile;