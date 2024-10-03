export const convertToDdMmYyyyHhMmSs = (dateTime) => {
  let date = new Date(dateTime);
  var day = date.getDate() <= 9 ? "0" + date.getDate() : date.getDate();
  var month =
    date.getMonth() + 1 <= 9
      ? "0" + (date.getMonth() + 1)
      : date.getMonth() + 1;
  var dateString =
    day +
    "/" +
    month +
    "/" +
    date.getFullYear() +
    " " +
    (date.getHours().toString().length === 2
      ? date.getHours()
      : "0" + date.getHours()) +
    ":" +
    (date.getMinutes().toString().length === 2
      ? date.getMinutes()
      : "0" + date.getMinutes()) +
    ":" +
    (date.getSeconds().toString().length === 2
      ? date.getSeconds()
      : "0" + date.getSeconds());

  return dateString;
};

export const convertToYyyyMmDd = (dateTime) => {
  let date = new Date(dateTime);
  var day = date.getDate() <= 9 ? "0" + date.getDate() : date.getDate();
  var month =
    date.getMonth() + 1 <= 9
      ? "0" + (date.getMonth() + 1)
      : date.getMonth() + 1;
  var dateString = date.getFullYear() + "-" + month + "-" + day;

  return dateString;
};
export const convertToDdMmYyyy = (dateTime) => {
  let date = new Date(dateTime);
  var day = date.getDate() <= 9 ? "0" + date.getDate() : date.getDate();
  var month =
    date.getMonth() + 1 <= 9
      ? "0" + (date.getMonth() + 1)
      : date.getMonth() + 1;
  var dateString = day + "/" + month + "/" + date.getFullYear();

  return dateString;
};
export const convertToMmDdYyyy = (dateTime) => {
  let date = new Date(dateTime);
  var day = date.getDate() <= 9 ? "0" + date.getDate() : date.getDate();
  var month =
    date.getMonth() + 1 <= 9
      ? "0" + (date.getMonth() + 1)
      : date.getMonth() + 1;
  var dateString = month + "/" + day + "/" + date.getFullYear();

  return dateString;
};

export const convertToMDYYYY = (dateTime) => {
  let date = new Date(dateTime);
  var day = date.getDate();
  var month = date.getMonth() + 1;
  var dateString = month + "/" + day + "/" + date.getFullYear();

  return dateString;
};

export const convertDateFromddmmyyyyString = (str) => {
  const [day, month, year] = str.split("/");
  const date = new Date(+year, month - 1, +day);

  return date; // 👉️ Fri Apr 22 2022
};
