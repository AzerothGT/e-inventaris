import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { barangQueries } from '../data/barangQueries';
import { createBarang, updateBarang, deleteBarang } from '../server/functions/barang';

export function useBarangList() {
  return useQuery(barangQueries.list());
}

export function useBarangDetail(id: string) {
  return useQuery(barangQueries.detail(id));
}

export function useBarangMutation() {
  const queryClient = useQueryClient();

  const create = useMutation({
    mutationFn: (data: Parameters<typeof createBarang>[0]['data']) => createBarang({ data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: barangQueries.lists() });
    },
  });

  const update = useMutation({
    mutationFn: (data: Parameters<typeof updateBarang>[0]['data']) => updateBarang({ data }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: barangQueries.lists() });
      queryClient.invalidateQueries({ queryKey: [...barangQueries.details(), variables.id] });
    },
  });

  const remove = useMutation({
    mutationFn: (id: string) => deleteBarang({ data: { id } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: barangQueries.lists() });
    },
  });

  return { create, update, remove };
}
