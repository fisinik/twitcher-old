// src/server/trpc/router/_app.ts
import { router } from "../trpc";
import { birdsRouter } from "./birds";
import { sightingsRouter } from "./sightings";
import { userRouter } from "./user";

export const appRouter = router({
  birds: birdsRouter,
  sightings: sightingsRouter,
  user: userRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
