import { router, publicProcedure } from "../trpc";
import { z } from "zod";

export const birdRouter = router({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.bird.findMany({
      include: { sighting: true, classification: true },
    });
  }),
  getOne: publicProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(({ ctx, input }) => {
      return ctx.prisma.bird.findUnique({
        where: {
          id: input.id,
        },
        include: { sighting: true, classification: true },
      });
    }),
});
