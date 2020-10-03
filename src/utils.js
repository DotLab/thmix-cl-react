// @ts-ignore
import {albums} from './json/albums';
// @ts-ignore
import {songs} from './json/songs';
import queryString from 'query-string';

export const avatarIconUrl = 'data:image/svg+xml;base64,PHN2ZyBoZWlnaHQ9JzMwMHB4JyB3aWR0aD0nMzAwcHgnICBmaWxsPSIjMDAwMDAwIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiBzdHJva2Utd2lkdGg9IjAuNTAxIiBzdHJva2UtbGluZWpvaW49ImJldmVsIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIHZlcnNpb249IjEuMSIgb3ZlcmZsb3c9InZpc2libGUiIHZpZXdCb3g9IjAgMCA5NiA5NiIgeD0iMHB4IiB5PSIwcHgiPjxnIGZpbGw9Im5vbmUiIHN0cm9rZT0iYmxhY2siIGZvbnQtZmFtaWx5PSJUaW1lcyBOZXcgUm9tYW4iIGZvbnQtc2l6ZT0iMTYiIHRyYW5zZm9ybT0ic2NhbGUoMSAtMSkiPjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKDAgLTk2KSI+PGc+PHBhdGggZD0iTSAzMi4xOSwyOS42NzcgTCAzMi4xOSwzMS4yNjIgQyAzMi4xOSwzNS45NjEgMzMuOTc4LDM5LjQzNSAzNi45OTQsNDEuNjg1IEMgMzkuOTQxLDQzLjg4MyA0My44NzUsNDQuNzggNDcuOTk4LDQ0Ljc4IEMgNTIuMTIyLDQ0Ljc4IDU2LjA1OSw0My44ODMgNTkuMDAzLDQxLjY4NSBDIDYyLjAxOCwzOS40MzYgNjMuODA5LDM1Ljk1NyA2My44MDksMzEuMjYyIEwgNjMuODA5LDI5LjY3NyBMIDMyLjE5LDI5LjY3NyBaIE0gMzkuMjE5LDU3LjU0MyBDIDM5LjIxOSw2Mi4zODkgNDMuMTUyLDY2LjMyMyA0Ny45OTcsNjYuMzIzIEMgNTIuODQ0LDY2LjMyMyA1Ni43NzcsNjIuMzg5IDU2Ljc3Nyw1Ny41NDMgQyA1Ni43NzcsNTIuNjk3IDUyLjg0NCw0OC43NjQgNDcuOTk3LDQ4Ljc2NCBDIDQzLjE1Miw0OC43NjQgMzkuMjE5LDUyLjY5NyAzOS4yMTksNTcuNTQzIFoiIHN0cm9rZT0ibm9uZSIgZmlsbD0iIzAwMDAwMCIgZmlsbC1ydWxlPSJldmVub2RkIiBzdHJva2Utd2lkdGg9IjAuNSIgbWFya2VyLXN0YXJ0PSJub25lIiBtYXJrZXItZW5kPSJub25lIiBzdHJva2UtbWl0ZXJsaW1pdD0iNzkuODQwMzE5MzYxMjc3NSI+PC9wYXRoPjwvZz48L2c+PC9nPjwvc3ZnPg==';

export function formatPct(number, digitCount) {
  if (number == null) return '0 %';
  if (typeof number === 'string') {
    number = parseFloat(number);
  }
  number *= 100;
  if (digitCount !== undefined) number = parseFloat(number.toFixed(digitCount));
  return number.toLocaleString() + ' %';
}

export function formatDate(date) {
  if (date == null) return null;
  if (typeof date === 'string') {
    date = new Date(date);
  }
  if (new Date().setHours(0, 0, 0, 0) <= date.getTime()) { // date is in today
    return date.toLocaleTimeString();
  }
  return date.toLocaleDateString();
}

export function formatDateTime(date) {
  if (date == null) return null;
  if (typeof date === 'string') {
    date = new Date(date);
  }
  return date.toLocaleString(date);
}

export function formatNumber(number, digitCount) {
  if (number == null) return '0';
  if (typeof number === 'string') {
    number = parseFloat(number);
  }
  if (digitCount !== undefined) number = parseFloat(number.toFixed(digitCount));
  return number.toLocaleString();
}

export function formatNumberShort(number, digitCount) {
  if (number == null) return null;
  if (typeof number === 'string') {
    number = parseFloat(number);
  }
  if (number < 1e3) {
    return number.toString();
  }
  if (number < 1e6) {
    return `${(number / 1e3).toFixed(digitCount)}K`;
  }
  if (number < 1e9) {
    return `${(number / 1e6).toFixed(digitCount)}M`;
  }
  return `${(number / 1e9).toFixed(digitCount)}B`;
}

const second = 1000;
const minute = second * 60;
const hour = minute * 60;
const day = hour * 24;
const year = day * 365;

export function getTimeSpanBetween(date1, date2) {
  if (!date1 || !date2) return {};
  if (typeof date1 === 'string') date1 = new Date(date1);
  if (typeof date2 === 'string') date2 = new Date(date2);
  return getTimeSpan(date1.getTime() - date2.getTime());
}

export function getTimeSpan(ms) {
  const y = Math.floor(ms / year);
  ms -= y * year;
  const d = Math.floor(ms / day);
  ms -= d * day;
  const h = Math.floor(ms / hour);
  ms -= h * hour;
  const m = Math.floor(ms / minute);
  ms -= m * minute;
  const s = Math.floor(ms / second);
  return {y, d, h, m, s};
}

export function formatTimeSpan(span, level) {
  const y = span.y ? span.y + 'y ' : '';
  const d = span.d ? span.d + 'd ' : '';
  const h = span.h ? span.h + 'h ' : '';
  const m = span.m ? span.m + 'm ' : '';
  const s = span.s ? span.s + 's' : '';

  let res;
  switch (level) {
    case 'y': res = y.trimRight(); break;
    case 'd': res = (y + d).trimRight(); break;
    case 'h': res = (y + d + h).trimRight(); break;
    case 'm': res = (y + d + h + m).trimRight(); break;
    default: res = (y + d + h + m + s).trimRight(); break;
  }
  return res ? res : '0' + (level ? level : 's');
}

export function onChange(e) {
  /* eslint-disable-next-line no-invalid-this */
  this.setState({[e.target.name]: e.target.value});
}

export function onCheckboxChange(e) {
  /* eslint-disable-next-line no-invalid-this */
  this.setState({[e.target.name]: e.target.checked});
}

export function onTextareaChange(e) {
  /* eslint-disable-next-line no-invalid-this */
  this.setState({[e.target.name]: e.target.value});
  /* eslint-disable-next-line no-invalid-this */
  this.setState({[e.target.name + 'RowCount']: e.target.value.split('\n').length});
}

export function onChangeNamed(name, e) {
  /* eslint-disable-next-line no-invalid-this */
  this.setState({[name]: e.target.value});
}

export function onChangeNamedDirect(name, value) {
  /* eslint-disable-next-line no-invalid-this */
  this.setState({[name]: value});
}

export function pushHistory() {
  /* eslint-disable-next-line no-invalid-this */
  this.props.history.push(this.props.location.pathname + '?' + queryString.stringify(this.query));
}

const _touhouAlbum = {};
albums.forEach((x) => _touhouAlbum[x.album] = {...x, songs: {}});
songs.forEach((x) => _touhouAlbum[x.album].songs[x.song] = {...x});

export const touhouAlbum = _touhouAlbum;

export function echartsDarkTheme(echarts) {
  const contrastColor = '#eee';
  const axisCommon = function() {
    return {
      axisLine: {
        lineStyle: {
          color: contrastColor,
        },
      },
      axisTick: {
        lineStyle: {
          color: contrastColor,
        },
      },
      axisLabel: {
        textStyle: {
          color: contrastColor,
        },
      },
      splitLine: {
        lineStyle: {
          type: 'dashed',
          color: '#aaa',
        },
      },
      splitArea: {
        areaStyle: {
          color: contrastColor,
        },
      },
    };
  };

  const colorPalette = [
    '#dd6b66',
    '#759aa0',
    '#e69d87',
    '#8dc1a9',
    '#ea7e53',
    '#eedd78',
    '#73a373',
    '#73b9bc',
    '#7289ab',
    '#91ca8c',
    '#f49f42',
  ];
  const theme = {
    color: colorPalette,
    backgroundColor: '#333',
    tooltip: {
      axisPointer: {
        lineStyle: {
          color: contrastColor,
        },
        crossStyle: {
          color: contrastColor,
        },
        label: {
          color: '#000',
        },
      },
    },
    legend: {
      textStyle: {
        color: contrastColor,
      },
    },
    title: {
      textStyle: {
        color: contrastColor,
      },
    },
    toolbox: {
      iconStyle: {
        normal: {
          borderColor: contrastColor,
        },
      },
    },

    // Area scaling controller
    dataZoom: {
      dataBackgroundColor: '#eee', // Data background color
      fillerColor: 'rgba(200,200,200,0.2)', // Fill the color
      handleColor: '#dd6b66', // Handle color
    },

    timeline: {
      itemStyle: {
        color: colorPalette[1],
      },
      lineStyle: {
        color: contrastColor,
      },
      controlStyle: {
        color: contrastColor,
        borderColor: contrastColor,
      },
      label: {
        color: contrastColor,
      },
    },

    timeAxis: axisCommon(),
    logAxis: axisCommon(),
    valueAxis: axisCommon(),
    categoryAxis: axisCommon(),

    line: {
      symbol: 'circle',
    },
    graph: {
      color: colorPalette,
    },

    gauge: {
      axisLine: {
        lineStyle: {
          color: [
            [0.2, '#dd6b66'],
            [0.8, '#759aa0'],
            [1, '#ea7e53'],
          ],
          width: 8,
        },
      },
    },

    candlestick: {
      itemStyle: {
        color: '#FD1050',
        color0: '#0CF49B',
        borderColor: '#FD1050',
        borderColor0: '#0CF49B',
      },
    },
  };

  theme.categoryAxis.splitLine.show = false;
  echarts.registerTheme('thmix_dark', theme);
}

export function getCurrentDay() {
  const d = new Date();
  d.setHours(24, 0, 0, 0);
  return d;
}

export function deleteFalsyKeys(obj) {
  for (const key of Object.keys(obj)) {
    if (!obj[key]) {
      delete obj[key];
    }
  }
  return obj;
}
