import { useEffect, useState, useCallback } from 'react';
import { FailResponseTypes, RequestFunction, RequestTypes } from '../Api';
import useIsMounted from './useIsMounted';

/*
 * The useRequest hook accepts a request function and returns an object with
 * five values:
 *   request: a function to call to invoke the request
 *   result: the value returned from the request function (once invoked)
 *   isLoading: boolean state indicating whether the request is in active/in flight
 *   error: any caught error resulting from the request
 *   isSuccess: once request is completed and there were no errors
 *   setValue: setter to explicitly set the result value
 *
 * The hook also accepts an optional second parameter which is a default
 * value to set as result before the first time the request is made.
 */
interface UseRequestVariables<T extends RequestTypes> {
  result: T['response']['success'];
  error: T['response']['fail'] | null;
  isLoading: boolean;
  isSuccess: boolean;
}

interface UseRequestReturn<T extends RequestTypes>
  extends UseRequestVariables<T> {
  request: (args?: T['query']) => void;
  setValue: (value: T['response']['success']) => void;
}

export const useRequest = <T extends RequestTypes>(
  makeRequest: RequestFunction<T>,
  initialValue: T['response']['success']
): UseRequestReturn<T> => {
  const [variables, setVariables] = useState<UseRequestVariables<T>>({
    result: initialValue,
    error: null,
    isLoading: false,
    isSuccess: false,
  });
  const isMounted = useIsMounted();

  return {
    ...variables,
    request: useCallback(
      async (...args) => {
        setVariables({
          ...variables,
          isSuccess: false,
          isLoading: true,
        });
        try {
          const response = await makeRequest(...args);
          if (isMounted.current) {
            setVariables({
              isLoading: false,
              result: response as T['response']['success'],
              error: null,
              isSuccess: true,
            });
          }
        } catch (e: unknown) {
          if (isMounted.current) {
            setVariables({
              isSuccess: false,
              isLoading: false,
              error: e as T['response']['fail'],
              result: initialValue,
            });
          }
        }
      },
      [makeRequest]
    ),
    setValue: (value) => setVariables({ ...variables, result: value }),
  };
};

/*
 * Provides controls for "dismissing" an error message
 *
 * Params: an error object
 * Returns: { error, dismissError }
 *   The returned error object is the same object passed in via the paremeter,
 *   until the dismissError function is called, at which point the returned
 *   error will be set to null on the subsequent render.
 */
type ErrorType = FailResponseTypes | null;

interface UseDismissableErrorReturn {
  error: ErrorType;
  dismissError: () => void;
}

export const useDismissableError = (
  error: ErrorType
): UseDismissableErrorReturn => {
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    if (error) {
      setShowError(true);
    }
  }, [error]);

  return {
    error: showError ? error : null,
    dismissError: () => {
      setShowError(false);
    },
  };
};

/*
 * Hook to assist with deletion of items from a paginated item list.
 *
 * Params: a callback function that will be invoked in order to delete items,
 *   and an object with structure { qsConfig, allItemsSelected, fetchItems }
 * Returns: { isLoading, deleteItems, deletionError, clearDeletionError }
 */

interface UseDeleteItemsReturn {
  isLoading: boolean;
  deleteItems: () => void;
  deletionError: ErrorType;
  clearDeletionError: () => void;
}

export const useDeleteItems = (
  makeRequest: () => Promise<void>
): UseDeleteItemsReturn => {
  const {
    error: requestError,
    isLoading,
    request,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
  } = useRequest(makeRequest, null);
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const { error, dismissError } = useDismissableError(requestError);

  return {
    isLoading,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    deleteItems: request,
    deletionError: error,
    clearDeletionError: dismissError,
  };
};

export default useRequest;
