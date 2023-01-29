// src/server/trpc/router/_app.ts
import { router } from "../trpc";
import { birdsRouter } from "./birds";
import { sightingsRouter } from "./sightings";

export const appRouter = router({
  birds: birdsRouter,
  sightings: sightingsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
