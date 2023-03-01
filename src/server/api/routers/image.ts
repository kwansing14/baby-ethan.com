import { z } from "zod";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";
import cloudinary from "@/src/utils/cloudinary";

export const imageRouter = createTRPCRouter({
  getImages: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.imagesUser.findMany();
  }),
  uploadImg: protectedProcedure
    .input(z.object({ img: z.string(), orientation: z.string() }))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.session || !ctx.session.user.id) return;
      const res = await cloudinary.uploader.upload(input.img, {
        resource_type: "image",
        folder: "test",
      });
      return await ctx.prisma.imagesUser.create({
        data: {
          image_url: res.secure_url,
          userId: ctx.session?.user.id,
          orientation: input.orientation,
        },
      });
    }),
});
