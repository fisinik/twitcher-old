import { router, publicProcedure } from "../trpc";
import { z } from "zod";

export const birdsRouter = router({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.birds.findMany({
      include: { sightings: true, classification: true },
    });
  }),
  getOne: publicProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(({ ctx, input }) => {
      return ctx.prisma.birds.findUnique({
        where: {
          id: input.id,
        },
        include: { sightings: true, classification: true },
      });
    }),
});
