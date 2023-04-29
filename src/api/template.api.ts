import { httpApi } from '@app/api/http.api';
import { AppDate } from '@app/constants/Dates';
import {  TemplateTableRow } from './table.api';


export interface TemplateData {
    name: string;
    description: string;
  }
  

  export interface TemplateDataResponse extends TemplateData {
    _id: string ;
  }



export const getTemplates = (): Promise<any> => httpApi.get<TemplateTableRow[]>('api/templates').then((res) => res.data);

export const createTemplate = (templateData: TemplateData): Promise<undefined> =>
  httpApi.post<undefined>('api/templates', { ...templateData }).then(({ data }) => data);

export const updateTemplate = (id: string | undefined, templateData: TemplateData): Promise<any> =>
  httpApi.put<TemplateDataResponse>(`api/templates/${id}`, { ...templateData }).then(({ data }) => data);

export const deleteTemplate = (templateId: string): Promise<TemplateDataResponse> =>
  httpApi.delete<TemplateDataResponse>(`api/templates/${templateId}`).then(({ data }) => data);

export const getTemplate = (templateId: any): Promise<TemplateDataResponse> => 
  httpApi.get<TemplateDataResponse>(`api/templates/${templateId}`).then(({ data }) => data)
