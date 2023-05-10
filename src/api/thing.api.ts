import { httpApi } from '@app/api/http.api'
import { AppDate } from '@app/constants/Dates'
import { DeviceTableData, DeviceTableRow } from './table.api'

export interface ThingData {
  name: string
  mac: string
  user: string
}

export interface ThingMeasure {
  _id: string
  averageT: number
  averageH: number
}

export interface ThingDataResponse extends ThingData {
  _id: string
}
export const getThings = (): Promise<any> =>
  httpApi.get<DeviceTableRow[]>('api/things').then((res) => res.data)

export const createThing = (thingData: ThingData): Promise<undefined> =>
  httpApi
    .post<undefined>('api/things', { ...thingData })
    .then(({ data }) => data)

export const updateThing = (
  id: string | undefined,
  thingData: ThingData
): Promise<undefined> =>
  httpApi
    .put<undefined>(`api/things/${id}`, { ...thingData })
    .then(({ data }) => data)

export const deleteThing = (thingId: string): Promise<ThingDataResponse> =>
  httpApi
    .delete<ThingDataResponse>(`api/things/${thingId}`)
    .then(({ data }) => data)

export const getUserThings = (
  userId: string | undefined
): Promise<ThingDataResponse[]> =>
  httpApi
    .get<ThingDataResponse[]>(`api/things?user=${userId}`)
    .then(({ data }) => data)

export const getThingMeasurements = (
  startDate: AppDate,
  endDate: AppDate,
  mac: string | null
): Promise<any> =>
  httpApi.get<ThingMeasure[]>(
    `api/sensor/data?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}&unit=minute&period=15&mac=${mac}`
  )
