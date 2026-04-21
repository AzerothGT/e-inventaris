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

interface ExportButtonProps {
	data: any[];
	columns: (CSVExportColumn & PDFExportColumn)[];
	filename: string;
	title?: string;
	subtitle?: string;
	variant?: "default" | "ghost" | "secondary" | "destructive";
	size?: "default" | "sm" | "lg" | "icon";
	className?: string;
}

export function ExportButton({
	data,
	columns,
	filename,
	title = "Laporan",
	subtitle,
	variant = "secondary",
	size = "default",
	className = "",
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
		<div className="flex gap-2">
			<Button
				variant={variant}
				size={size}
				onClick={handleExportCSV}
				disabled={isExporting || data.length === 0}
				className={className}
				title="Export ke CSV"
			>
				<FileSpreadsheet className="h-4 w-4 mr-2" />
				CSV
			</Button>
			<Button
				variant={variant}
				size={size}
				onClick={handleExportPDF}
				disabled={isExporting || data.length === 0}
				className={className}
				title="Export ke PDF"
			>
				<FileText className="h-4 w-4 mr-2" />
				PDF
			</Button>
		</div>
	);
}
