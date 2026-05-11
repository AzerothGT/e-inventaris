import { Button } from "./Button";
import { FileSpreadsheet, FileText } from "lucide-react";
import { useState } from "react";
import {
	exportToCSV,
	ExportColumn as CSVExportColumn,
} from "../../lib/exportCSV";
import {
	exportToPDF,
	ExportColumn as PDFExportColumn,
} from "../../lib/exportPDF";
import { cn } from "../../lib/utils";

interface ExportButtonProps {
	data: any[];
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
				className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-success-500/10 hover:border-success-200/50"
				title="Export ke Excel"
			>
				<FileSpreadsheet className="h-4 w-4 mr-2 text-success-600 transition-transform group-hover:scale-110" />
				<span className="font-bold text-surface-900">XLS</span>
				<div className="absolute inset-x-0 bottom-0 h-[2px] bg-success-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
			</Button>

			<Button
				variant="secondary"
				onClick={handleExportPDF}
				disabled={isExporting || !data?.length}
				className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-danger-500/10 hover:border-danger-200/50"
				title="Export ke PDF"
			>
				<FileText className="h-4 w-4 mr-2 text-danger-600 transition-transform group-hover:scale-110" />
				<span className="font-bold text-surface-900">PDF</span>
				<div className="absolute inset-x-0 bottom-0 h-[2px] bg-danger-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
			</Button>
		</div>
	);
}
