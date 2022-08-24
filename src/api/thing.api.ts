import { httpApi } from '@app/api/http.api';

export interface ThingData {
  name: string;
  mac: string;
  user: string;
}

export const createThing = (thingData: ThingData): Promise<undefined> =>
  httpApi.post<undefined>('api/things', { ...thingData }).then(({ data }) => data);
