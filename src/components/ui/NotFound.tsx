import { Link } from "@tanstack/react-router";
import { ArrowLeft, Home } from "lucide-react";

export function NotFound() {
	return (
		<div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-slate-50 p-4">
			{/* Decorative background blur elements */}
			<div className="-translate-x-1/2 -translate-y-1/2 pointer-events-none absolute top-1/2 left-1/2 flex w-full max-w-3xl justify-center opacity-30 blur-3xl">
				<div className="h-64 w-64 animate-blob rounded-full bg-primary-400 mix-blend-multiply"></div>
				<div className="animation-delay-2000 -ml-16 h-64 w-64 animate-blob rounded-full bg-teal-400 mix-blend-multiply"></div>
				<div className="animation-delay-4000 -mt-16 -ml-16 h-64 w-64 animate-blob rounded-full bg-indigo-400 mix-blend-multiply"></div>
			</div>

			<div className="relative z-10 w-full max-w-md space-y-8 rounded-3xl border border-white/50 bg-white/70 p-8 text-center shadow-xl backdrop-blur-xl md:p-12">
				<div className="relative">
					<h1 className="cursor-default bg-linear-to-br from-primary-600 to-indigo-600 bg-clip-text font-extrabold text-9xl text-transparent tracking-tighter drop-shadow-sm transition-transform duration-500 hover:scale-105">
						404
					</h1>
				</div>

				<div className="space-y-3">
					<h2 className="font-bold text-3xl text-slate-800 tracking-tight">
						Oops! Tersesat?
					</h2>
					<p className="mx-auto max-w-xs text-slate-500 text-sm leading-relaxed">
						Halaman yang Anda cari mungkin telah dipindahkan, diganti namanya,
						atau memang tidak pernah ada.
					</p>
				</div>

				<div className="flex flex-col items-center justify-center gap-4 pt-6 sm:flex-row">
					<button
						onClick={() => window.history.back()}
						className="group flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-6 py-3 font-medium text-slate-600 ring-1 ring-transparent transition-all hover:bg-slate-50 hover:text-slate-900 hover:ring-slate-200 sm:w-auto"
					>
						<ArrowLeft
							size={18}
							className="group-hover:-translate-x-1 transition-transform"
						/>
						Kembali
					</button>

					<Link
						to="/dashboard"
						className="group hover:-translate-y-0.5 flex w-full items-center justify-center gap-2 rounded-2xl bg-linear-to-r from-primary-600 to-primary-500 px-6 py-3 font-medium text-white shadow-md shadow-primary-500/20 transition-all hover:from-primary-700 hover:to-primary-600 hover:shadow-lg hover:shadow-primary-500/30 sm:w-auto"
					>
						<Home
							size={18}
							className="transition-transform group-hover:scale-110"
						/>
						Dashboard
					</Link>
				</div>
			</div>
		</div>
	);
}
