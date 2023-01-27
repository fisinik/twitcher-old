import { router, publicProcedure } from "../trpc";

export const birdsRouter = router({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.birds.findMany();
  }),
});
