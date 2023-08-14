export const changeDateFormat = (dateString, timeElement) => {
  let date;
  let time;

  if (dateString) {
    date = dateString.substring(0, 10);
  }
  if (timeElement) {
    time = timeElement.slice(-5);
  }
  if (!time) {
    return null;
  }
  return `${date} ${time}`;
};
