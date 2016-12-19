import Immutable from 'immutable';
import { snakeCase, isString, isArray, isFunction } from 'lodash';
import { defaultMemoize, createSelectorCreator } from 'reselect';

export function normalizeModuleName(name) {
  if (!isString(name) || name.trim().length === 0) {
    throw new Error('module name must be a non-empty string');
  }

  return snakeCase(name).toUpperCase();
}

export function chunk(items, size) {
  if (!isArray(items)) throw new Error('items must be an array');
  if (!(size > 0) || Math.round(size) !== size) {
    throw new Error('size must be a positive integer');
  }

  let i = 0;
  const l = items.length;
  const o = [];
  while (i < l) {
    o.push(items.slice(i, i + size));
    i += size;
  }
  return o;
}

export function delay(time, fn, ...args) {
  if (!(time >= 0)) throw new Error('time must be a non-negative number');
  if (!isFunction(fn)) throw new Error('fn must be a function');
  return new Promise((resolve) => setTimeout(
    () => {
      resolve(fn(...args));
    },
    time
  ));
}

export function mapAsync(items, fn) {
  if (!isArray(items)) throw new Error('items must be an array');
  if (!isFunction(fn)) throw new Error('fn must be a function');

  return items.reduce(
    (p, item) => new Promise(
      (resolve) => {
        p.then((res) => delay(0, fn, item).then((resp) => {
          res.push(resp);
          resolve(res);
        }));
      }
    ),
    Promise.resolve([])
  );
}

export const createImmutableSelector = createSelectorCreator(
  defaultMemoize,
  Immutable.is
);
