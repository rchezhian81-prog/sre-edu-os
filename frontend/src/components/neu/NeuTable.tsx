import { cn } from '@/lib/utils/cn';

interface Column<T> { key: keyof T | string; header: string; render?: (row: T) => React.ReactNode; }
interface NeuTableProps<T> { columns: Column<T>[]; data: T[]; keyField?: string; loading?: boolean; }

export function NeuTable<T extends Record<string, any>>({ columns, data, keyField='id', loading }: NeuTableProps<T>) {
  return (
    <div className="overflow-x-auto rounded-xl bg-sur shadow-neu-sink-sm">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-clay/20">
            {columns.map(c => <th key={String(c.key)} className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wide">{c.header}</th>)}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr><td colSpan={columns.length} className="text-center py-8 text-gray-400">Loading...</td></tr>
          ) : data.length === 0 ? (
            <tr><td colSpan={columns.length} className="text-center py-8 text-gray-400">No records found</td></tr>
          ) : data.map((row, i) => (
            <tr key={row[keyField]||i} className="border-b border-clay/10 hover:bg-white/30 transition-colors">
              {columns.map(c => (
                <td key={String(c.key)} className="px-4 py-3 text-gray-700">
                  {c.render ? c.render(row) : row[c.key as string]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
