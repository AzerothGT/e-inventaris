import {
	useMutation,
	useQueryClient,
	useSuspenseQuery,
} from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { PengadaanEventForm } from "../../../components/permintaan/PengadaanEventForm";
import { PageHeader } from "../../../components/ui/PageHeader";
import { getKategoriList } from "../../../server/functions/kategori";
import { createPengadaanEvent } from "../../../server/functions/pengadaan";

export const Route = createFileRoute("/_authenticated/permintaan/tambah")({
	loader: async ({ context }) => {
		return context.queryClient.ensureQueryData({
			queryKey: ["kategori"],
			queryFn: () => getKategoriList(),
		});
	},
	component: TambahPermintaanPage,
});

function TambahPermintaanPage() {
	const navigate = useNavigate();
	const queryClient = useQueryClient();

	const { data: kategoriList } = useSuspenseQuery({
		queryKey: ["kategori"],
		queryFn: () => getKategoriList(),
	});

	const mutation = useMutation({
		mutationFn: createPengadaanEvent,
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: ["permintaan"] });
			toast.success("Permintaan pengadaan berhasil dikirim!");
			navigate({ to: "/permintaan" });
		},
		onError: (error: Error) => {
			toast.error(error.message || "Gagal mengirim permintaan");
		},
	});

	return (
		<div className="space-y-6">
			<PageHeader title="Buat" gradientTitle="Permintaan Pengadaan" />

			<div className="stagger-2">
				<PengadaanEventForm
					onSubmit={(data) => mutation.mutate({ data })}
					isLoading={mutation.isPending}
					onCancel={() => navigate({ to: "/permintaan" })}
					kategoriOptions={kategoriList ?? []}
				/>
			</div>
		</div>
	);
}
