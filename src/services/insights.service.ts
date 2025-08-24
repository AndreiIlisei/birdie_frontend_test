/* eslint-disable @typescript-eslint/no-explicit-any */
import { DataGroupResponse, DataGroupsArrayResponse, FactSheetResponse } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_FACTSHEET;

if (!API_URL) {
  throw new Error('Missing API base URL');
}

// UTIL TO FETCH JSON FROM API
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

export const listDataGroups = async (
  offset: number = 0,
  limit: number = 10
): Promise<DataGroupsArrayResponse> => {
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

export async function listFactSheets(
  offset = 0,
  limit = 100,
  data_group_id?: number
): Promise<FactSheetResponse[]> {
  const url = new URL(`${API_URL}/fact_sheet/`);
  url.searchParams.set('offset', String(offset));
  url.searchParams.set('limit', String(limit));
  url.searchParams.set('user_id', '1');

  if (data_group_id) url.searchParams.set('data_group_id', String(data_group_id));

  const data = await fetchJson<FactSheetResponse[]>(url.toString());

  return data;
}

export async function getFactSheet(id: number): Promise<FactSheetResponse> {
  return fetchJson<FactSheetResponse>(`${API_URL}/fact_sheet/${id}?user_id=1`);
}
