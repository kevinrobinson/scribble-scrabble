import fetch from 'unfetch'
import useSWR from 'swr'


export function postJSON(url, params = {}) {
  return fetch(url, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    credentials: 'same-origin',
    ...params
  }).then(r => r.json());
}


function fetcher(url) {
  return fetch(url, { credentials: 'same-origin' }).then(r => r.json());
}
export function useAutoFetchingMagic(key, options) {
  return useSWR(key, fetcher, options);
}
  