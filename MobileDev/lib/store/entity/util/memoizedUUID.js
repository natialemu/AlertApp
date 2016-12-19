import uuid from 'uuid';

export function memoizedUUID() {
  const ids = {};
  return (record) => {
    let uid;
    const recordID = record.id;
    if (recordID) {
      uid = ids[recordID];
      if (!uid) {
        uid = uuid.v1();
        ids[recordID] = uid;
      }
    } else {
      uid = uuid.v1();
    }
    return uid;
  };
}
