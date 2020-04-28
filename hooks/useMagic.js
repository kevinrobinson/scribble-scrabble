import fetch from 'unfetch'
import useSWR from 'swr'

function fetcher(url) {
  return fetch(url).then(r => r.json());
}

export function useMagic(key, options) {
  return useSWR(key, fetcher, options);
}
  