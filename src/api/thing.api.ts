import { httpApi } from '@app/api/http.api';
import { DeviceTableData, DeviceTableRow } from './table.api';

export interface ThingData {
  name: string;
  mac: string;
  user: string;
}

export interface ThingDataResponse extends ThingData {
  _id: string;
}
export const getThings = (): Promise<any> => httpApi.get<DeviceTableRow[]>('api/things').then((res) => res.data);

export const createThing = (thingData: ThingData): Promise<undefined> =>
  httpApi.post<undefined>('api/things', { ...thingData }).then(({ data }) => data);

export const updateThing = (id: string | undefined, thingData: ThingData): Promise<undefined> =>
  httpApi.put<undefined>(`api/things/${id}`, { ...thingData }).then(({ data }) => data);

export const deleteThing = (thingId: string): Promise<ThingDataResponse> =>
  httpApi.delete<ThingDataResponse>(`api/things/${thingId}`).then(({ data }) => data);
