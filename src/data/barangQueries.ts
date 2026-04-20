import { queryOptions } from '@tanstack/react-query';
import { getBarangList, getBarangById } from '../server/functions/barang';

export const barangQueries = {
  all: () => ['barang'] as const,
  lists: () => [...barangQueries.all(), 'list'] as const,
  list: () => 
    queryOptions({
      queryKey: barangQueries.lists(),
      queryFn: () => getBarangList(),
    }),
  details: () => [...barangQueries.all(), 'detail'] as const,
  detail: (id: string) =>
    queryOptions({
      queryKey: [...barangQueries.details(), id] as const,
      queryFn: () => getBarangById({ data: { id } }),
    }),
};
