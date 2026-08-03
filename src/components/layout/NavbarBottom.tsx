import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { FilePen, LayoutDashboard, Package, Warehouse } from "lucide-react";
import { getCurrentUser } from "../../server/functions/auth";

export function NavbarBottom() {
	const { data: user } = useQuery({
		queryKey: ["session"],
		queryFn: () => getCurrentUser(),
	});

	const currentRole = user?.role || "guest";

	const menuItems = [
		{
			title: "Dashboard",
			icon: <LayoutDashboard size={20} strokeWidth={1.5} />,
			to: "/dashboard",
			roles: [
				"penjaga_lab",
				"orang_tu",
				"tu_admin",
				"kaprog",
				"wakasek",
				"kepala_sekolah",
				"admin",
			],
		},
		{
			title: "Barang",
			icon: <Package size={20} strokeWidth={1.5} />,
			to: "/barang",
			roles: [
				"tu_admin",
				"penjaga_lab",
				"orang_tu",
				"kaprog",
				"wakasek",
				"kepala_sekolah",
				"admin",
			],
		},
		{
			title: "Pengajuan",
			icon: <FilePen size={20} strokeWidth={1.5} />,
			to: "/permintaan",
			roles: [
				"penjaga_lab",
				"orang_tu",
				"tu_admin",
				"kaprog",
				"wakasek",
				"kepala_sekolah",
				"admin",
			],
		},
		{
			title: "Gudang",
			icon: <Warehouse size={20} strokeWidth={1.5} />,
			to: "/ruangan",
			roles: ["tu_admin", "penjaga_lab", "admin"],
		},
	];

	const filteredMenu = menuItems.filter((item) =>
		item.roles.includes(currentRole as string),
	);

	return (
		<nav className="fixed right-0 bottom-0 left-0 z-40 flex h-16 items-center justify-around border-surface-200 border-t bg-white pb-0 lg:hidden">
			{filteredMenu.map((item) => (
				<Link
					key={item.to}
					to={item.to}
					className="navbar-link"
					activeProps={{
						className: "navbar-link-active",
					}}
				>
					{item.icon}
					<span className="mt-1 font-medium text-[10px]">{item.title}</span>
				</Link>
			))}
		</nav>
	);
}
