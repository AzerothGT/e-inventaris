import { queryOptions } from "@tanstack/react-query";
import { getRuanganById, getRuanganList } from "../server/functions/ruangan";

export const ruanganQueries = {
	all: () => ["ruangan"] as const,
	lists: () => [...ruanganQueries.all(), "list"] as const,
	list: () =>
		queryOptions({
			queryKey: ruanganQueries.lists(),
			queryFn: () => getRuanganList(),
			staleTime: 30 * 60 * 1000,
		}),
	details: () => [...ruanganQueries.all(), "detail"] as const,
	detail: (id: string) =>
		queryOptions({
			queryKey: [...ruanganQueries.details(), id] as const,
			queryFn: () => getRuanganById({ data: { id } }),
		}),
};
