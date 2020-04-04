
const currMonth = new Date().getMonth();
const currYear = new Date().getFullYear();

function formatPrevDate1(gapMonth) {
  const prevMonth = (currMonth - gapMonth) % 12 <= 0 ? (currMonth - gapMonth) % 12 + 12 : (currMonth - gapMonth) % 12;
  let prevYear;
  if (gapMonth < currMonth) prevYear = currYear;
  else prevYear = currYear - (gapMonth - currMonth + 1) / 12;
  return Math.floor(prevYear) + '-' + prevMonth;
}

export const xData = [
  formatPrevDate1(8),
  formatPrevDate1(7),
  formatPrevDate1(6),
  formatPrevDate1(5),
  formatPrevDate1(4),
  formatPrevDate1(3),
  formatPrevDate1(2),
  formatPrevDate1(1),
  currYear + '-' + currMonth,
  formatPrevDate1(-1),
];

export function getYData(query) {
  const arr = new Array(9);
  arr.fill(0);

  query.forEach((x) => {
    if (x.month && x.year) {
      let ind;
      if (x.month <= currMonth) ind = currMonth - x.month;
      else ind = 12 - x.month + currMonth;
      arr[9 - ind] = x.count;
    }
  });
  return arr;
}
