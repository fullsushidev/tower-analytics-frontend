/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
import { ApiFeatureFlagReturnType } from '../FeatureFlags/types';
import {
  get,
  post,
  postWithPagination,
  deleteById,
  updateById,
  authenticatedFetch,
} from './methods';
import {
  Params,
  ParamsWithPagination,
  DeleteParams,
  UpdateParams,
  ApiJson,
  JobExplorerRequest,
  RequestFunction,
  JobExplorerOptionsRequest,
  PrefetchRequest,
} from './types';

/* v0 endpoints */
export const clustersEndpoint = `/api/tower-analytics/v0/clusters/`;
export const notificationsEndpoint = `/api/tower-analytics/v0/notifications/`;
export const preflightEndpoint = `/api/tower-analytics/v0/authorized/`;

/* v1 endpoints */
export const jobExplorerEndpoint = '/api/tower-analytics/v1/job_explorer/';
export const hostExplorerEndpoint = '/api/tower-analytics/v1/host_explorer/';
export const eventExplorerEndpoint = '/api/tower-analytics/v1/event_explorer/';
export const ROIEndpoint = '/api/tower-analytics/v1/roi_templates/';
export const plansEndpoint = '/api/tower-analytics/v1/plans/';
export const planEndpoint = '/api/tower-analytics/v1/plan/';

/* page options endpoints */
export const jobExplorerOptionsEndpoint =
  '/api/tower-analytics/v1/job_explorer_options/';
export const ROITemplatesOptionsEndpoint =
  '/api/tower-analytics/v1/roi_templates_options/';
export const orgOptionsEndpoint =
  '/api/tower-analytics/v1/dashboard_organization_statistics_options/';
export const clustersOptionsEndpoint =
  '/api/tower-analytics/v1/dashboard_clusters_options/';
export const planOptionsEndpoint = '/api/tower-analytics/v1/plan_options/';

const featuresEndpoint = '/api/featureflags/v0';

export const getFeatures = async (): Promise<ApiFeatureFlagReturnType> => {
  try {
    const url = new URL(featuresEndpoint, window.location.origin);
    const response = await authenticatedFetch(url.toString());
    return response.ok ? response.json() : {};
  } catch (_error) {
    return {};
  }
};

export const preflightRequest: RequestFunction<PrefetchRequest> = () =>
  authenticatedFetch(preflightEndpoint) as Promise<PrefetchRequest['promise']>;

export const readJobExplorer: RequestFunction<JobExplorerRequest> = (params) =>
  postWithPagination(jobExplorerEndpoint, params) as Promise<
    JobExplorerRequest['promise']
  >;

export const readJobExplorerOptions: RequestFunction<JobExplorerOptionsRequest> =
  (params) =>
    post(jobExplorerOptionsEndpoint, params) as Promise<
      JobExplorerOptionsRequest['promise']
    >;

export const readEventExplorer = (
  params: ParamsWithPagination
): Promise<ApiJson> =>
  postWithPagination(eventExplorerEndpoint, params) as Promise<ApiJson>;

export const readROI = (params: ParamsWithPagination): Promise<ApiJson> =>
  postWithPagination(ROIEndpoint, params) as Promise<ApiJson>;

export const readROIOptions = (params: Params): Promise<ApiJson> =>
  post(ROITemplatesOptionsEndpoint, params) as Promise<ApiJson>;

export const readHostExplorer = (
  params: ParamsWithPagination
): Promise<ApiJson> =>
  postWithPagination(hostExplorerEndpoint, params) as Promise<ApiJson>;

export const readOrgOptions = (params: Params): Promise<ApiJson> =>
  post(orgOptionsEndpoint, params) as Promise<ApiJson>;

export const readPlans = (params: ParamsWithPagination): Promise<ApiJson> =>
  postWithPagination(plansEndpoint, params) as Promise<ApiJson>;

export const createPlan = (params: Params): Promise<ApiJson> =>
  post(planEndpoint, params) as Promise<ApiJson>;

export const readPlan = (id: number): Promise<ApiJson> =>
  get(`${planEndpoint}${id}/`) as Promise<ApiJson>;

export const deletePlan = ({ id }: DeleteParams): Promise<ApiJson> =>
  deleteById(planEndpoint, id) as Promise<ApiJson>;

export const updatePlan = ({
  id,
  params = {},
}: UpdateParams): Promise<ApiJson> =>
  updateById(planEndpoint, id, params) as Promise<ApiJson>;

export const readPlanOptions = (params: Params = {}): Promise<ApiJson> =>
  get(planOptionsEndpoint, params) as Promise<ApiJson>;

export const readClusters = (): Promise<ApiJson> =>
  get(clustersEndpoint) as Promise<ApiJson>;

export const readClustersOptions = (params: Params): Promise<ApiJson> =>
  post(clustersOptionsEndpoint, params) as Promise<ApiJson>;

export const readNotifications = (params: Params): Promise<ApiJson> =>
  get(notificationsEndpoint, params) as Promise<ApiJson>;
