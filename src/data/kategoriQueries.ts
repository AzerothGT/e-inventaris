import { queryOptions } from '@tanstack/react-query';
import { getKategoriList } from '../server/functions/kategori';

export const kategoriQueries = {
  all: () => ['kategori'] as const,
  lists: () => [...kategoriQueries.all(), 'list'] as const,
  list: () => 
    queryOptions({
      queryKey: kategoriQueries.lists(),
      queryFn: () => getKategoriList(),
      staleTime: 30 * 60 * 1000,
    }),
};
