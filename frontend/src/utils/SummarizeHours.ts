const summarizeHours = (array) => {
  const totalHours = array.reduce((acc, task) => acc + task.hours, 0);

  return totalHours;
};

export default summarizeHours;
