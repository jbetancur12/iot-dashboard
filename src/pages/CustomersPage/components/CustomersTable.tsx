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

import { CustomersTableRow } from '@app/api/customer.api';
import { Table } from 'components/common/Table/Table';
import { ColumnsType, TableProps } from 'antd/es/table';
import { Button } from 'components/common/buttons/Button/Button';
import { useTranslation } from 'react-i18next';
import { defineColorByPriority } from '@app/utils/utils';
import { notificationController } from 'controllers/notificationController';
import { Status } from '@app/components/profile/profileCard/profileFormNav/nav/payments/paymentHistory/Status/Status';
import { useMounted } from '@app/hooks/useMounted';
import { useTheme } from 'styled-components';

import {doDeleteCustomer, retrieveCustomers } from '@app/store/slices/customerSlice';
import { useAppDispatch, useAppSelector } from '@app/hooks/reduxHooks';
import { useNavigate } from 'react-router-dom';
import { DeleteOutlined, EditOutlined, SearchOutlined } from '@ant-design/icons';

export const CustomersTable: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { customers } = useAppSelector((state) => state.customer);

  console.log(customers)
  const [tableData, setTableData] = useState<{ data: CustomersTableRow[]; loading: boolean }>({
    data: [],
    loading: false,
  });

  const initFetch = useCallback(() => {
    dispatch(retrieveCustomers());
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

  const handleTableChange: TableProps<CustomersTableRow>['onChange'] = (pagination, filters, sorter, extra) => {
    console.log('params', pagination, filters, sorter, extra);
  };

  const handleDeleteRow = (rowId: string) => {
    dispatch(doDeleteCustomer(rowId))
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

  const columns: ColumnsType<CustomersTableRow> = [
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
      title: 'ID',
      dataIndex: 'IdCustomer',
      // sorter: (a: BasicTableRow, b: BasicTableRow) => a.age - b.age,
      showSorterTooltip: false,
    },
    {
      title: 'Date',
      dataIndex: 'createdAt',
    },
    {
      title: t('tables.actions'),
      dataIndex: 'actions',
      //width: '15%',
      render: (text: string, record: { name: string; _id: string }) => {
      
        return (
          <Space>
            <Button type="link" onClick={() => navigate(`edit-user/${record._id}`)} icon={<EditOutlined />}>
              {/* {t('tables.edit')} */}
            </Button>
            <Button type="link" danger onClick={() => handleDeleteRow(record._id)} icon={<DeleteOutlined />}> 
              {/* {t('tables.delete')}   */}
            </Button>
          </Space>
        );
      },
    },

  ];

  return (
    <Table
      columns={columns}
      dataSource={customers}
      // loading={tableData.loading}
      onChange={handleTableChange}
      scroll={{ x: 800 }}
      bordered
    />
  );
};
