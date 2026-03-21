type Column<T> = {
  key: string;
  title: string;
  render: (row: T) => React.ReactNode;
  className?: string;
};

type SimpleTableProps<T> = {
  columns: Column<T>[];
  rows: T[];
};

export function SimpleTable<T>({
  columns,
  rows,
}: SimpleTableProps<T>) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-sm">
      <table className="min-w-full divide-y divide-gray-200 text-sm">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                className={`px-4 py-3 text-left font-semibold text-gray-600 ${column.className ?? ""}`}
              >
                {column.title}
              </th>
            ))}
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-100 bg-white">
          {rows.map((row, index) => (
            <tr key={index} className="hover:bg-gray-50">
              {columns.map((column) => (
                <td
                  key={column.key}
                  className={`px-4 py-3 align-top text-gray-800 ${column.className ?? ""}`}
                >
                  {column.render(row)}
                </td>
              ))}
            </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}