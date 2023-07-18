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
