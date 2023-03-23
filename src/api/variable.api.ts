import { httpApi } from '@app/api/http.api';


export interface VariableData {
  name: string;
  sensorType: string;
  unit: string;
  customer: string;
  template: number  ;
  virtualPin : number;
}

export interface VariablesTableRow extends VariableData {
    createdAt: string;
    updatedAt: string;
    _id: string;
  }

// export interface VariableData {
//   name: string;
//   mac: string;
//   user: string;
// }

// export interface VariableMeasure {
//   _id: string;
//   averageT: number;
//   averageH: number;
// }

export interface VariableDataResponse extends VariableData {
  _id: string;
}
export const getVariables = (): Promise<any> => httpApi.get<VariablesTableRow[]>('api/variables').then((res) => res.data);

export const createVariable = (variablesData: VariableData): Promise<undefined> =>
  httpApi.post<undefined>('api/variables', { ...variablesData }).then(({ data }) => data);

export const updateVariable = (id: string | undefined, variablesData: VariableData): Promise<undefined> =>
  httpApi.put<undefined>(`api/variables/${id}`, { ...variablesData }).then(({ data }) => data);

export const deleteVariable = (variablesId: string): Promise<VariableDataResponse> =>
  httpApi.delete<VariableDataResponse>(`api/variables/${variablesId}`).then(({ data }) => data);

// export const getUserVariables = (userId: string | undefined): Promise<VariableDataResponse[]> =>
//   httpApi.get<VariableDataResponse[]>(`api/variables?user=${userId}`).then(({ data }) => data);

// export const getVariableMeasurements = (startDate: AppDate, endDate: AppDate, mac: string | null): Promise<any> =>
//   httpApi.get<VariableMeasure[]>(
//     `api/sensor/data?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}&unit=minute&period=15&mac=${mac}`,
//   );
