// src/server/trpc/router/_app.ts
import { router } from "../trpc";
import { birdsRouter } from "./birds";

export const appRouter = router({
  birds: birdsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
