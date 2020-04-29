import {useState, useCallback, useEffect} from 'react';
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
  return fetch(url, { credentials: 'same-origin' }).then(r => {
    if(r.status !== 200) {
      throw new Error(r.status);
    }
    return r.json();
  });
}
export function useAutoFetchingMagic(key, options) {
  return useSWR(key, fetcher, options);
}
  

// let d = {};
// let t = {};
// let readClockMs = () => (new Date()).getTime();
export function usePlainFetching(url) {
  // // busted caching
  // const cachedData = (d[url] && readClockMs() > t[url] + 1000) ? d[url] : undefined;
  const cachedData = undefined;
  const [data, setData] = useState(cachedData || undefined);
  const [error, setError] = useState(undefined);
  const [isValidating, setIsValidating] = useState(cachedData === undefined);

  const mutate = useCallback(() => {
    // console.log('actualFetch');
    fetcher(url).then(json => {
      // d[url] = json;
      // t[url] = readClockMs();
      setData(json);
      setError(undefined);
      setIsValidating(false);
    }).catch(err => {
      // delete d[url];
      // delete t[url];
      setData(undefined);
      setError(err);
      setIsValidating(false);
    });
  }, [url]);

  useEffect(() => {
    if (!isValidating) return;
    mutate();
  }, [isValidating]);

  return {data, error, isValidating, mutate};
}