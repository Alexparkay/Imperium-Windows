import React from 'react';

interface Column {
  header: string;
  accessor: string;
  renderCell?: (row: any) => React.ReactNode;
  className?: string;
}

interface GlassTableProps {
  columns: Column[];
  data: any[];
  className?: string;
  onRowClick?: (row: any) => void;
  keyField?: string;
  hoverable?: boolean;
  selectedRows?: number[];
  compact?: boolean;
}

const GlassTable: React.FC<GlassTableProps> = ({ 
  columns, 
  data, 
  className = '',
  onRowClick,
  keyField = 'id',
  hoverable = true,
  selectedRows = [],
  compact = false
}) => {
  return (
    <div className={`w-full overflow-x-auto ${className}`}>
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-white/10">
            {columns.map((column, index) => (
              <th 
                key={index} 
                className={`
                  text-left 
                  font-semibold 
                  text-text-secondary
                  ${compact ? 'px-3 py-2' : 'px-4 py-3'}
                  ${column.className || ''}
                `}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((row, rowIndex) => {
              const isSelected = selectedRows.includes(row[keyField]);
              return (
                <tr 
                  key={row[keyField] || rowIndex}
                  onClick={() => onRowClick && onRowClick(row)}
                  className={`
                    border-b border-white/5 
                    ${onRowClick ? 'cursor-pointer' : ''}
                    ${hoverable ? 'hover:bg-accent-primary/5' : ''}
                    ${isSelected ? 'bg-accent-primary/10' : ''}
                    transition-colors duration-200
                  `}
                >
                  {columns.map((column, colIndex) => (
                    <td 
                      key={colIndex} 
                      className={`
                        text-text-primary
                        ${compact ? 'px-3 py-2' : 'px-4 py-3'}
                        ${column.className || ''}
                      `}
                    >
                      {column.renderCell ? column.renderCell(row) : row[column.accessor]}
                    </td>
                  ))}
                </tr>
              );
            })
          ) : (
            <tr>
              <td 
                colSpan={columns.length} 
                className="text-center py-8 text-text-secondary"
              >
                No data available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default GlassTable; 