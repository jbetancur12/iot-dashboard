import { httpApi } from '@app/api/http.api'
import { VariableTableRow } from './table.api'

export interface VariableData {
  unit: string
  sensorType: string
  virtualPin: number
  customer: string
  template: string
  name: string
  typePin: string
}

export interface VariableDataResponse extends VariableData {
  _id: string
}

export const getVariables = (): Promise<any> =>
  httpApi.get<VariableTableRow[]>('api/variables').then((res) => res.data)

export const createVariable = (
  variableData: VariableData
): Promise<undefined> =>
  httpApi
    .post<undefined>('api/variables', { ...variableData })
    .then(({ data }) => data)

export const updateVariable = (
  id: string | undefined,
  variableData: VariableData
): Promise<any> =>
  httpApi
    .put<VariableDataResponse>(`api/variables/${id}`, { ...variableData })
    .then(({ data }) => data)

export const deleteVariable = (
  variableId: string
): Promise<VariableDataResponse> =>
  httpApi
    .delete<VariableDataResponse>(`api/variables/${variableId}`)
    .then(({ data }) => data)

export const getVariable = (variableId: any): Promise<VariableDataResponse> =>
  httpApi
    .get<VariableDataResponse>(`api/variables/${variableId}`)
    .then(({ data }) => data)
