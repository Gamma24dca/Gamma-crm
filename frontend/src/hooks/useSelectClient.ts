import { useState } from 'react';

interface Option {
  readonly label: string;
  readonly value: string;
}

const useSelectClient = () => {
  const [inputValue, setInputValue] = useState('');
  const [value, setValue] = useState<readonly Option[]>([]);

  return {
    value,
    inputValue,
    setInputValue,
    setValue,
  };
};

export default useSelectClient;
