import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { getSubscriptions } from "../../services/subscriptionService";
import {
    createUserSubscription,
    getUserSubscriptions,
    updateUserSubscription,
} from "../../services/userSubscriptionService";

// query keys
export const subscriptionKeys = {
  all: ["subscriptions"] as const,
  lists: () => [...subscriptionKeys.all, "list"] as const,
  list: () => [...subscriptionKeys.lists(), {}] as const,

  user: ["user-subscriptions"] as const,
  userList: () => [...subscriptionKeys.user, "list"] as const,
  userDetail: (id: number) => [...subscriptionKeys.user, "detail", id] as const,
};

// useSubscriptions (public packages)
export const useSubscriptions = () =>
  useQuery({
    queryKey: subscriptionKeys.list(),
    queryFn: () => getSubscriptions(),
    staleTime: 30 * 1000,
  });

// useUserSubscriptions (what the current user has)
export const useUserSubscriptions = () =>
  useQuery({
    queryKey: subscriptionKeys.userList(),
    queryFn: () => getUserSubscriptions(),
    staleTime: 30 * 1000,
  });

// create a user subscription
export const useCreateUserSubscription = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (body: { subscription_id: number }) =>
      createUserSubscription(body),

    onSuccess: () => {
      qc.invalidateQueries({ queryKey: subscriptionKeys.user });
      qc.invalidateQueries({ queryKey: subscriptionKeys.userList() });
    },
  });
};

// update a user subscription (PUT)
export const useUpdateUserSubscription = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      body,
    }: {
      id: number;
      body: { subscription_id: number };
    }) => updateUserSubscription(id, body),

    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: subscriptionKeys.user });
      qc.invalidateQueries({ queryKey: subscriptionKeys.userList() });
      qc.invalidateQueries({
        queryKey: subscriptionKeys.userDetail(variables.id),
      });
    },
  });
};

export default {
  useSubscriptions,
  useUserSubscriptions,
  useCreateUserSubscription,
  useUpdateUserSubscription,
};
