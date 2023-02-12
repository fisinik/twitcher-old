import { router, publicProcedure } from "../trpc";
import { z } from "zod";

export const sightingRouter = router({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.sighting.findMany();
  }),
  getOne: publicProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(({ ctx, input }) => {
      return ctx.prisma.sighting.findUnique({
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
      return ctx.prisma.sighting.create({
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
  getUserSightings: publicProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(({ ctx, input }) => {
      return ctx.prisma.sighting.findMany({
        where: {
          author: input.id,
        },
      });
    }),
  getBirdSightings: publicProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(({ ctx, input }) => {
      return ctx.prisma.sighting.findMany({
        where: {
          birdId: input.id,
        },
      });
    }),
  createSightingComment: publicProcedure
    .input(
      z.object({
        sightingId: z.string(),
        author: z.string(),
        comment: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.sightingComment.create({
        data: {
          sightingId: input.sightingId,
          author: input.author,
          comment: input.comment,
        },
      });
    }),
  getSightingComments: publicProcedure
    .input(
      z.object({
        sightingId: z.string(),
      })
    )
    .query(({ ctx, input }) => {
      return ctx.prisma.sightingComment.findMany({
        where: {
          sightingId: input.sightingId,
        },
      });
    }),
  getUserLikes: publicProcedure
    .input(
      z.object({
        author: z.string(),
      })
    )
    .query(({ ctx, input }) => {
      return ctx.prisma.sightingLike.findMany({
        where: {
          author: input.author,
        },
      });
    }),
  likeSighting: publicProcedure
    .input(
      z.object({
        sightingId: z.string(),
        author: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.sightingLike.create({
        data: {
          sightingId: input.sightingId,
          author: input.author,
        },
      });
    }),
  unlikeSighting: publicProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.sightingLike.delete({
        where: {
          id: input.id,
        },
      });
    }),
  getSightingLikes: publicProcedure
    .input(
      z.object({
        sightingId: z.string(),
      })
    )
    .query(({ ctx, input }) => {
      return ctx.prisma.sightingLike.findMany({
        where: {
          sightingId: input.sightingId,
        },
      });
    }),
});
