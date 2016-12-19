import moment from 'moment';

const stringMemos = {};
const unixMemos = {};

export function momentFromString(dateStr) {
  let memo = stringMemos[dateStr];
  if (!memo) {
    memo = stringMemos[dateStr] = moment(dateStr, moment.ISO_8601);
  }
  return memo;
}

export function momentFromTimestamp(timestamp) {
  let memo = unixMemos[timestamp];
  if (!memo) {
    memo = unixMemos[timestamp] = moment(timestamp, 'X');
  }
  return memo;
}
