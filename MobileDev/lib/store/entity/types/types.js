import boolean from './boolean/boolean';
import iso8601 from './date/iso8601';
import unix from './date/unix';
import milliseconds from './duration/milliseconds';
import single from './enum/single';
import status from './enum/status';
import integer from './number/integer';
import percent from './number/percent';
import micros from './money/micros';
import plain from './text/plain';
import timezone from './text/timezone';
import tokens from './text/tokens';
import link from './text/link';
import file from './file/file';

export function makeTypeMap(types) {
  return types.reduce((m, t) => {
    m[t.type] = t;
    return m;
  }, {});
}

export default makeTypeMap([
  boolean,
  iso8601,
  unix,
  milliseconds,
  single,
  status,
  integer,
  percent,
  micros,
  plain,
  timezone,
  tokens,
  link,
  file,
]);
