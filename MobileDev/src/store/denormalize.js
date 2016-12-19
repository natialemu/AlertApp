import Immutable from 'immutable';
import { iterEntities, entityNamePlural } from '../../lib/store/entity/util/iter';
import entities from './schema';

function makeRecordMap(records) {
  return records.reduce(
    (m, r) => {
      m[r.id] = r;
      return m;
    }, {}
  );
}

export default function denormalize(data) {
  const accounts = data.accounts;
  const rMap = {};
  const recordsFor = (n) => {
    const records = data[n];
    if (!records) {
      return { records: [], recordMap: {} };
    }
    const recordMap = makeRecordMap(records);
    if (!rMap[n]) {
      rMap[n] = recordMap;
    }
    return { records, recordMap };
  };
  const iter = iterEntities('children', entities.account, entities);
  let result = iter.next();
  while (!result.done) {
    const { relEntity, key, source } = result.value;
    const sourceName = entityNamePlural(source);
    const relName = entityNamePlural(relEntity);
    const sourceRecords = recordsFor(sourceName);
    const relRecords = recordsFor(relName);
    for (let i = 0; i < relRecords.records.length; i++) {
      const record = relRecords.records[i];
      const ifk = Immutable.fromJS(record).getIn(key);
      if (ifk) {
        const parent = sourceRecords.recordMap[ifk];
        if (!parent[relName]) {
          parent[relName] = [];
        }
        if (parent[relName].indexOf(record) === -1) {
          parent[relName].push(record);
        }
      }
    }
    result = iter.next();
  }
  return accounts;
}
