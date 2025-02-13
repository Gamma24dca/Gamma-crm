import { useState } from 'react';

const useShowLabel = () => {
  const [labelState, setLabelState] = useState({
    isLabel: false,
    labelId: '',
    labelValue: '',
  });

  const handleMouseEnter = (id, value) => {
    setLabelState({
      isLabel: true,
      labelId: id,
      labelValue: value,
    });
  };

  const handleMouseLeave = () => {
    setLabelState({ isLabel: false, labelId: '', labelValue: '' });
  };
  return {
    labelState,
    handleMouseEnter,
    handleMouseLeave,
  };
};

export default useShowLabel;
