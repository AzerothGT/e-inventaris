import { queryOptions } from '@tanstack/react-query';
import { getRuanganList, getRuanganById } from '../server/functions/ruangan';

export const ruanganQueries = {
  all: () => ['ruangan'] as const,
  lists: () => [...ruanganQueries.all(), 'list'] as const,
  list: () => 
    queryOptions({
      queryKey: ruanganQueries.lists(),
      queryFn: () => getRuanganList(),
    }),
  details: () => [...ruanganQueries.all(), 'detail'] as const,
  detail: (id: string) =>
    queryOptions({
      queryKey: [...ruanganQueries.details(), id] as const,
      queryFn: () => getRuanganById({ data: { id } }),
    }),
};
