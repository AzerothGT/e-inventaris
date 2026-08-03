import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
	ArrowRight,
	Eye,
	EyeOff,
	Loader2,
	LockKeyhole,
	Package,
	User,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { loginUser } from "../server/functions/auth";

export const Route = createFileRoute("/login")({
	component: LoginPage,
});

function LoginPage() {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [status, setStatus] = useState("");
	const navigate = useNavigate();

	const handleSubmit = async (e: React.SyntheticEvent) => {
		e.preventDefault();
		setIsLoading(true);

		// design.md: descriptive loading steps beat a bare spinner
		const steps = [
			"Memverifikasi kredensial...",
			"Menghubungkan ke server...",
			"Membuka dashboard...",
		];
		let step = 0;
		setStatus(steps[0]);
		const timer = setInterval(() => {
			step = Math.min(step + 1, steps.length - 1);
			setStatus(steps[step]);
		}, 900);

		try {
			const result = await loginUser({ data: { username, password } });
			if (result.success) {
				toast.success(`Selamat datang kembali, ${result.user.name}!`);
				navigate({ to: "/dashboard" });
			}
		} catch (error: unknown) {
			const message = error instanceof Error ? error.message : "Gagal masuk. Silakan periksa kembali username dan password Anda.";
			toast.error(message);
		} finally {
			clearInterval(timer);
			setIsLoading(false);
		}
	};

	return (
		<div className="page-enter relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-surface-50 p-4">
			{/* Dynamic Background Elements */}
			<div className="absolute top-[-10%] left-[-10%] h-[60%] w-[60%] animate-[blob_7s_infinite] rounded-full bg-primary-600/10 mix-blend-multiply blur-[120px]" />
			<div className="absolute right-[-10%] bottom-[-10%] h-[60%] w-[60%] animate-[blob_7s_infinite] rounded-full bg-indigo-600/10 mix-blend-multiply blur-[120px] [animation-delay:2s]" />
			<div className="absolute top-[20%] right-[20%] h-[40%] w-[40%] animate-[blob_7s_infinite] rounded-full bg-sky-600/10 mix-blend-multiply blur-[100px] [animation-delay:4s]" />

			<div className="relative z-10 w-full max-w-md">
				{/* Card */}
				<div className="relative overflow-hidden rounded-3xl border border-surface-200 bg-white/80 p-8 shadow-card-hover backdrop-blur-xl transition-all duration-300 hover:shadow-modal sm:p-10">
					{/* Decorative shine effect */}
					<div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-white to-transparent opacity-50" />

					{/* Header */}
					<div className="mb-10 flex flex-col items-center justify-center space-y-4 text-center">
						<div className="flex h-16 w-16 rotate-3 items-center justify-center rounded-2xl border border-primary-500/50 bg-primary-600 shadow-lg shadow-primary-600/20 transition-transform duration-300 hover:rotate-6 hover:scale-105">
							<Package className="h-8 w-8 text-white" />
						</div>
						<div>
							<h1 className="bg-linear-to-r from-surface-900 to-surface-600 bg-clip-text font-bold text-2xl text-transparent sm:text-3xl">
								E-Inventaris
							</h1>
							<p className="mt-2 text-sm text-surface-500 sm:text-base">
								SMK Al Basyariah
							</p>
						</div>
					</div>

					{/* Form */}
					<form onSubmit={handleSubmit} className="space-y-6">
						<div className="space-y-4">
							<div className="group space-y-1.5">
								<label
									className="font-medium text-sm text-surface-700 transition-colors group-focus-within:text-primary-600"
									htmlFor="username"
								>
									Username
								</label>
								<div className="relative">
									<div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 transition-colors group-focus-within:text-primary-600">
										<User className="h-5 w-5 text-surface-400 transition-colors group-focus-within:text-primary-500" />
									</div>
									<input
										id="username"
										type="text"
										value={username}
										onChange={(e) => setUsername(e.target.value)}
										className="flex h-12 w-full rounded-xl border border-surface-200 bg-white/50 px-3 py-2 pl-11 text-sm text-surface-900 shadow-sm ring-offset-white transition-all placeholder:text-surface-400 focus:bg-white focus-visible:border-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 disabled:cursor-not-allowed disabled:opacity-50"
										placeholder="admin"
										required
									/>
								</div>
							</div>

							<div className="group space-y-1.5">
								<div className="flex items-center justify-between">
									<label
										className="font-medium text-sm text-surface-700 transition-colors group-focus-within:text-primary-600"
										htmlFor="password"
									>
										Password
									</label>
									<div className="group/forgot relative">
										<span className="cursor-help border-transparent border-b border-dashed pb-0.5 font-medium text-primary-600 text-sm transition-all hover:border-primary-500 hover:text-primary-500">
											Lupa password?
										</span>
										<div className="pointer-events-none absolute right-0 bottom-full z-20 mb-1.5 translate-y-1 whitespace-nowrap rounded-lg bg-surface-800 px-3 py-1.5 font-normal text-white text-xs opacity-0 shadow-lg transition-all duration-200 group-hover/forgot:translate-y-0 group-hover/forgot:opacity-100">
											Hubungi admin
											<div className="absolute top-full right-6 h-0 w-0 border-[5px] border-transparent border-t-surface-800" />
										</div>
									</div>
								</div>
								<div className="relative">
									<div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 transition-colors group-focus-within:text-primary-600">
										<LockKeyhole className="h-5 w-5 text-surface-400 transition-colors group-focus-within:text-primary-500" />
									</div>
									<input
										id="password"
										type={showPassword ? "text" : "password"}
										value={password}
										onChange={(e) => setPassword(e.target.value)}
										className="flex h-12 w-full rounded-xl border border-surface-200 bg-white/50 px-3 py-2 pr-11 pl-11 text-sm text-surface-900 shadow-sm ring-offset-white transition-all placeholder:text-surface-400 focus:bg-white focus-visible:border-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 disabled:cursor-not-allowed disabled:opacity-50"
										placeholder="••••••••"
										required
									/>
									<button
										type="button"
										onClick={() => setShowPassword(!showPassword)}
										className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-surface-400 transition-colors hover:text-primary-600 focus:outline-none"
									>
										{showPassword ? (
											<EyeOff className="h-5 w-5" />
										) : (
											<Eye className="h-5 w-5" />
										)}
									</button>
								</div>
							</div>
						</div>

						<button
							type="submit"
							disabled={isLoading}
							className="group relative mt-2 flex h-12 w-full items-center justify-center overflow-hidden rounded-xl border border-transparent bg-primary-600 px-4 font-semibold text-sm text-white shadow-md shadow-primary-600/20 transition-all hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-600 focus:ring-offset-2 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
						>
							{isLoading ? (
								<span className="relative z-10 flex items-center gap-2">
									<Loader2 className="h-5 w-5 shrink-0 animate-spin" />
									<span>{status}</span>
								</span>
							) : (
								<>
									<span className="relative z-10">Masuk ke Sistem</span>
									<ArrowRight className="relative z-10 ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
									<div className="absolute inset-0 z-0 h-full w-full bg-linear-to-r from-primary-600 to-indigo-600 opacity-0 transition-opacity group-hover:opacity-100" />
								</>
							)}
						</button>
					</form>

					{/* Footer details */}
					<div className="mt-8 flex flex-col items-center justify-between gap-2 border-surface-100 border-t pt-6 text-center text-surface-500 text-xs sm:flex-row sm:gap-4 sm:text-left">
						<p className="font-medium">
							&copy; {new Date().getFullYear()} SMK Al Basyariah
						</p>
						<p className="rounded-md bg-surface-100 px-2 py-1 font-mono text-[10px]">
							v1.0.0
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}
