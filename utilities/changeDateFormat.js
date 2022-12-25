export const changeDateFormat = (dateString, timeElement) => {

  let date = dateString.substring(0, 10);
  let time = timeElement && timeElement.slice(-5);

  return `${date} ${time}`
}