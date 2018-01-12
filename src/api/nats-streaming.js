import axios from 'axios'

// const SERVERS = {
//   "cluster_id": "test-cluster",
//   "server_id": "cwZa1M7yf8hdEfdEIrLPtG",
//   "version": "0.5.0",
//   "go": "go1.7.6",
//   "state": "STANDALONE",
//   "now": "2017-10-13T22:23:11.0329339Z",
//   "start_time": "2017-10-13T20:37:28.3764861Z",
//   "uptime": "1h45m42s",
//   "clients": 2,
//   "subscriptions": 6,
//   "channels": 6,
//   "total_msgs": 771,
//   "total_bytes": 105806
// }

// const STORES = {
//   "cluster_id": "test-cluster",
//   "server_id": "cwZa1M7yf8hdEfdEIrLPtG",
//   "now": "2017-10-13T21:12:13.9924207Z",
//   "type": "FILE",
//   "limits": {
//     "max_channels": 100,
//     "max_msgs": 1000000,
//     "max_bytes": 1024000000,
//     "max_age": 0,
//     "max_subscriptions": 1000
//   },
//   "total_msgs": 771,
//   "total_bytes": 105806
// }

// const CHANNELS = {
//   "cluster_id": "test-cluster",
//   "server_id": "cwZa1M7yf8hdEfdEIrLPtG",
//   "now": "2017-10-13T22:23:47.4196729Z",
//   "offset": 0,
//   "limit": 1024,
//   "count": 6,
//   "total": 6,
//   "channels": [
//     {
//       "name": "cor",
//       "msgs": 0,
//       "bytes": 0,
//       "first_seq": 0,
//       "last_seq": 0
//     },
//     {
//       "name": "hackweek",
//       "msgs": 0,
//       "bytes": 0,
//       "first_seq": 0,
//       "last_seq": 0
//     },
//     {
//       "name": "hackweek.test.subject.one",
//       "msgs": 420,
//       "bytes": 57413,
//       "first_seq": 1,
//       "last_seq": 420,
//       "subscriptions": [
//         {
//           "inbox": "_INBOX.GR2GOUWO1Q3HAF1UTZYTCG",
//           "ack_inbox": "_INBOX.cwZa1M7yf8hdEfdEIrLQ2Y",
//           "durable_name": "test-durable-name",
//           "is_durable": true,
//           "max_inflight": 1,
//           "ack_wait": 10,
//           "last_sent": 416,
//           "pending_count": 1,
//           "is_stalled": true
//         }
//       ]
//     },
//     {
//       "name": "hackweek.test.subject.three",
//       "msgs": 140,
//       "bytes": 19613,
//       "first_seq": 1,
//       "last_seq": 140,
//       "subscriptions": [
//         {
//           "inbox": "_INBOX.GR2GOUWO1Q3HAF1UTZYTIC",
//           "ack_inbox": "_INBOX.cwZa1M7yf8hdEfdEIrLQ5e",
//           "durable_name": "test-durable-name",
//           "is_durable": true,
//           "max_inflight": 1,
//           "ack_wait": 10,
//           "last_sent": 139,
//           "pending_count": 1,
//           "is_stalled": true
//         }
//       ]
//     },
//     {
//       "name": "hackweek.test.subject.two",
//       "msgs": 211,
//       "bytes": 28780,
//       "first_seq": 1,
//       "last_seq": 211,
//       "subscriptions": [
//         {
//           "inbox": "_INBOX.GR2GOUWO1Q3HAF1UTZYTFE",
//           "ack_inbox": "_INBOX.cwZa1M7yf8hdEfdEIrLQ46",
//           "durable_name": "test-durable-name",
//           "is_durable": true,
//           "max_inflight": 1,
//           "ack_wait": 10,
//           "last_sent": 209,
//           "pending_count": 1,
//           "is_stalled": true
//         }
//       ]
//     },
//     {
//       "name": "toElasticsearch",
//       "msgs": 0,
//       "bytes": 0,
//       "first_seq": 0,
//       "last_seq": 0
//     }
//   ]
// }

// const CLIENTS =
// {
//   "cluster_id": "test-cluster",
//   "server_id": "cwZa1M7yf8hdEfdEIrLPtG",
//   "now": "2017-10-13T22:25:02.896463Z",
//   "offset": 0,
//   "limit": 1024,
//   "count": 4,
//   "total": 4,
//   "clients": [
//     {
//       "id": "cor-main-default_9af7de4b6740",
//       "hb_inbox": "_INBOX.6S17LBVY36GXN499WPVDS6"
//     },
//     {
//       "id": "cor-workflows-development_349574cbccba",
//       "hb_inbox": "_INBOX.26QSTN9JZQOXBZAXOXHOA5"
//     },
//     {
//       "id": "test-ordered-subscriber-2",
//       "hb_inbox": "_INBOX.V9O12JF9BCV1KXVUC2VPEK",
//       "subscriptions": {
//         "hackweek.test.subject.one": [
//           {
//             "inbox": "_INBOX.V9O12JF9BCV1KXVUC2VPSW",
//             "ack_inbox": "_INBOX.cwZa1M7yf8hdEfdEIrLaQg",
//             "durable_name": "test-durable-name",
//             "is_durable": true,
//             "max_inflight": 1,
//             "ack_wait": 10,
//             "last_sent": 437,
//             "pending_count": 0,
//             "is_stalled": false
//           }
//         ],
//         "hackweek.test.subject.three": [
//           {
//             "inbox": "_INBOX.V9O12JF9BCV1KXVUC2VQLK",
//             "ack_inbox": "_INBOX.cwZa1M7yf8hdEfdEIrLaTm",
//             "durable_name": "test-durable-name",
//             "is_durable": true,
//             "max_inflight": 1,
//             "ack_wait": 10,
//             "last_sent": 145,
//             "pending_count": 0,
//             "is_stalled": false
//           }
//         ],
//         "hackweek.test.subject.two": [
//           {
//             "inbox": "_INBOX.V9O12JF9BCV1KXVUC2VQ78",
//             "ack_inbox": "_INBOX.cwZa1M7yf8hdEfdEIrLaSE",
//             "durable_name": "test-durable-name",
//             "is_durable": true,
//             "max_inflight": 1,
//             "ack_wait": 10,
//             "last_sent": 219,
//             "pending_count": 0,
//             "is_stalled": false
//           }
//         ]
//       }
//     },
//     {
//       "id": "test-publisher",
//       "hb_inbox": "_INBOX.XC4NIJC4C68NIN6JX4DJY8"
//     }
//   ]
// }

export function getServers() {
  // return Promise.resolve(SERVERS)
  return axios({
    method: 'get',
    url: '/streaming/serverz',
    headers: { 'Content-Type': 'application/json' }
  }).then(resp => resp.data)
}

export function getStores() {
  // return Promise.resolve(STORES)
  return axios({
    method: 'get',
    url: '/streaming/storez',
    headers: { 'Content-Type': 'application/json' }
  }).then(resp => resp.data)
}

export function getClients() {
  // return Promise.resolve(CLIENTS)
  return axios({
    method: 'get',
    url: '/streaming/clientsz',
    params: {
      subs: 1
    },
    headers: { 'Content-Type': 'application/json' }
  }).then(resp => resp.data)
}

export function getChannels() {
  // return Promise.resolve(CHANNELS)
  return axios({
    method: 'get',
    url: '/streaming/channelsz',
    params: {
      subs: 1
    },
    headers: { 'Content-Type': 'application/json' }
  }).then(resp => resp.data)
}

export function getMessages(channel) {
  return axios({
    method: 'get',
    url: `/api/channel/${channel}/message`,
    headers: { 'Content-Type': 'application/json' }
  }).then(resp => resp.data)
}
