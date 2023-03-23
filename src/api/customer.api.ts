import { httpApi } from '@app/api/http.api';
import { AppDate } from '@app/constants/Dates';
import { DeviceTableData, DeviceTableRow } from './table.api';

enum TypeCustomer {
    natural,
    company
}

export interface CustomerData {
  name: string;
  typeCustomer: TypeCustomer;
  idCustomer: string;
  email: string;
  phone: string;
  lang : string;
  country: string;
  city: string;
  address1: string;
  address2: string;
  zipcode: Number;
  password: string;
}

export interface CustomersTableRow extends CustomerData {
    createdAt: string;
    updatedAt: string;
    _id: string;
  }

// export interface CustomerData {
//   name: string;
//   mac: string;
//   user: string;
// }

// export interface CustomerMeasure {
//   _id: string;
//   averageT: number;
//   averageH: number;
// }

export interface CustomerDataResponse extends CustomerData {
  _id: string;
}
export const getCustomers = (): Promise<any> => httpApi.get<CustomersTableRow[]>('api/customers').then((res) => res.data);

export const createCustomer = (customerData: CustomerData): Promise<undefined> =>
  httpApi.post<undefined>('api/customers', { ...customerData }).then(({ data }) => data);

export const updateCustomer = (id: string | undefined, customerData: CustomerData): Promise<undefined> =>
  httpApi.put<undefined>(`api/customers/${id}`, { ...customerData }).then(({ data }) => data);

export const deleteCustomer = (customerId: string): Promise<CustomerDataResponse> =>
  httpApi.delete<CustomerDataResponse>(`api/customers/${customerId}`).then(({ data }) => data);

// export const getUserCustomers = (userId: string | undefined): Promise<CustomerDataResponse[]> =>
//   httpApi.get<CustomerDataResponse[]>(`api/customers?user=${userId}`).then(({ data }) => data);

// export const getCustomerMeasurements = (startDate: AppDate, endDate: AppDate, mac: string | null): Promise<any> =>
//   httpApi.get<CustomerMeasure[]>(
//     `api/sensor/data?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}&unit=minute&period=15&mac=${mac}`,
//   );
