/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  DataGroupResponse,
  DataGroupsArrayResponse,
  FactSheetResponse,
  // DataGroupFieldResponse, // Unused in mock implementation
  // FactSheetValueResponse, // Unused in mock implementation
} from '@/types';

const API_URL = process.env.API_FACTSHEET;

async function fetchJson<T>(url: string): Promise<T> {
  try {
    const res = await fetch(url, {
      // With Next.js App Router you can hint caching
      next: { revalidate: 60 },
    });
    if (!res.ok) {
      throw new Error(`API error ${res.status}: ${res.statusText}`);
    }
    return res.json() as Promise<T>;
  } catch (err) {
    console.error('Fetch error:', err);
    throw err;
  }
}

console.log('IS API: ' + API_URL);

// Mock data for technical interview
const mockDataGroups: DataGroupResponse[] = [
  {
    id: 1,
    name: 'Customer Research',
    description: 'Customer insights and behavior analysis',
    image_path: '/placeholder.png',
    creation_date: '2024-01-15T10:00:00Z',
    creator_id: 1,
    data_files: [
      {
        id: 1,
        name: 'customer_survey_2024.pdf',
        type: 'pdf',
        version: {
          id: 1,
          version_number: 1,
          creation_date: '2024-01-15T10:00:00Z',
          file_path: '/files/customer_survey_2024.pdf',
          file_size: 2048576,
          status: 'processed',
        },
      },
    ],
  },
  {
    id: 2,
    name: 'Market Analysis',
    description: 'Market trends and competitive analysis',
    image_path: '/placeholder.png',
    creation_date: '2024-01-20T14:30:00Z',
    creator_id: 1,
    data_files: [
      {
        id: 2,
        name: 'market_report_q1.xlsx',
        type: 'xlsx',
        version: {
          id: 2,
          version_number: 1,
          creation_date: '2024-01-20T14:30:00Z',
          file_path: '/files/market_report_q1.xlsx',
          file_size: 1024768,
          status: 'processed',
        },
      },
    ],
  },
  {
    id: 3,
    name: 'User Personas',
    description: 'Detailed user persona profiles and characteristics',
    image_path: '/placeholder.png',
    creation_date: '2024-02-01T09:15:00Z',
    creator_id: 1,
    data_files: [],
  },
];

const mockFactSheets: FactSheetResponse[] = [
  {
    id: 1,
    name: 'Primary Customer Persona',
    description: 'Main target customer profile',
    image_path: '/placeholder.png',
    creation_date: '2024-01-16T11:00:00Z',
    data_group_id: 1,
    creator_id: 1,
    values: [
      {
        id: 1,
        name: 'Age Range',
        value: '25-40 years old',
        ai_generated: false,
        validation_date: '2024-01-16T11:00:00Z',
        creation_date: '2024-01-16T11:00:00Z',
        fact_sheet_id: 1,
        data_group_field_id: 1,
        sources: [],
        data_group_field: {
          id: 1,
          name: 'Demographics',
          description: 'Age and demographic information',
          prompt: 'Extract demographic information',
          field_type: 'text',
          creation_date: '2024-01-16T11:00:00Z',
          data_group_id: 1,
        },
      },
      {
        id: 2,
        name: 'Income Level',
        value: '$50,000 - $80,000 annually',
        ai_generated: true,
        validation_date: '2024-01-16T11:00:00Z',
        creation_date: '2024-01-16T11:00:00Z',
        fact_sheet_id: 1,
        data_group_field_id: 2,
        sources: [],
        data_group_field: {
          id: 2,
          name: 'Income',
          description: 'Annual income range',
          prompt: 'Extract income information',
          field_type: 'text',
          creation_date: '2024-01-16T11:00:00Z',
          data_group_id: 1,
        },
      },
    ],
  },
  {
    id: 2,
    name: 'Secondary Customer Persona',
    description: 'Secondary target customer profile',
    image_path: '/placeholder.png',
    creation_date: '2024-01-18T15:30:00Z',
    data_group_id: 1,
    creator_id: 1,
    values: [],
  },
  {
    id: 3,
    name: 'Market Competitor Analysis',
    description: 'Analysis of main competitors',
    image_path: '/placeholder.png',
    creation_date: '2024-01-21T10:00:00Z',
    data_group_id: 2,
    creator_id: 1,
    values: [],
  },
];

// Mock API functions for interview candidates to implement
// TODO: Replace these with real API calls using fetch or axios
// export const listDataGroups = async (
//   offset: number = 0,
//   limit: number = 10,
//   // eslint-disable-next-line @typescript-eslint/no-unused-vars
//   _data_group_id?: number // Prefixed with underscore to indicate unused parameter
// ): Promise<DataGroupsArrayResponse> => {
//   // Simulate API delay
//   await new Promise(resolve => setTimeout(resolve, 500));

//   // TODO: Implement real API call to GET /api/insight/data-group

//   return mockDataGroups.slice(offset, offset + limit);
// };

export const listDataGroups = async (
  offset: number = 0,
  limit: number = 10
): Promise<DataGroupsArrayResponse> => {
  // GET /api/v1/data_group/?offset=0&limit=100&user_id=1
  return fetchJson<DataGroupsArrayResponse>(
    `${API_URL}/data_group/?offset=${offset}&limit=${limit}&user_id=1`
  );
};

export const getDataGroup = async (id: number): Promise<DataGroupResponse> => {
  // API doesn’t expose single /data_group/:id (only list),
  // so fetch all and find locally
  const all = await listDataGroups(0, 100);
  const found = (all as any).results?.find((g: DataGroupResponse) => g.id === id);
  if (!found) throw new Error(`Data group with id ${id} not found`);
  return found;
};

// export const getDataGroup = async (id: number): Promise<DataGroupResponse> => {
//   // Simulate API delay
//   await new Promise((resolve) => setTimeout(resolve, 300));

//   // TODO: Implement real API call to GET /api/insight/data

//   const dataGroup = mockDataGroups.find((group) => group.id === id);
//   if (!dataGroup) {
//     throw new Error(`Data group with id ${id} not found`);
//   }
//   return dataGroup;
// };

export const getFactSheet = async (id: number): Promise<FactSheetResponse> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300));

  // TODO: Implement real API call to GET /api/insight/fact-sheet

  const factSheet = mockFactSheets.find((sheet) => sheet.id === id);
  if (!factSheet) {
    throw new Error(`Fact sheet with id ${id} not found`);
  }
  return factSheet;
};

export const listFactSheets = async (
  offset: number = 0,
  limit: number = 10,
  data_group_id?: number
): Promise<FactSheetResponse[]> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 400));

  // TODO: Implement real API call to GET /api/insight/fact-sheet

  let filteredFactSheets = mockFactSheets;
  if (data_group_id !== undefined) {
    filteredFactSheets = mockFactSheets.filter((sheet) => sheet.data_group_id === data_group_id);
  }

  return filteredFactSheets.slice(offset, offset + limit);
};
