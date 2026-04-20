import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ruanganQueries } from '../data/ruanganQueries';
import { createRuangan, updateRuangan, deleteRuangan } from '../server/functions/ruangan';

export function useRuanganList() {
  return useQuery(ruanganQueries.list());
}

export function useRuanganDetail(id: string) {
  return useQuery(ruanganQueries.detail(id));
}

export function useRuanganMutation() {
  const queryClient = useQueryClient();

  const create = useMutation({
    mutationFn: (data: Parameters<typeof createRuangan>[0]['data']) => createRuangan({ data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ruanganQueries.lists() });
    },
  });

  const update = useMutation({
    mutationFn: (data: Parameters<typeof updateRuangan>[0]['data']) => updateRuangan({ data }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ruanganQueries.lists() });
      queryClient.invalidateQueries({ queryKey: [...ruanganQueries.details(), variables.id] });
    },
  });

  const remove = useMutation({
    mutationFn: (id: string) => deleteRuangan({ data: { id } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ruanganQueries.lists() });
    },
  });

  return { create, update, remove };
}
