import { useMemo } from "react";
import { useSession, signIn, signOut } from "next-auth/react";

export const useAuth = () => {
  const { data: session, status } = useSession();
  const isAuthed = useMemo(() => status === "authenticated", [status]);

  return useMemo(
    () =>
      ({
        session,
        isAuthed,
        signIn,
        signOut,
      } as const),
    [session, isAuthed]
  );
};
