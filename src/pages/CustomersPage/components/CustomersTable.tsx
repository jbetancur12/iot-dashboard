import React, { useEffect, useState, useCallback } from 'react';
import { Space } from 'antd';
import { DeviceTableRow } from 'api/table.api';
import { Table } from 'components/common/Table/Table';
import { ColumnsType, TableProps } from 'antd/es/table';
import { Button } from 'components/common/buttons/Button/Button';
import { useTranslation } from 'react-i18next';
import { notificationController } from 'controllers/notificationController';
import { useMounted } from '@app/hooks/useMounted';
import { useTheme } from 'styled-components';

import { doDeleteThing, retrieveThings } from '@app/store/slices/thingSlice';
import { useAppDispatch, useAppSelector } from '@app/hooks/reduxHooks';
import { useNavigate } from 'react-router-dom';
import { retrieveCustomers } from '@app/store/slices/customerSlice';

interface ICustomerTableProps {
  setCustomer?: any;
  setOpen?: any;
  onDelete: (id: string) => void;
}

export const CustomersTable: React.FC<ICustomerTableProps> = ({ setCustomer, setOpen, onDelete }) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { customers } = useAppSelector((state) => state.customer);
  const [tableData, setTableData] = useState<{ data: DeviceTableRow[]; loading: boolean }>({
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

  const handleTableChange: TableProps<DeviceTableRow>['onChange'] = (pagination, filters, sorter, extra) => {
    console.log('params', pagination, filters, sorter, extra);
  };

  const handleEdit = (data: any) => {
    setCustomer(data);
    setOpen(true);
  };

  const columns: ColumnsType<DeviceTableRow> = [
    {
      title: 'id',
      dataIndex: '_id',
    },
    {
      title: 'Name',
      dataIndex: 'name',
      render: (text: string) => <span>{text}</span>,
      sorter: (a, b) => a.name.length - b.name.length,
      ellipsis: true,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      showSorterTooltip: false,
    },
    {
      title: 'Date',
      dataIndex: 'createdAt',
    },
    {
      title: t('tables.actions'),
      dataIndex: 'actions',
      width: '15%',
      render: (text: string, record: { name: string; _id: string }) => {
        return (
          <Space>
            <Button type="ghost" onClick={() => handleEdit(record)}>
              {t('tables.edit')}
            </Button>
            <Button type="default" danger onClick={() => onDelete(record._id)}>
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
      dataSource={customers}
      // loading={tableData.loading}
      onChange={handleTableChange}
      onRow={(record, rowIndex) => {
        return {
          onClick: (event) => {
            navigate(`/customers/${record._id}`);
          },
        };
      }}
      scroll={{ x: 800 }}
      bordered
    />
  );
};
