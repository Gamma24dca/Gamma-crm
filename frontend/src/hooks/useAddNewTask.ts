import { useRef, useState } from 'react';
import { addTask } from '../services/tasks-service';

const useAddNewTask = () => {
  const defaultImgSrc = './add-image-icon.png';
  const imgIconRef = useRef(null);
  const [title, setTitle] = useState('');
  const [client, setClient] = useState('');
  const [path, setPath] = useState('Z:');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('200');
  const [status, setStatus] = useState('');
  const [deadline, setDeadline] = useState('');
  const [imgLabel, setImgLabel] = useState('Dodaj zdjęcie');
  const [imgFile, setImgFile] = useState(null);
  const [finalMessage, setFinalMessage] = useState('');
  const [showFinalMessage, setShowFinalMessage] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const clearValues = () => {
    setIsLoading(false);
    setShowFinalMessage(false);
    setImgFile(null);
    setTitle('');
    setClient('');
    setPath('Z:');
    setDescription('');
    setStatus('');
    setDeadline('');
    setImgLabel('Dodaj zdjęcie');
  };

  const imgSrc = imgFile ? URL.createObjectURL(imgFile) : defaultImgSrc;

  const handleIconClick = () => {
    imgIconRef.current.click();
  };

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  const handleClientChange = (event) => {
    setClient(event.target.value);
  };

  const handlePathChange = (event) => {
    setPath(event.target.value);
  };
  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  const handlePriorityChange = (event) => {
    setPriority(event.target.value);
  };

  const handleStatusChange = (event) => {
    setStatus(event.target.value);
  };

  const handleDeadlineChange = (event) => {
    setDeadline(event.target.value);
  };

  const handleFileChange = (event) => {
    const [file] = event.target.files;
    if (file) {
      setImgFile(file);
      setImgLabel('Zmień');
    }
  };

  const createTaskHandler = async () => {
    try {
      setIsLoading(true);
      await addTask({
        title,
        client,
        path,
        description,
        imgFile,
        priority,
        status,
        deadline,
      });
    } catch (error) {
      console.log(error);
      setIsLoading(false);
      setShowFinalMessage(true);
      setFinalMessage('Coś poszło nie tak :(');
    } finally {
      setIsLoading(false);
      setFinalMessage('Zlecenie utworzone!');
      setShowFinalMessage(true);
      setIsLoading(false);
    }
  };

  return {
    imgLabel,
    imgSrc,
    isLoading,
    finalMessage,
    showFinalMessage,
    title,
    client,
    path,
    description,
    imgFile,
    priority,
    status,
    deadline,
    handleIconClick,
    imgIconRef,
    handleFileChange,
    handleTitleChange,
    handleClientChange,
    handlePathChange,
    handleDescriptionChange,
    handlePriorityChange,
    handleStatusChange,
    handleDeadlineChange,
    createTaskHandler,
    clearValues,
  };
};

export default useAddNewTask;
