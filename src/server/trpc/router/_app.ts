// src/server/trpc/router/_app.ts
import { router } from "../trpc";
import { birdRouter } from "./bird";
import { sightingRouter } from "./sighting";
import { userRouter } from "./user";

export const appRouter = router({
  bird: birdRouter,
  sighting: sightingRouter,
  user: userRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
