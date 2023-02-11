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
  getFavorites: publicProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(({ ctx, input }) => {
      return ctx.prisma.birdFavorite.findMany({
        where: {
          birdId: input.id,
        },
      });
    }),
  getUserFavorites: publicProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(({ ctx, input }) => {
      return ctx.prisma.birdFavorite.findMany({
        where: {
          author: input.id,
        },
      });
    }),
  makeFavorite: publicProcedure
    .input(
      z.object({
        birdId: z.string(),
        author: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.birdFavorite.create({
        data: {
          birdId: input.birdId,
          author: input.author,
        },
      });
    }),
  removeFavorite: publicProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.birdFavorite.delete({
        where: {
          id: input.id,
        },
      });
    }),
});
