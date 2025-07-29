function generateSearchID(numberOfTasks?) {
  const date = new Date();
  const year = date.getFullYear().toString().slice(2);
  const month = String(date.getMonth() + 1).padStart(2, '0');
  // const day = date.getDate();
  // const searchID = `${year}${month}${String(numberOfTasks).padStart(
  //   4,
  //   '0'
  // )}${Math.floor(100000 + Math.random() * 900000)}`;
  const searchID = numberOfTasks
    ? `${year}${month}${String(numberOfTasks).padStart(4, '0')}`
    : `${year}${month}${Math.floor(1000 + Math.random() * 9000)}`;
  return Number(searchID);
}

export default generateSearchID;
