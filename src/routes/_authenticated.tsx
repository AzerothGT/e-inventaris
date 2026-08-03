import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { AppShell } from "../components/layout/AppShell";
import { getCurrentUser } from "../server/functions/auth";

// Protected layout that requires authentication
export const Route = createFileRoute("/_authenticated")({
	beforeLoad: async () => {
		const user = await getCurrentUser();
		if (!user) {
			throw redirect({
				to: "/login",
			});
		}
		return { user };
	},
	component: AuthenticatedLayout,
});

function AuthenticatedLayout() {
	return (
		<AppShell>
			<Outlet />
		</AppShell>
	);
}
