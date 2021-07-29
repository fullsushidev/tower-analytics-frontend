import React, { useEffect, FunctionComponent } from 'react';

import { useQueryParams } from '../../Utilities/useQueryParams';
import useRequest from '../../Utilities/useRequest';

import LoadingState from '../../Components/LoadingState';
import EmptyState from '../../Components/EmptyState';
import NoResults from '../../Components/NoResults';
import ApiErrorState from '../../Components/ApiErrorState';
import Pagination from '../../Components/Pagination';

import {
  preflightRequest,
  QueryFilter,
  QueryParams,
  readJobExplorer,
  readJobExplorerOptions,
} from '../../Api';
import { jobExplorer } from '../../Utilities/constants';

import Main from '@redhat-cloud-services/frontend-components/Main';
import {
  PageHeader,
  PageHeaderTitle,
} from '@redhat-cloud-services/frontend-components/PageHeader';

import { Card, CardBody, PaginationVariant } from '@patternfly/react-core';

import JobExplorerList from '../../Components/JobExplorerList';
import FilterableToolbar from '../../Components/Toolbar';
import { getQSConfig } from '../../Utilities/qs';

const optionDefaultValue = {};
const jobExplorerDefaultValue = {
  items: [],
  meta: { count: 0, counts: {}, legend: [] },
};

const initialQueryParams = {
  ...jobExplorer.defaultParams,
  attributes: jobExplorer.attributes,
};
const qsConfig = getQSConfig('job-explorer', { ...initialQueryParams }, [
  'limit',
  'offset',
]);

const JobExplorer: FunctionComponent<Record<string, never>> = () => {
  const { error: preflightError, request: setPreflight } = useRequest(
    preflightRequest,
    {}
  );

  const {
    queryParams,
    setFromPagination,
    setFromToolbar,
    dispatch: queryParamsDispatch,
  } = useQueryParams<QueryFilter>(qsConfig);

  const {
    result: options,
    error,
    request: fetchOptions,
  } = useRequest(readJobExplorerOptions, optionDefaultValue);

  const {
    result: { items, meta },
    isLoading: dataIsLoading,
    isSuccess: dataIsSuccess,
    request: fetchEndpoints,
  } = useRequest(readJobExplorer, jobExplorerDefaultValue);

  useEffect(() => {
    setPreflight();
  }, []);

  useEffect(() => {
    fetchOptions(queryParams);
    fetchEndpoints(queryParams);
  }, [queryParams]);

  if (preflightError) return <EmptyState preflightError={preflightError} />;
  if (error) return <ApiErrorState error={error} />;

  return (
    <React.Fragment>
      <PageHeader>
        <PageHeaderTitle title={'Job Explorer'} />
      </PageHeader>

      {!preflightError && (
        <Main>
          <Card>
            <CardBody>
              <FilterableToolbar
                categories={options}
                filters={queryParams}
                qsConfig={qsConfig}
                setFilters={setFromToolbar}
                pagination={
                  <Pagination
                    count={meta?.count}
                    params={{
                      limit: queryParams.limit,
                      offset: queryParams.offset,
                    }}
                    qsConfig={qsConfig as QueryParams}
                    setPagination={setFromPagination}
                    isCompact
                  />
                }
                hasSettings
              />
              {dataIsLoading && <LoadingState />}
              {dataIsSuccess && items && items.length <= 0 && <NoResults />}
              {dataIsSuccess && items && items.length > 0 && (
                <JobExplorerList
                  jobs={items}
                  queryParams={queryParams}
                  queryParamsDispatch={queryParamsDispatch}
                />
              )}
              <Pagination
                count={meta?.count}
                params={{
                  limit: queryParams.limit,
                  offset: queryParams.offset,
                }}
                qsConfig={qsConfig as QueryParams}
                setPagination={setFromPagination}
                variant={PaginationVariant.bottom}
              />
            </CardBody>
          </Card>
        </Main>
      )}
    </React.Fragment>
  );
};

export default JobExplorer;
