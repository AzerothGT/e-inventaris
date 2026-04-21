import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export interface ExportColumn {
	key: string;
	label: string;
	formatter?: (value: any) => string;
}

export function exportToPDF(
	data: any[],
	columns: ExportColumn[],
	filename: string,
	title: string,
	subtitle?: string,
) {
	const doc = new jsPDF();

	const pageWidth = doc.internal.pageSize.getWidth();

	doc.setFontSize(20);
	doc.text(title, 14, 20);

	if (subtitle) {
		doc.setFontSize(10);
		doc.setTextColor(100);
		doc.text(subtitle, 14, 28);
	}

	const headers = columns.map((col) => col.label);
	const rows = data.map((row) =>
		columns.map((col) => {
			const value = row[col.key];
			return col.formatter ? col.formatter(value) : value;
		}),
	);

	autoTable(doc, {
		head: [headers],
		body: rows,
		startY: subtitle ? 35 : 25,
		styles: {
			fontSize: 8,
			cellPadding: 3,
		},
		headStyles: {
			fillColor: [59, 130, 246],
			textColor: 255,
			fontStyle: "bold",
			fontSize: 9,
		},
		alternateRowStyles: {
			fillColor: [245, 245, 245],
		},
		margin: { top: 10, right: 10, bottom: 10, left: 10 },
	});

	const pageCount = doc.internal.pages.length - 1;
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
