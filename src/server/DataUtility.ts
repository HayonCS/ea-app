export const dateToString = (date: Date) => {
  let d = new Date(date);
  d.setHours(d.getHours() + 4);
  const str =
    d.getFullYear() +
    "-" +
    (d.getMonth() < 9 ? "0" : "") +
    (d.getMonth() + 1) +
    "-" +
    (d.getDate() < 10 ? "0" : "") +
    d.getDate();
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
