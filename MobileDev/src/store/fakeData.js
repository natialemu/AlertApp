import uuid from 'uuid';

const accountID = 1;
const userID = 2;
const FAKE_DATA = () => ({
  accounts: [
    {
      id: accountID,
      name: 'Master Account'
    }
  ],
  users: [
    {
      account_id: accountID,
      id: userID,
      name: 'admin'
    }
  ],
  events: [
    {
      id: uuid.v1(),
      user_id: userID,
      name: 'Fake Event 1',
      description: 'This is an example event',
      start_time: 1481171482,
      end_time: 1483331482,
    },
    {
      id: uuid.v1(),
      user_id: userID,
      name: 'Fake Event 2',
      description: 'This is an example event',
      start_time: 1481171482,
      end_time: 1483331482,
    },
    {
      id: uuid.v1(),
      user_id: userID,
      name: 'Fake Event 3',
      description: 'This is an example event',
      start_time: 1481171482,
      end_time: 1483331482,
    },
    {
      id: uuid.v1(),
      user_id: userID,
      name: 'Fake Event 1',
      description: 'This is an example event',
      start_time: 1482208282,
      end_time: 1483331482,
    },
    {
      id: uuid.v1(),
      user_id: userID,
      name: 'Fake Event 4',
      description: 'This is an example event',
      start_time: 1482208282,
      end_time: 1483331482,
    },
    {
      id: uuid.v1(),
      user_id: userID,
      name: 'Fake Event 5',
      description: 'This is an example event',
      start_time: 1482208282,
      end_time: 1483331482,
    },
    {
      id: uuid.v1(),
      user_id: userID,
      name: 'Fake Event 6',
      description: 'This is an example event',
      start_time: 1483072282,
      end_time: 1483331482,
    },
    {
      id: uuid.v1(),
      user_id: userID,
      name: 'Fake Event 7',
      description: 'This is an example event',
      start_time: 1483072282,
      end_time: 1483331482,
    },
    {
      id: uuid.v1(),
      user_id: userID,
      name: 'Fake Event 8',
      description: 'This is an example event',
      start_time: 1483072282,
      end_time: 1483331482,
    },
    {
      id: uuid.v1(),
      user_id: userID,
      name: 'Fake Event 9',
      description: 'This is an example event',
      start_time: 1483072282,
      end_time: 1483331482,
    },
    {
      id: uuid.v1(),
      user_id: userID,
      name: 'Fake Event 10',
      description: 'This is an example event',
      start_time: 1483072282,
      end_time: 1483331482,
    },
    {
      id: uuid.v1(),
      user_id: userID,
      name: 'Fake Event 11',
      description: 'This is an example event',
      start_time: 1483072282,
      end_time: 1483331482,
    },
    {
      id: uuid.v1(),
      user_id: userID,
      name: 'Fake Event 12',
      description: 'This is an example event',
      start_time: 1483072282,
      end_time: 1483331482,
    },
    {
      id: uuid.v1(),
      user_id: userID,
      name: 'Fake Event 13',
      description: 'This is an example event',
      start_time: 1483072282,
      end_time: 1483331482,
    },
    {
      id: uuid.v1(),
      user_id: userID,
      name: 'Fake Event 14',
      description: 'This is an example event',
      start_time: 1483072282,
      end_time: 1483331482,
    },
    {
      id: uuid.v1(),
      user_id: userID,
      name: 'Fake Event 15',
      description: 'This is an example event',
      start_time: 1483072282,
      end_time: 1483331482,
    },
    {
      id: uuid.v1(),
      user_id: userID,
      name: 'Fake Event 16',
      description: 'This is an example event',
      start_time: 1483072282,
      end_time: 1483331482,
    },
  ]
});

export default FAKE_DATA();
