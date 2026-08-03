import { X } from "lucide-react";
import * as React from "react";
import { cn } from "../../lib/utils";

interface DialogProps {
	isOpen: boolean;
	onClose: () => void;
	title?: string;
	children: React.ReactNode;
	className?: string;
	size?: "sm" | "md" | "lg" | "xl" | "full";
}

export function Dialog({
	isOpen,
	onClose,
	title,
	children,
	className,
	size = "md",
}: DialogProps) {
	const dialogRef = React.useRef<HTMLDialogElement>(null);

	const sizeClasses = {
		sm: "max-w-md",
		md: "max-w-lg",
		lg: "max-w-2xl",
		xl: "max-w-4xl",
		full: "max-w-[95vw]",
	};

	React.useEffect(() => {
		const dialog = dialogRef.current;
		if (!dialog) return;

		if (isOpen) {
			dialog.showModal();
			document.body.style.overflow = "hidden";
		} else {
			dialog.close();
			document.body.style.overflow = "auto";
		}
	}, [isOpen]);

	const handleBackdropClick = (e: React.MouseEvent<HTMLDialogElement>) => {
		const dialogDimensions = dialogRef.current?.getBoundingClientRect();
		if (
			dialogDimensions &&
			(e.clientX < dialogDimensions.left ||
				e.clientX > dialogDimensions.right ||
				e.clientY < dialogDimensions.top ||
				e.clientY > dialogDimensions.bottom)
		) {
			onClose();
		}
	};

	return (
		<dialog
			ref={dialogRef}
			onClose={onClose}
			onClick={handleBackdropClick}
			className={cn(
				"modal-container fixed inset-0 m-auto border-none bg-transparent p-0 outline-none backdrop:bg-surface-950/40 backdrop:backdrop-blur-sm",
				className,
			)}
		>
			<div
				className={cn(
					"fade-in zoom-in mx-auto w-full animate-in overflow-hidden rounded-2xl bg-white shadow-2xl duration-300",
					sizeClasses[size],
				)}
			>
				<div className="flex items-center justify-between border-surface-100 border-b p-6">
					{title && (
						<h3 className="font-bold text-surface-900 text-xl">{title}</h3>
					)}
					<button
						onClick={onClose}
						className="rounded-lg p-2 text-surface-400 transition-colors hover:bg-surface-100 hover:text-surface-600"
					>
						<X size={20} />
					</button>
				</div>
				<div className="custom-scrollbar max-h-[70vh] overflow-y-auto p-6">
					{isOpen && children}
				</div>
			</div>
		</dialog>
	);
}
