import axios, { AxiosError } from 'axios';

import { apiPrefix, serverAddress } from '../config';

type RequestType = 'post' | 'put' | 'get' | 'delete';

interface IData<Data> {
  get: undefined;
  delete: undefined;
  post: Data;
  put: Data;
}

type RequestOptions<Data, Query, Type extends RequestType = RequestType> = {
  path: string;
  headers?: Record<string, string>;
  prefix?: '/api/v1';
  data?: IData<Data>[Type];
  query?: Query;
};

const requestToServer =
  <Type extends RequestType = RequestType>(type: RequestType) =>
  async <Response, Data = undefined, Query = undefined>({
    prefix = apiPrefix,
    path,
    headers,
    data,
    query,
  }: RequestOptions<Data, Query, Type>): Promise<Response> => {
    const token = sessionStorage.getItem('token');

    try {
      const response = await axios({
        method: type,
        url: `${serverAddress}${prefix}${path}`,
        ...(data ? { data } : {}),
        ...(query ? { params: query } : {}),

        headers: {
          ...(token
            ? { ...headers, authorization: `Bearer ${token}` }
            : headers),
        },
      });

      return response.data;
    } catch (err) {
      if (err instanceof AxiosError && err.response) {
        throw new RequestError(
          err.response.statusText,
          err.response.status,
          JSON.stringify(err.response.data),
        );
      }
      throw err;
    }
  };

export const post = requestToServer<'post'>('post');
export const put = requestToServer<'put'>('put');
export const get = requestToServer<'get'>('get');
export const del = requestToServer<'delete'>('delete');

export class RequestError extends Error {
  public statusCode: number;
  public message: string;
  constructor(name: string, status: number, message: string) {
    super(name);
    this.statusCode = status;
    this.message = message;
  }
}

export const isRequestError = (error: unknown): error is RequestError => {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    'statusCode' in error &&
    (typeof (error as Record<string, unknown>).message === 'string' ||
      typeof (error as Record<string, unknown>).message === 'object') &&
    typeof (error as Record<string, unknown>).statusCode === 'number'
  );
};
