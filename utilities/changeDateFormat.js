export const changeDateFormat = (dateString, timeElement) => {
  let date;
  let time;

  if (dateString === !"") {
    date = dateString.substring(0, 10);
  }
  if (timeElement === !"") {
    time = timeElement && timeElement.slice(-5);
  }

  return `${date} ${time}`
}