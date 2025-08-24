export interface ColorSet {
  [key: string]: string;
}

export interface ColorPalette {
  brand: ColorSet;
  semiBrand: ColorSet;
  system: ColorSet;
}

export interface TenantConfig {
  logo: string;
  favicon: string;
  name: string;
  colors: ColorPalette;
}

export interface GetMeApiResponse {
  staff: {
    _id: string;
    username: string;
    name: string;
    role: string;
    email: string;
    phone: string;
    status: string;
    createdAt: string;
    updatedAt: string;
  }
}

// Insights API Types
export interface CreateDataGroupPayload {
  name: string;
  description?: string;
  image_path?: string;
}

export interface DataGroupResponse {
  name: string;
  description?: string;
  image_path?: string;
  id: number;
  creation_date: string;
  creator_id: number;
  data_files: DataFileResponse[];
}

export interface DataFileResponse {
  id: number;
  name: string;
  type: string;
  version: DataFileVersionResponse;
}

export interface DataFileVersionResponse {
  id: number;
  version_number: number;
  creation_date: string;
  file_path: string;
  file_size: number;
  status: string;
}

export interface ListDataGroupsResponse {
  data_groups?: DataGroupResponse[];
}

// For direct array response
export type DataGroupsArrayResponse = DataGroupResponse[];

export interface CreateFactSheetPayload {
  name: string;
  description?: string;
  image_path?: string;
  data_group_id: number;
}

export interface FactSheetResponse {
  name: string;
  description?: string;
  image_path?: string;
  id: number;
  creation_date: string;
  data_group_id: number;
  creator_id: number;
  values: FactSheetValueResponse[];
}

export interface CreateDataGroupFieldPayload {
  name: string;
  description: string;
  prompt: string;
  field_type: string;
  data_group_id: number;
}

export interface DataGroupFieldResponse {
  name: string;
  description: string;
  prompt: string;
  field_type: string;
  id: number;
  creation_date: string;
  data_group_id: number;
}

export interface CreateFactSheetValuePayload {
  name: string;
  value: string;
  ai_generated: boolean;
  data_group_field_id: number;
  fact_sheet_id: number;
}

export interface FactSheetValueResponse {
  name: string;
  value: string;
  ai_generated: boolean;
  id: number;
  validation_date: string;
  creation_date: string;
  fact_sheet_id: number;
  data_group_field_id: number;
  sources: {
    page_number: number;
    timestamp: number;
    internal_knowledge: boolean;
    source_file_version_id: number;
    id: number;
    fact_sheet_value_id: number;
  }[];
  data_group_field: {
    name: string;
    description: string;
    prompt: string;
    field_type: string;
    id: number;
    creation_date: string;
    data_group_id: number;
  };
}

export interface UploadFileResponse {
  id: number;
  name: string;
  type: string;
  version: DataFileVersionResponse;
  detail: string;
}