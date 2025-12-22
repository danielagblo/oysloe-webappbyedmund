import type { UseMutationResult } from "@tanstack/react-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createAccountDeleteRequest } from "../../services/accountDeleteRequestService";
import type { AccountDeleteRequest } from "../../types/AccountDeleteRequest";

const QUERY_KEYS = {
  accountDeleteRequests: ["accountDeleteRequests"] as const,
  profile: ["userProfile"] as const,
};

export default function useAccountDeleteRequest() {
  const qc = useQueryClient();

  const mutation = useMutation<
    AccountDeleteRequest,
    Error,
    { reason: string },
    unknown
  >({
    mutationFn: (variables: { reason: string }) =>
      createAccountDeleteRequest(variables),
    onSuccess: () => {
      // invalidate cached account-delete-requests and user profile
      qc.invalidateQueries({ queryKey: QUERY_KEYS.accountDeleteRequests });
      qc.invalidateQueries({ queryKey: QUERY_KEYS.profile });
    },
  });

  const { mutateAsync, isPending, isError, error, data } =
    mutation as UseMutationResult<
      AccountDeleteRequest,
      Error,
      { reason: string },
      unknown
    >;

  return {
    create: mutateAsync,
    isPending,
    isError,
    error,
    data,
  };
}
