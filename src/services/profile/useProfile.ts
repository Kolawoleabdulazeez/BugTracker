import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { ApiErrorResponse } from "../project/useProject";
import {
    addPortfolioItem,
    CreatePortfolioItemParam,
  deleteMyProfile,
  deletePortfolioItem,
  getMyProfile,
  getProfileByUserId,
  Profile,
  searchProfiles,
  TalentFilters,
  updatePortfolioItem,
  UpdatePortfolioItemParam,
  upsertProfile,
  UpsertProfileParam,
} from "./profile.api";
import { getApiErrorMessage } from "@/utils/lib";

const MY_PROFILE_KEY = ["my-profile"] as const;

export function useGetMyProfile() {
  return useQuery<Profile>({
    queryKey: MY_PROFILE_KEY,
    queryFn: getMyProfile,
    retry: false, // a 404 here most likely means "no profile yet"
  });
}

export function useUpsertProfile(onSuccessCallback?: () => void) {
  const queryClient = useQueryClient();

  return useMutation<Profile, AxiosError<ApiErrorResponse>, UpsertProfileParam>({
    mutationFn: upsertProfile,
    onSuccess: (data) => {
      toast.success("Profile saved");
      queryClient.setQueryData(MY_PROFILE_KEY, data);
      queryClient.invalidateQueries({ queryKey: ["talent-search"] });
      onSuccessCallback?.();
    },
    onError: (e) =>
      toast.error(e.response?.data?.details?.responseMessage || "Failed to save profile"),
  });
}

export function useDeleteMyProfile(onSuccessCallback?: () => void) {
  const queryClient = useQueryClient();

  return useMutation<void, AxiosError<ApiErrorResponse>, void>({
    mutationFn: deleteMyProfile,
    onSuccess: () => {
      toast.success("Profile deleted");
      queryClient.removeQueries({ queryKey: MY_PROFILE_KEY });
      queryClient.invalidateQueries({ queryKey: ["talent-search"] });
      onSuccessCallback?.();
    },
    onError: (e) =>
      toast.error(e.response?.data?.details?.responseMessage || "Failed to delete profile"),
  });
}

export function useSearchProfiles(filters: TalentFilters) {
  return useQuery<any>({ // eslint-disable-line @typescript-eslint/no-explicit-any
    queryKey: ["talent-search", filters],
    queryFn: () => searchProfiles(filters),
  });
}

export function useGetProfileById(targetUserId: string) {
  return useQuery<Profile>({
    queryKey: ["talent-profile", targetUserId],
    queryFn: () => getProfileByUserId(targetUserId),
    enabled: !!targetUserId,
  });
}





export function useAddPortfolioItem(onSuccessCallback?: () => void) {
  const queryClient = useQueryClient();
  return useMutation<void, AxiosError<ApiErrorResponse>, CreatePortfolioItemParam>({
    mutationFn: addPortfolioItem,
    onSuccess: () => {
      toast.success("Experience added");
      queryClient.invalidateQueries({ queryKey: MY_PROFILE_KEY });
      onSuccessCallback?.();
    },
onError: (e) => toast.error(getApiErrorMessage(e, "Failed to save profile")),
  });
}

export function useUpdatePortfolioItem(onSuccessCallback?: () => void) {
  const queryClient = useQueryClient();
  return useMutation<
    void,
    AxiosError<ApiErrorResponse>,
    { itemId: string; payload: UpdatePortfolioItemParam }
  >({
    mutationFn: ({ itemId, payload }) => updatePortfolioItem(itemId, payload),
    onSuccess: () => {
      toast.success("Experience updated");
      queryClient.invalidateQueries({ queryKey: MY_PROFILE_KEY });
      onSuccessCallback?.();
    },
onError: (e) => toast.error(getApiErrorMessage(e, "Failed to update experience")),
  });
}

export function useDeletePortfolioItem() {
  const queryClient = useQueryClient();
  return useMutation<void, AxiosError<ApiErrorResponse>, string>({
    mutationFn: deletePortfolioItem,
    onSuccess: () => {
      toast.success("Experience removed");
      queryClient.invalidateQueries({ queryKey: MY_PROFILE_KEY });
    },
onError: (e) => toast.error(getApiErrorMessage(e, "Failed to remove experience")),  });
}