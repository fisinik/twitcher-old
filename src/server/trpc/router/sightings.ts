import { router, publicProcedure } from "../trpc";
import { z } from "zod";

export const sightingsRouter = router({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.sightings.findMany();
  }),
  getOne: publicProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(({ ctx, input }) => {
      return ctx.prisma.sightings.findUnique({
        where: {
          id: input.id,
        },
      });
    }),
  addNew: publicProcedure
    .input(
      z.object({
        birdId: z.string(),
        name: z.string(),
        author: z.string(),
        description: z.string(),
        image: z.string(),
        location: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.sightings.create({
        data: {
          birdId: input.birdId,
          name: input.name,
          author: input.author,
          description: input.description,
          image: input.image,
          location: input.location,
        },
      });
    }),
});
