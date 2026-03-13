import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AuthData, AuthResponse, login, loginParams, signup, SignupParams } from "./auth.api";
import { AuthPage } from "@/pages/Login";
import { useRouter } from "next/router";
import { authKeys } from "./auth.key";

export function useSignup(setAuthPage: (page: any) => void) {
  return useMutation<any, any, SignupParams>({
    mutationFn: signup,
    onSuccess: () =>{
        setAuthPage(AuthPage.Login)
    }
  });
}

export function useLogin() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation<AuthResponse, any, loginParams>({
    mutationFn: login,
    onSuccess: (response) => {
      queryClient.setQueryData(authKeys.me, response.data);
      router.push("/Dashboard");
    },
  });
}

export function useAuthUser() {
  const queryClient = useQueryClient();

  return useQuery<AuthData | null>({
    queryKey: authKeys.me,
    queryFn: async () => {
      return queryClient.getQueryData<AuthData>(authKeys.me) ?? null;
    },
    initialData: () => {
      return queryClient.getQueryData<AuthData>(authKeys.me) ?? null;
    },
    staleTime: Infinity,
  });
}
