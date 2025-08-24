/* eslint-disable @typescript-eslint/no-explicit-any */
import { DataGroupResponse, FactSheetResponse } from '@/types';

type ListEnvelope<T> = { results: T[] } | T[];

type GroupsEnvelope = {
  data: DataGroupResponse[];
  hasNext?: boolean;
  limit: number;
  offset: number;
  total: number | null;
};

function unwrap<T>(raw: ListEnvelope<T>): T[] {
  return Array.isArray(raw) ? raw : (raw?.results ?? []);
}

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url, { next: { revalidate: 60 } });
  if (!res.ok) throw new Error(`API error ${res.status}: ${res.statusText}`);
  return res.json() as Promise<T>;
}

export async function listDataGroups(offset = 0, limit = 100): Promise<DataGroupResponse[]> {
  const url = `/api/insight/data-group?offset=${offset}&limit=${limit}&user_id=1`;
  const env = await fetchJson<GroupsEnvelope>(url);
  return env.data ?? [];
}

export async function listFactSheets(
  offset = 0,
  limit = 20,
  data_group_id?: number
): Promise<{ items: FactSheetResponse[]; hasNext: boolean; offset: number; limit: number }> {
  const params = new URLSearchParams({
    offset: String(offset),
    limit: String(limit),
    user_id: '1',
  });
  if (data_group_id) params.set('data_group_id', String(data_group_id));

  const raw = await fetchJson<ListEnvelope<FactSheetResponse>>(`/api/insight/fact-sheet?${params}`);
  const items = unwrap(raw);
  return { items, hasNext: items.length === limit, offset, limit };
}

export async function getFactSheet(id: number): Promise<FactSheetResponse> {
  const url = `/api/insight/fact-sheet?id=${id}&user_id=1`;
  return fetchJson<FactSheetResponse>(url);
}

// NOT sure what its used for as its not used in the code
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
