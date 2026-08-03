export interface ExportColumn {
	key: string;
	label: string;
	formatter?: (value: unknown) => string;
}

function escapeCSVValue(value: unknown): string {
	if (value === null || value === undefined) return "";
	const stringValue = String(value);
	if (
		stringValue.includes(",") ||
		stringValue.includes('"') ||
		stringValue.includes("\n")
	) {
		return `"${stringValue.replace(/"/g, '""')}"`;
	}
	return stringValue;
}

export function exportToCSV(
	data: Record<string, unknown>[],
	columns: ExportColumn[],
	filename: string,
) {
	const headers = columns.map((col) => col.label);
	const csvRows = [headers.join(",")];

	for (const row of data) {
		const values = columns.map((col) => {
			const value = row[col.key];
			const formattedValue = col.formatter ? col.formatter(value) : value;
			return escapeCSVValue(formattedValue);
		});
		csvRows.push(values.join(","));
	}

	const csv = csvRows.join("\n");
	const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
	const link = document.createElement("a");
	const url = URL.createObjectURL(blob);

	link.setAttribute("href", url);
	link.setAttribute("download", `${filename}.csv`);
	link.style.visibility = "hidden";

	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);

	URL.revokeObjectURL(url);
}
