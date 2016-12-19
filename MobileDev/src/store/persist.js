import { createTransform } from 'redux-persist';
import immutableTransform from 'redux-persist-transform-immutable';
import records from './records';

export default {
  transforms: [
    createTransform(
      (state) => state,
      { whitelist: [records.name] }
    ),
    immutableTransform({}),
  ],
  whitelist: [records.name],
};
