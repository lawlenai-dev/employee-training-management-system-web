import { Search } from "lucide-react";

function getValueByPath(object, path) {
  return path.split(".").reduce((value, key) => value?.[key], object);
}

export function getCellValue(row, column, rowIndex) {
  const accessorFn =
    column.accessorFn ??
    (typeof column.accessor === "function" ? column.accessor : undefined);

  if (accessorFn) {
    return accessorFn(row, rowIndex);
  }

  const accessorKey =
    column.accessorKey ??
    (typeof column.accessor === "string" ? column.accessor : undefined) ??
    column.key;

  if (typeof accessorKey === "string") {
    return getValueByPath(row, accessorKey);
  }

  return undefined;
}

export function CellValue({ row, column, rowIndex }) {
  const value = getCellValue(row, column, rowIndex);

  if (typeof column.cell === "function") {
    return column.cell({
      value,
      row,
      column,
      rowIndex,
    });
  }

  if (typeof column.render === "function") {
    return column.render(value, row);
  }

  return value ?? column.fallback ?? "-";
}

function getColumnId(column, columnIndex) {
  return (
    column.id ??
    column.accessorKey ??
    (typeof column.accessor === "string" ? column.accessor : undefined) ??
    column.key ??
    `column-${columnIndex}`
  );
}

export default function DataTable({
  columns = [],
  data = [],
  rowKey = "id",
  actions,
  onRowClick,
  emptyMessage = "ไม่พบข้อมูล",
  minWidth = "850px",
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-left" style={{ minWidth }}>
        <thead>
          <tr className="border-b border-border bg-slate-50">
            {columns.map((column, columnIndex) => (
              <th
                key={getColumnId(column, columnIndex)}
                className={`whitespace-nowrap px-5 py-4 text-xs font-semibold uppercase tracking-wider text-muted ${column.headerClassName ?? ""}`}
              >
                {column.header ?? column.label}
              </th>
            ))}

            {actions && (
              <th className="whitespace-nowrap px-5 py-4 text-right text-xs font-semibold uppercase tracking-wider text-muted">
                จัดการ
              </th>
            )}
          </tr>
        </thead>

        <tbody>
          {data.length > 0 ? (
            data.map((row, rowIndex) => (
              <tr
                key={
                  typeof rowKey === "function"
                    ? rowKey(row, rowIndex)
                    : getValueByPath(row, rowKey)
                }
                onClick={() => onRowClick?.(row)}
                className={`border-b border-border transition last:border-b-0 hover:bg-surface-hover ${onRowClick ? "cursor-pointer" : ""}`}
              >
                {columns.map((column, columnIndex) => (
                  <td
                    key={getColumnId(column, columnIndex)}
                    className={`px-5 py-4 text-sm text-body ${column.cellClassName ?? ""}`}
                  >
                    <CellValue row={row} column={column} rowIndex={rowIndex} />
                  </td>
                ))}

                {actions && (
                  <td
                    className="whitespace-nowrap px-5 py-4 text-right"
                    onClick={(event) => event.stopPropagation()}
                  >
                    {actions(row)}
                  </td>
                )}
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={columns.length + (actions ? 1 : 0)}
                className="px-5 py-16 text-center"
              >
                <Search size={30} className="mx-auto text-slate-300" />
                <p className="mt-3 font-semibold text-slate-600">
                  {emptyMessage}
                </p>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
