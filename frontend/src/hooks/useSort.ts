import { useState } from 'react';

const useSort = (data) => {
  const [sortColumn, setSortColumn] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');

  data.sort((a, b) => {
    let aVal = a[sortColumn];
    let bVal = b[sortColumn];

    if (typeof aVal && typeof bVal === 'string') {
      return sortOrder === 'asc'
        ? aVal.localeCompare(bVal)
        : bVal.localeCompare(aVal);
    }
    if (typeof aVal && typeof bVal === 'number') {
      return sortOrder === 'asc' ? bVal - aVal : aVal - bVal;
    }

    if (sortColumn === 'createdAt') {
      aVal = new Date(aVal);
      bVal = new Date(bVal);
    }

    return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
  });

  const handleSortChange = (column) => {
    if (sortColumn === column) {
      setSortOrder((prevOrder) => (prevOrder === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortColumn(column);
      setSortOrder('asc');
    }
  };

  return {
    sortColumn,
    setSortColumn,
    sortOrder,
    setSortOrder,
    handleSortChange,
  };
};

export default useSort;
