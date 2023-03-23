import React, { useEffect, useState, useCallback } from 'react';
import { Col, Row, Space, TablePaginationConfig } from 'antd';
import {
    BasicTableRow,
    DeviceTableData,
    DeviceTableRow,
    getBasicTableData,
    getDevicesData,
    Pagination,
    Tag,
} from 'api/table.api';
import { Table } from 'components/common/Table/Table';
import { ColumnsType, TableProps } from 'antd/es/table';
import { Button } from 'components/common/buttons/Button/Button';
import { useTranslation } from 'react-i18next';
import { defineColorByPriority } from '@app/utils/utils';
import { notificationController } from 'controllers/notificationController';
import { Status } from '@app/components/profile/profileCard/profileFormNav/nav/payments/paymentHistory/Status/Status';
import { useMounted } from '@app/hooks/useMounted';
import { useTheme } from 'styled-components';


import { useAppDispatch, useAppSelector } from '@app/hooks/reduxHooks';
import { useNavigate } from 'react-router-dom';
import { doDeleteVariable, retrieveVariables } from '@app/store/slices/variableSlice';


interface VariablesTableProps {
    onClickEdit: (record: { name: string; _id: string }) => void;
}

export const VariablesTable = ({onClickEdit}: VariablesTableProps) => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { variables } = useAppSelector((state) => state.variable);
    const [tableData, setTableData] = useState<{ data: DeviceTableRow[]; loading: boolean }>({
        data: [],
        loading: false,
    });

    const initFetch = useCallback(() => {
        dispatch(retrieveVariables());
    }, [dispatch]);

    useEffect(() => {
        initFetch();
    }, [initFetch]);

    const { t } = useTranslation();
    const { isMounted } = useMounted();

    const theme = useTheme();

    // const fetch = useCallback(() => {
    //   setTableData((tableData) => ({ ...tableData, loading: true }));
    //   getDevicesData().then((res) => {
    //     if (isMounted.current) {
    //       setTableData({ data: res.data, loading: false });
    //     }
    //   });
    // }, [isMounted]);

    // useEffect(() => {
    //   fetch();
    // }, [fetch]);

    const handleTableChange: TableProps<DeviceTableRow>['onChange'] = (pagination, filters, sorter, extra) => {
        console.log('params', pagination, filters, sorter, extra);
    };

    const handleDeleteRow = (rowId: string) => {
        dispatch(doDeleteVariable(rowId))
            .unwrap()
            .then((data) => {
                notificationController.success({
                    message: t('device.deviceDeletedSuccesfullly'),
                    // @ts-ignored
                    description: data.name,
                });
            })
            .catch((err) => {
                notificationController.error({ message: err.message });
            });
    };

    const columns: ColumnsType<DeviceTableRow> = [
        {
            title: 'Name',
            dataIndex: 'name',
            render: (text: string) => <span>{text}</span>,
            sorter: (a, b) => a.name.length - b.name.length,
            // sortOrder: sortedInfo.columnKey === 'name' ? sortedInfo.order : null,
            ellipsis: true,
            // sorter: (a: BasicTableRow, b: BasicTableRow) => a.age - b.age,
            // filters: [
            //   {
            //     text: t('common.firstName'),
            //     value: 'firstName',
            //     children: [
            //       {
            //         text: 'Joe',
            //         value: 'Joe',
            //       },
            //       {
            //         text: 'Pavel',
            //         value: 'Pavel',
            //       },
            //       {
            //         text: 'Jim',
            //         value: 'Jim',
            //       },
            //       {
            //         text: 'Josh',
            //         value: 'Josh',
            //       },
            //     ],
            //   },
            //   {
            //     text: t('common.lastName'),
            //     value: 'lastName',
            //     children: [
            //       {
            //         text: 'Green',
            //         value: 'Green',
            //       },
            //       {
            //         text: 'Black',
            //         value: 'Black',
            //       },
            //       {
            //         text: 'Brown',
            //         value: 'Brown',
            //       },
            //     ],
            //   },
            // ],
            // onFilter: (value: string | number | boolean, record: BasicTableRow) => record.name.includes(value.toString()),
        },
        {
            title: 'Sensor Type',
            dataIndex: 'sensorType',
            // sorter: (a: BasicTableRow, b: BasicTableRow) => a.age - b.age,
            showSorterTooltip: false,
        },
        {
            title: 'Unit',
            dataIndex: 'unit',
        },
        {
            title: 'Customer',
            dataIndex: 'customer',
        },
        {
            title: 'Template',
            dataIndex: 'template',
        },
        {
            title: 'Virtual Pin',
            dataIndex: 'virtualPin',
        },
        {
            title: t('tables.actions'),
            dataIndex: 'actions',
            width: '15%',
            render: (text: string, record: { name: string; _id: string }) => {
                return (
                    <Space>
                        <Button type="ghost" onClick={()=>onClickEdit(record)}>
                            {t('tables.edit')}
                        </Button>
                        <Button type="default" danger onClick={() => handleDeleteRow(record._id)}>
                            {t('tables.delete')}
                        </Button>
                    </Space>
                );
            },
        },
    ];

    return (
        <Table
            columns={columns}
            dataSource={variables}
            // loading={tableData.loading}
            onChange={handleTableChange}
            scroll={{ x: 800 }}
            bordered
        />
    );
};
