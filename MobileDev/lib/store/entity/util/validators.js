import { isArray } from 'lodash';
import { momentFromString } from 'store/lib/entity/util/memoizedMoment';

/**
 * If the value is null, undefined, or an empty array, then append the message
 * to the errors list.
 * @param  {Array<String>} key     - The keypath to the required prop.
 * @param  {Immutable.Map} record  - The record being validated.
 * @param  {Array<Object>} errors  - The list of errors for this record. Mutated!
 * @param  {String} message - The error message to display.
 */
export function required(key, record, errors, message) {
  const val = record.getIn(key);
  if (
    (!val && val !== false) ||
    (isArray(val) && !val.length)
  ) {
    errors.push({ message, key: key.join('.') });
  }
}

/**
 * If the value is 0 or otherwise not falsy and less than the given minimum, then
 * append the message to the errors list.
 * @param  {Array<String>} key     - The keypath to the required prop.
 * @param  {Number} key            - The minimum value.
 * @param  {Immutable.Map} record  - The record being validated.
 * @param  {Array<Object>} errors  - The list of errors for this record. Mutated!
 * @param  {String} message - The error message to display.
 */
export function minimum(key, min, record, errors, message) {
  const val = record.getIn(key);
  if ((val || val === 0) && val < min) {
    errors.push({ message, key: key.join('.') });
  }
}

/**
 * If the value is 0 or otherwise not falsy and less than the given maximum, then
 * append the message to the errors list.
 * @param  {Array<String>} key     - The keypath to the required prop.
 * @param  {Number} key            - The maximum value.
 * @param  {Immutable.Map} record  - The record being validated.
 * @param  {Array<Object>} errors  - The list of errors for this record. Mutated!
 * @param  {String} message - The error message to display.
 */
export function maximum(key, max, record, errors, message) {
  const val = record.getIn(key);
  if ((val || val === 0) && val > max) {
    errors.push({ message, key: key.join('.') });
  }
}

/**
 * If there is an end and start time on the record, append the error message
 * if the end time is prior to the start time.
 * @param  {Immutable.Map} record       - The record being validated.
 * @param  {Array<Object} errors        - The list of errors for this record. Mutated!
 * @param  {Array}  endTimeKey          - The path to the end time on the record.
 * @param  {Array}  startTimeKey        - The path to the start time on the record.
 */
export function endAfterStart(record, errors, endTimeKey = ['end_time'], startTimeKey = ['start_time']) {
  const start_time = record.getIn(startTimeKey);
  const end_time = record.getIn(endTimeKey);
  if (!end_time) {
    return;
  }
  if (momentFromString(end_time) < momentFromString(start_time)) {
    errors.push({ key: 'end_time', message: 'End Time must be later than Start Time.' });
  }
}
