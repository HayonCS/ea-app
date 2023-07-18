export const dateToString = (date: Date) => {
  const str =
    date.getFullYear() +
    "-" +
    (date.getMonth() < 9 ? "0" : "") +
    (date.getMonth() + 1) +
    "-" +
    (date.getDate() < 10 ? "0" : "") +
    date.getDate();
  return str;
};

export const getHHMMSS = (minutes: number) => {
  const mins = Math.abs(minutes);
  const m = Math.floor(mins % 60);
  const h = (mins - (mins % 60)) / 60;
  const s = Math.floor(((mins % 60) - m) * 60);
  const label =
    (minutes < 0 ? "-" : "") +
    (h < 10 ? "0" : "") +
    h +
    ":" +
    (m < 10 ? "0" : "") +
    m +
    ":" +
    (s < 10 ? "0" : "") +
    s;
  return label;
};

// export const getDateString = (date: Date) => {
//   let month = ("0" + (date.getMonth() + 1)).slice(-2);
//   let day = ("0" + date.getDate()).slice(-2);
//   let dateString = month + "/" + day + "/" + date.getFullYear();
//   return dateString;
// };

// export const getTimeString = (date: Date) => {
//   let dateString = date.toLocaleTimeString();
//   return dateString;
// };

// export const getDateTimeString = (date: Date) => {
//   return getDateString(date) + "\xa0\xa0\xa0\xa0" + getTimeString(date);
// };

// export const getShift = (date: Date) => {
//   var shiftFirst = new Date(date.getTime());
//   var shiftSecond = new Date(date.getTime());
//   shiftFirst.setHours(2);
//   shiftFirst.setMinutes(15);
//   shiftFirst.setSeconds(0);
//   shiftSecond.setHours(14);
//   shiftSecond.setMinutes(15);
//   shiftSecond.setSeconds(0);
//   if (date < shiftFirst) {
//     return 2;
//   }
//   if (date < shiftSecond) {
//     return 1;
//   }
//   if (date >= shiftSecond) {
//     return 2;
//   }
//   return 0;
// };

// export const getDateStringCurrent = () => {
//   var date = new Date();
//   var month = ("0" + (date.getMonth() + 1)).slice(-2);
//   var dateString = date.getFullYear() + "-" + month + "-" + date.getDate();
//   return dateString;
// };

// export const getDateStringShift = () => {
//   var date = new Date();
//   var shiftFirst = new Date(date.getTime());
//   shiftFirst.setHours(2);
//   shiftFirst.setMinutes(15);
//   shiftFirst.setSeconds(0);
//   if (date < shiftFirst) {
//     return getDateStringPrevious();
//   }
//   var month = ("0" + (date.getMonth() + 1)).slice(-2);
//   var dateString = date.getFullYear() + "-" + month + "-" + date.getDate();
//   return dateString;
// };

// export const getDateStringPrevious = () => {
//   var date = new Date(new Date().setDate(new Date().getDate() - 1));
//   var month = ("0" + (date.getMonth() + 1)).slice(-2);
//   var dateString = date.getFullYear() + "-" + month + "-" + date.getDate();
//   return dateString;
// };

// export const getDateStringNext = () => {
//   var date = new Date(new Date().setDate(new Date().getDate() + 1));
//   var month = ("0" + (date.getMonth() + 1)).slice(-2);
//   var dateString = date.getFullYear() + "-" + month + "-" + date.getDate();
//   return dateString;
// };

// // export const getTimeString = (date: Date) => {
// //   var hour = ("0" + date.getHours()).slice(-2);
// //   var min = ("0" + date.getMinutes()).slice(-2);
// //   var dateString = hour + ":" + min;
// //   return dateString;
// // };

// export const getTimeStringConnection = (date: Date) => {
//   var dateString = date.toLocaleTimeString();
//   return dateString;
// };
