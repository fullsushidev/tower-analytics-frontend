import { components, operations } from './openapi.generated';

export type Params = Record<string, string | number>;
export type ApiJson = Record<string, string | Record<string, unknown>>;

export interface ParamsWithPagination {
  limit?: string | number;
  offset?: string | number;
  sort_by?: string;
  [x: string]: string | number | undefined;
}

export type ReadParams = { params: Params };
export type ReadParamsWithPagination = { params: ParamsWithPagination };
export type DeleteParams = { id: string };
export type UpdateParams = { id: string; params: Params };

// Prefetch
export interface PrefetchRequest {
  query: undefined;
  promise: { msg?: string } | any;
  response: {
    success: { msg?: string };
    fail: Record<string, any>;
  };
}

// Job explorer
export type QueryFilter = components['schemas']['QueryFilter'] &
  operations['job_explorer']['parameters']['query'];
export type SuccessJobExplorerResponse =
  operations['job_explorer']['responses']['200']['content']['application/json'];
export type FailJobExplorerResponse =
  operations['job_explorer']['responses']['422']['content']['application/json'];

export interface JobExplorerRequest {
  query: QueryFilter;
  promise: SuccessJobExplorerResponse | FailJobExplorerResponse;
  response: {
    success: SuccessJobExplorerResponse;
    fail: FailJobExplorerResponse;
  };
}

// Job explorer OPTIONS
export type SuccessJobExplorerOptionsResponse =
  operations['job_explorer_options']['responses']['200']['content']['application/json'];
export type FailJobExplorerOptionsResponse =
  operations['job_explorer_options']['responses']['422']['content']['application/json'];

export interface JobExplorerOptionsRequest {
  query: QueryFilter;
  promise: SuccessJobExplorerOptionsResponse | FailJobExplorerOptionsResponse;
  response: {
    success: SuccessJobExplorerOptionsResponse;
    fail: FailJobExplorerOptionsResponse;
  };
}

// Global types
export type QueryParams =
  | ParamsWithPagination // TODO REMOVE
  | QueryFilter;

export type FailResponseTypes =
  | FailJobExplorerResponse
  | FailJobExplorerOptionsResponse;

export type SuccessResponseTypes =
  | ApiJson // TODO REMOVE
  | SuccessJobExplorerResponse
  | SuccessJobExplorerOptionsResponse;

export type ResponseTypes = FailResponseTypes | SuccessResponseTypes;
export type RequestTypes =
  | PrefetchRequest
  | JobExplorerRequest
  | JobExplorerOptionsRequest;

export interface RequestFunction<T extends RequestTypes> {
  (params: T['query']): Promise<T['promise']>;
}
