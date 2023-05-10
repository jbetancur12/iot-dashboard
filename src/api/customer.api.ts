import { httpApi } from '@app/api/http.api';
import { AppDate } from '@app/constants/Dates';
import { CustomerTableRow } from './table.api';

export interface CustomerData {
  name: string;
  IdCustomer: string;
  email: string;
  phone: string;
  country: string;
  city: string;
  address1: string;
  createdAt: Date;
  users: [];
}

export interface CustomerDataResponse extends CustomerData {
  _id: string;
}

export const getCustomers = (): Promise<any> =>
  httpApi.get<CustomerTableRow[]>('api/customers').then((res) => res.data);

export const createCustomer = (customerData: CustomerData): Promise<undefined> =>
  httpApi.post<undefined>('api/customers', { ...customerData }).then(({ data }) => data);

export const updateCustomer = (id: string | undefined, customerData: CustomerData): Promise<any> =>
  httpApi.put<CustomerDataResponse>(`api/customers/${id}`, { ...customerData }).then(({ data }) => data);

export const deleteCustomer = (customerId: string): Promise<CustomerDataResponse> =>
  httpApi.delete<CustomerDataResponse>(`api/customers/${customerId}`).then(({ data }) => data);

export const getCustomer = (customerId: string | any): Promise<CustomerDataResponse> =>
  httpApi.get<CustomerDataResponse>(`api/customers/${customerId}`).then(({ data }) => data);
