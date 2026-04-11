import { useFirstTimeOpen } from "@/hooks/useFirstTimeOpen";
import { Redirect } from "expo-router";
import React from "react";

const AuthenticatedRoute = ({ children }: React.PropsWithChildren) => {
  const { isFirstTime, isLoading } = useFirstTimeOpen();

  if (isLoading) return null;

  if (isFirstTime) {
    return <Redirect href={"/onboarding"} />;
  }

  return <>{children}</>;
};

export default AuthenticatedRoute;
