import { useMemo, useState } from 'react';

const useSort = (data) => {
  const [sortColumn, setSortColumn] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');

  const sortedData = useMemo(() => {
    if (!sortColumn) return data;
    return [...data].sort((a, b) => {
      let aVal = a[sortColumn];
      let bVal = b[sortColumn];

      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortOrder === 'asc'
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortOrder === 'asc' ? bVal - aVal : aVal - bVal;
      }

      if (sortColumn === 'createdAt') {
        aVal = new Date(aVal);
        bVal = new Date(bVal);
      }

      return 0;
    });
  }, [sortColumn, sortOrder, data]);

  const handleSortChange = (column) => {
    if (sortColumn === column) {
      setSortOrder((prevOrder) => (prevOrder === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortColumn(column);
      setSortOrder('asc');
    }
  };

  return {
    sortedData,
    sortColumn,
    sortOrder,
    handleSortChange,
  };
};

export default useSort;
