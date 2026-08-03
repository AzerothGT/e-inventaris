import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export interface ExportColumn {
	key: string;
	label: string;
	formatter?: (value: unknown) => string;
}

export function exportToPDF(
	data: Record<string, unknown>[],
	columns: ExportColumn[],
	filename: string,
	title: string,
	subtitle?: string,
) {
	const doc = new jsPDF();
	const pageWidth = doc.internal.pageSize.getWidth();

	// Title
	doc.setFontSize(20);
	doc.setTextColor(33, 33, 33);
	doc.text(title, 14, 20);

	// Subtitle
	if (subtitle) {
		doc.setFontSize(10);
		doc.setTextColor(100);
		doc.text(subtitle, 14, 28);
	}

	// Line
	doc.setDrawColor(200);
	doc.line(14, 32, pageWidth - 14, 32);

	const headers = columns.map((col) => col.label);
	const rows = data.map((row) =>
		columns.map((col) => {
			const value = row[col.key];
			return col.formatter ? col.formatter(value) : String(value ?? "");
		}),
	);

	autoTable(doc, {
		head: [headers],
		body: rows,
		startY: subtitle ? 38 : 34,
		styles: {
			fontSize: 8,
			cellPadding: 3,
			font: "helvetica",
		},
		headStyles: {
			fillColor: [79, 70, 229], // Indigo-600
			textColor: 255,
			fontStyle: "bold",
			fontSize: 9,
		},
		alternateRowStyles: {
			fillColor: [249, 250, 251], // Gray-50
		},
		margin: { top: 10, right: 10, bottom: 10, left: 10 },
	});

	// Footer
	const pageCount = (doc as unknown as { internal: { getNumberOfPages(): number } }).internal.getNumberOfPages();
	doc.setFontSize(8);
	doc.setTextColor(150);
	for (let i = 1; i <= pageCount; i++) {
		doc.setPage(i);
		doc.text(
			`Halaman ${i} dari ${pageCount}`,
			pageWidth / 2,
			doc.internal.pageSize.getHeight() - 10,
			{ align: "center" },
		);
	}

	doc.save(`${filename}.pdf`);
}
