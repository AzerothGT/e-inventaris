import { FileSpreadsheet, FileText } from "lucide-react";
import { useState } from "react";
import {
	type ExportColumn as CSVExportColumn,
	exportToCSV,
} from "../../lib/exportCSV";
import {
	exportToPDF,
	type ExportColumn as PDFExportColumn,
} from "../../lib/exportPDF";
import { cn } from "../../lib/utils";
import { Button } from "./Button";

interface ExportButtonProps {
	data: Record<string, unknown>[];
	columns: (CSVExportColumn & PDFExportColumn)[];
	filename: string;
	title?: string;
	subtitle?: string;
	className?: string;
}

export function ExportButton({
	data,
	columns,
	filename,
	title = "Laporan",
	subtitle,
	className,
}: ExportButtonProps) {
	const [isExporting, setIsExporting] = useState(false);

	const handleExportCSV = () => {
		setIsExporting(true);
		try {
			exportToCSV(data, columns, filename);
		} finally {
			setIsExporting(false);
		}
	};

	const handleExportPDF = () => {
		setIsExporting(true);
		try {
			exportToPDF(data, columns, filename, title, subtitle);
		} finally {
			setIsExporting(false);
		}
	};

	return (
		<div className={cn("flex flex-wrap gap-2", className)}>
			<Button
				variant="secondary"
				onClick={handleExportCSV}
				disabled={isExporting || !data?.length}
				className="group relative overflow-hidden transition-all duration-300 hover:border-success-200/50 hover:shadow-lg hover:shadow-success-500/10"
				title="Export ke Excel"
			>
				<FileSpreadsheet className="mr-2 h-4 w-4 text-success-600 transition-transform group-hover:scale-110" />
				<span className="font-bold text-surface-900">XLS</span>
				<div className="absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 transform bg-success-500 transition-transform duration-300 group-hover:scale-x-100" />
			</Button>

			<Button
				variant="secondary"
				onClick={handleExportPDF}
				disabled={isExporting || !data?.length}
				className="group relative overflow-hidden transition-all duration-300 hover:border-danger-200/50 hover:shadow-danger-500/10 hover:shadow-lg"
				title="Export ke PDF"
			>
				<FileText className="mr-2 h-4 w-4 text-danger-600 transition-transform group-hover:scale-110" />
				<span className="font-bold text-surface-900">PDF</span>
				<div className="absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 transform bg-danger-500 transition-transform duration-300 group-hover:scale-x-100" />
			</Button>
		</div>
	);
}
