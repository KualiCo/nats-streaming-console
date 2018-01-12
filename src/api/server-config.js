import axios from 'axios'

// export const config = {
//   host: 'localhost',
//   port: '4222',
//   monitoringPort: '8222'
// }

export async function getServerConfig() {
  return axios({
    method: 'get',
    url: '/api/server',
    headers: { 'Content-Type': 'application/json' }
  }).then(resp => resp.data)
}

export async function updateServerConfig(data) {
  return axios({
    method: 'post',
    url: '/api/server',
    headers: { 'Content-Type': 'application/json' },
    data
  }).then(resp => resp.data)
}
