import { stringify } from 'query-string';
import {
  ResponseTypes,
  Params,
  QueryParams,
  SuccessResponseTypes,
  FailResponseTypes,
  RequestTypes,
} from './types';

declare global {
  interface Window {
    insights: {
      chrome: {
        auth: {
          getUser: () => Promise<never>;
        };
      };
    };
  }
}

const handleResponse = (response: Response): Promise<ResponseTypes> => {
  return response.json().then((json: ResponseTypes) => {
    return response.ok
      ? Promise.resolve(json as SuccessResponseTypes)
      : Promise.reject(json as FailResponseTypes);
  });
};

export const authenticatedFetch = (
  endpoint: RequestInfo,
  options = {}
): Promise<Response> =>
  window.insights.chrome.auth.getUser().then(() =>
    fetch(endpoint, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  );

export const get = (
  endpoint: string,
  params: Params = {}
): Promise<ResponseTypes> => {
  const url = new URL(endpoint, window.location.origin);
  url.search = stringify(params);

  return authenticatedFetch(url.toString(), {
    method: 'GET',
  }).then(handleResponse);
};

export const post = <T extends RequestTypes>(
  endpoint: string,
  // TODO Remove QueryParams from the next line
  params: T['query'] | QueryParams = {}
): Promise<T['promise']> => {
  const url = new URL(endpoint, window.location.origin);
  return authenticatedFetch(url.toString(), {
    method: 'POST',
    body: JSON.stringify(params),
  }).then(handleResponse);
};

export const postWithPagination = <T extends RequestTypes>(
  endpoint: string,
  // TODO Remove QueryParams from the next line
  params: T['query'] | QueryParams = {}
): Promise<T['promise']> => {
  const { limit, offset, sort_by } = params;

  const url = new URL(endpoint, window.location.origin);
  url.search = stringify({
    limit,
    offset,
    sort_by,
  });

  return authenticatedFetch(url.toString(), {
    method: 'POST',
    body: JSON.stringify(params),
  }).then(handleResponse);
};

export const deleteById = (
  endpoint: string,
  id: string
): Promise<ResponseTypes> => {
  const url = new URL(endpoint + id, window.location.origin);
  return authenticatedFetch(url.toString(), {
    method: 'DELETE',
  }).then(handleResponse);
};

export const updateById = (
  endpoint: string,
  id: string,
  params: Params = {}
): Promise<ResponseTypes> => {
  const url = new URL(endpoint + id, window.location.origin);
  return authenticatedFetch(url.toString(), {
    method: 'PUT',
    body: JSON.stringify(params),
  }).then(handleResponse);
};
