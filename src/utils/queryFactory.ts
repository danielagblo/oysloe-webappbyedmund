import { useQuery, useMutation } from "@tanstack/react-query";

/**
 * Creates a useQuery hook for any GET service function.
 * The hook accepts exactly the same arguments as the service function.
 */
export function createQueryHook<TArgs extends unknown[], TData>(
  key: string,
  fn: (...args: TArgs) => Promise<TData>
) {
  return (...args: TArgs) =>
    useQuery<TData>({
      queryKey: [key, ...args],
      queryFn: () => fn(...args),
    });
}

/**
 * Creates a useMutation hook for POST/PUT/PATCH/DELETE service functions.
 * Returned mutationFn automatically forwards all arguments correctly.
 */
export function createMutationHook<TVars, TData>(
  key: string,
  fn: (vars: TVars) => Promise<TData>
) {
  return () =>
    useMutation<TData, unknown, TVars>({
      mutationKey: [key],
      mutationFn: fn,
    });
}
