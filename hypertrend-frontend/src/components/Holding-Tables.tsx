import React, { useState, useMemo, useCallback } from 'react';
import { ChevronUp, ChevronDown, Search, MoreVertical } from 'lucide-react';
import { cn } from "@/lib/utils"

// --- 1. Define Data Types ---

// Define the shape of a single row/stock item
export type StockHolding = {
  symbol: string;
  company: string;
  qty: number;
  avgPrice: number;
  ltp: number; // Last Traded Price
  currentValue: number;
  pnl: number; // Profit & Loss amount
  pnlPercent: number; // Profit & Loss percentage
  dayChange: number; // Day Change amount
  dayChangePercent: number; // Day Change percentage
};

// Define the shape of a table column for configuration
type Column<T> = {
  key: keyof T;
  header: string;
  sortable: boolean;
  // Optional function to render complex cells (like P&L with color)
  render?: (item: T) => React.ReactNode; 
};

// --- 2. Sample Data (Based on your input) ---

const initialData: StockHolding[] = [
  {
    symbol: 'TCS',
    company: 'Tata Consultancy Services',
    qty: 50,
    avgPrice: 3245.50,
    ltp: 3845.20,
    currentValue: 192260.00,
    pnl: 29985.00,
    pnlPercent: 18.48,
    dayChange: 45.30,
    dayChangePercent: 1.19,
  },
  {
    symbol: 'INFY',
    company: 'Infosys Limited',
    qty: 80,
    avgPrice: 1420.00,
    ltp: 1565.75,
    currentValue: 125260.00,
    pnl: 11660.00,
    pnlPercent: 10.26,
    dayChange: -12.50, // Changed to negative based on your output example (-0.79%)
    dayChangePercent: -0.79,
  },
    {
    symbol: 'INFY',
    company: 'Infosys Limited',
    qty: 80,
    avgPrice: 1420.00,
    ltp: 1565.75,
    currentValue: 125260.00,
    pnl: 11660.00,
    pnlPercent: 10.26,
    dayChange: -12.50, // Changed to negative based on your output example (-0.79%)
    dayChangePercent: -0.79,
  },
    {
    symbol: 'INFY',
    company: 'Infosys Limited',
    qty: 80,
    avgPrice: 1420.00,
    ltp: 1565.75,
    currentValue: 125260.00,
    pnl: 11660.00,
    pnlPercent: 10.26,
    dayChange: -12.50, // Changed to negative based on your output example (-0.79%)
    dayChangePercent: -0.79,
  },
    {
    symbol: 'INFY',
    company: 'Infosys Limited',
    qty: 80,
    avgPrice: 1420.00,
    ltp: 1565.75,
    currentValue: 125260.00,
    pnl: 11660.00,
    pnlPercent: 10.26,
    dayChange: -12.50, // Changed to negative based on your output example (-0.79%)
    dayChangePercent: -0.79,
  },
    {
    symbol: 'INFY',
    company: 'Infosys Limited',
    qty: 80,
    avgPrice: 1420.00,
    ltp: 1565.75,
    currentValue: 125260.00,
    pnl: 11660.00,
    pnlPercent: 10.26,
    dayChange: -12.50, // Changed to negative based on your output example (-0.79%)
    dayChangePercent: -0.79,
  },
    {
    symbol: 'INFY',
    company: 'Infosys Limited',
    qty: 80,
    avgPrice: 1420.00,
    ltp: 1565.75,
    currentValue: 125260.00,
    pnl: 11660.00,
    pnlPercent: 10.26,
    dayChange: -12.50, // Changed to negative based on your output example (-0.79%)
    dayChangePercent: -0.79,
  },
    {
    symbol: 'INFY',
    company: 'Infosys Limited',
    qty: 80,
    avgPrice: 1420.00,
    ltp: 1565.75,
    currentValue: 125260.00,
    pnl: 11660.00,
    pnlPercent: 10.26,
    dayChange: -12.50, // Changed to negative based on your output example (-0.79%)
    dayChangePercent: -0.79,
  },
    {
    symbol: 'INFY',
    company: 'Infosys Limited',
    qty: 80,
    avgPrice: 1420.00,
    ltp: 1565.75,
    currentValue: 125260.00,
    pnl: 11660.00,
    pnlPercent: 10.26,
    dayChange: -12.50, // Changed to negative based on your output example (-0.79%)
    dayChangePercent: -0.79,
  },
    {
    symbol: 'INFY',
    company: 'Infosys Limited',
    qty: 80,
    avgPrice: 1420.00,
    ltp: 1565.75,
    currentValue: 125260.00,
    pnl: 11660.00,
    pnlPercent: 10.26,
    dayChange: -12.50, // Changed to negative based on your output example (-0.79%)
    dayChangePercent: -0.79,
  },
    {
    symbol: 'INFY',
    company: 'Infosys Limited',
    qty: 80,
    avgPrice: 1420.00,
    ltp: 1565.75,
    currentValue: 125260.00,
    pnl: 11660.00,
    pnlPercent: 10.26,
    dayChange: -12.50, // Changed to negative based on your output example (-0.79%)
    dayChangePercent: -0.79,
  },
  // Add more data here
];

// --- 3. Table Column Configuration ---

const columns: Column<StockHolding>[] = [
  { key: 'symbol', header: 'Symbol', sortable: true },
  { key: 'company', header: 'Company', sortable: true, 
    render: (item) => (
      <div>
        <div className="font-semibold">{item.symbol}</div>
        <div className="text-xs text-muted-foreground">{item.company}</div>
      </div>
    )
  },
  { key: 'qty', header: 'Qty', sortable: true },
  { key: 'avgPrice', header: 'Avg Price', sortable: true, render: (item) => `₹${item.avgPrice.toFixed(2)}` },
  { key: 'ltp', header: 'LTP', sortable: true, render: (item) => `₹${item.ltp.toFixed(2)}` },
  { key: 'currentValue', header: 'Current Value', sortable: true, render: (item) => `₹${item.currentValue.toFixed(2)}` },
  { 
    key: 'pnl', 
    header: 'P&L', 
    sortable: true,
    render: (item) => {
      const isPositive = item.pnl >= 0;
      const colorClass = isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400';
      const sign = isPositive ? '+' : '';
      return (
        <div className={colorClass}>
          <div>{`${sign}₹${Math.abs(item.pnl).toFixed(2)}`}</div>
          <div className="text-xs">{`${sign}${Math.abs(item.pnlPercent).toFixed(2)}%`}</div>
        </div>
      );
    }
  },
  { 
    key: 'dayChange', 
    header: 'Day Change', 
    sortable: true,
    render: (item) => {
      const isPositive = item.dayChange >= 0;
      const colorClass = isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400';
      const sign = isPositive ? '+' : '';
      return (
        <div className={colorClass}>
          <div>{`${sign}₹${Math.abs(item.dayChange).toFixed(2)}`}</div>
          <div className="text-xs">{`${sign}${Math.abs(item.dayChangePercent).toFixed(2)}%`}</div>
        </div>
      );
    }
  },
  { 
    key: 'actions' as keyof StockHolding, 
    header: 'Actions', 
    sortable: false,
    render: () => (
      <button className="p-1 rounded-full hover:bg-slate-200 dark:hover:bg-gray-700 transition-colors">
        <MoreVertical className="w-4 h-4" />
      </button>
    )
  },
];

// --- 4. Main Table Component ---

type SortConfig = {
  key: keyof StockHolding;
  direction: 'ascending' | 'descending';
};

export function Table() {
  // --- Pagination State ---
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10); // Fixed size for simplicity
  // --------------------------
  
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'currentValue', direction: 'descending' });

  // Helper function for sorting (remains the same)
  const sortData = useCallback((data: StockHolding[], config: SortConfig) => {
    // ... (sorting logic) ...
    return [...data].sort((a, b) => {
      const aValue = a[config.key] as string | number;
      const bValue = b[config.key] as string | number;

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        if (aValue < bValue) {
          return config.direction === 'ascending' ? -1 : 1;
        }
        if (aValue > bValue) {
          return config.direction === 'ascending' ? 1 : -1;
        }
      } else if (typeof aValue === 'string' && typeof bValue === 'string') {
        if (aValue.toLowerCase() < bValue.toLowerCase()) {
          return config.direction === 'ascending' ? -1 : 1;
        }
        if (aValue.toLowerCase() > bValue.toLowerCase()) {
          return config.direction === 'ascending' ? 1 : -1;
        }
      }
      return 0;
    });
  }, []);

  // Filter, Sort, AND Slice Logic
  const processedData = useMemo(() => {
    let filteredData = initialData.filter(item =>
      item.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.company.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const sortedData = sortData(filteredData, sortConfig);
    
    // --- Pagination Logic (Slicing) ---
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedData = sortedData.slice(startIndex, endIndex);
    // -----------------------------------

    return {
      paginatedData,
      totalCount: filteredData.length,
      pageCount: Math.ceil(filteredData.length / itemsPerPage),
    };
  }, [initialData, searchTerm, sortConfig, sortData, currentPage, itemsPerPage]);

  const { paginatedData, totalCount, pageCount } = processedData;

  // Reset page when search/sort changes
  React.useEffect(() => {
      setCurrentPage(1);
  }, [searchTerm, sortConfig.key, sortConfig.direction]);
  
  // Handler for sorting a column (remains the same)
  const requestSort = (key: keyof StockHolding) => {
    let direction: SortConfig['direction'] = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };
  
  return (
    <div className="rounded-xl border shadow-sm bg-card text-card-foreground border-gray-200 p-3 mb-8 bg-secondary">
      {/* Search Input (same as before) */}
      <div className="p-4 flex items-center border-b">
        <Search className="w-4 h-4 mr-2 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search by Symbol or Company..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-transparent focus:outline-none placeholder:text-muted-foreground"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full caption-bottom text-sm">
          {/* Table Header (same as before, uses columns and requestSort) */}
          
          <thead className="[&_tr]:border-b">
            <tr className="border-b transition-colors hover:bg-slate-200 dark:hover:bg-gray-700">
              {columns.map((column) => (
                <th
                  key={column.key as string}
                  className={cn(
                    "h-10 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0",
                    column.sortable && "cursor-pointer select-none"
                  )}
                  onClick={() => column.sortable && requestSort(column.key)}
                >
                  <div className="flex items-center">
                    {column.header}
                    {/* Sort Icons */}
                    {column.sortable && (
                      <span className="ml-2 text-primary">
                        {sortConfig.key === column.key ? (
                          sortConfig.direction === 'ascending' ? (
                            <ChevronUp className="w-4 h-4" />
                          ) : (
                            <ChevronDown className="w-4 h-4" />
                          )
                        ) : (
                          // Placeholder for non-active sortable columns
                          <ChevronUp className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                        )}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>          
          {/* Table Body */}
          <tbody className="[&_tr:last-child]:border-0">
            {paginatedData.map((item, index) => (
              <tr 
                key={index} 
                className="border-b transition-colors hover:bg-slate-200 dark:hover:bg-gray-700" 
              >
                {/* ... (Row data rendering using item and column.render) ... */}
                {columns.map((column) => (
                    <td
                      key={column.key as string}
                      className="p-4 align-middle [&:has([role=checkbox])]:pr-0"
                    >
                      {column.render 
                        ? column.render(item) 
                        : (item[column.key] as React.ReactNode)}
                    </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* No Results Message */}
      {paginatedData.length === 0 && (
        <div className="p-8 text-center text-muted-foreground">
          {totalCount > 0 
            ? "No results on this page." 
            : "No holdings match your search criteria."}
        </div>
      )}

      {/* --- Pagination Controls --- */}
      {totalCount > itemsPerPage && (
        <div className="p-4 flex justify-between items-center border-t text-sm">
          <div className="text-muted-foreground">
            Showing {Math.min(totalCount, (currentPage - 1) * itemsPerPage + 1)} - 
            {Math.min(totalCount, currentPage * itemsPerPage)} of {totalCount} results
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="prevbutton px-3 py-1 border rounded-md transition-colors disabled:opacity-50 hover:bg-slate-200 dark:hover:bg-gray-700"
            >
              Previous
            </button>
            <span className="px-3 py-1 font-medium">
              Page {currentPage} of {pageCount}
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(pageCount, prev + 1))}
              disabled={currentPage === pageCount}
              className="nextbutton px-3 py-1 border rounded-md transition-colors disabled:opacity-50 hover:bg-slate-200 dark:hover:bg-gray-700"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}