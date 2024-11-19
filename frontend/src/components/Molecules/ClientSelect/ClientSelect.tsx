import { KeyboardEventHandler } from 'react';
import CreatableSelect from 'react-select/creatable';
import styles from './ClientSelect.module.css';

const components = {
  DropdownIndicator: null,
};

const createOption = (label: string) => ({
  label,
  value: label,
});

export default function ClientSelect({
  value,
  inputValue,
  setInputValue,
  setValue,
}) {
  const handleKeyDown: KeyboardEventHandler = (event) => {
    if (!inputValue) return;
    switch (event.key) {
      case 'Enter':
      case 'Tab':
        setValue((prevState) => ({
          ...prevState,
          clientPerson: [...prevState.clientPerson, createOption(inputValue)],
        }));
        // setValue((prev) => [...prev, createOption(inputValue)]);
        setInputValue('');
        event.preventDefault();
        break;
      default:
        null;
    }
  };

  return (
    <CreatableSelect
      components={components}
      inputValue={inputValue}
      isClearable
      isMulti
      menuIsOpen={false}
      onChange={(newValue) =>
        setValue((prev) => ({
          ...prev,
          clientPerson: newValue,
        }))
      }
      onInputChange={(newValue) => setInputValue(newValue)}
      onKeyDown={handleKeyDown}
      placeholder="Wpisz Imię i nazwisko klienta"
      value={value}
      className={styles.clientsInput}
    />
  );
}
