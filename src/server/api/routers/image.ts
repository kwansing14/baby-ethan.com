import { z } from "zod";
import { type UploadApiResponse } from "cloudinary";
import cloudinary from "@/src/utils/cloudinary";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";

const admins = ["kwansing14@gmail.com"];

export const imageRouter = createTRPCRouter({
  getImages: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.imagesUser.findMany();
  }),
  uploadMultipleImages: protectedProcedure
    .input(
      z.object({
        imgs: z.array(
          z.object({
            imgUrl: z.string(),
            orientation: z.string(),
            folder: z.string().optional(),
          })
        ),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.session || !ctx.session.user.id) return;
      if (!admins.includes(ctx.session.user?.email || "")) return;
      // get current Month and Year
      const now = new Date();
      const year = now.getFullYear();
      const month = new Intl.DateTimeFormat("en-US", {
        month: "short",
      }).format(now);
      // store responses from cloudinary
      const multipleRes: Promise<UploadApiResponse>[] = [];
      // cloudinary api call
      input.imgs.forEach((x) => {
        const promise = cloudinary.uploader.upload(x.imgUrl, {
          resource_type: "image",
          folder: `${month} ${year}`,
        });
        multipleRes.push(promise);
      });
      const res = await Promise.all(multipleRes);
      // prisma create
      return await ctx.prisma.imagesUser.createMany({
        data: res.map((img, index) => ({
          image_url: img.secure_url,
          userId: ctx.session?.user.id,
          orientation: input.imgs[index]?.orientation || "landscape",
          folder: `${month} ${year}`,
        })),
      });
    }),
  deleteMultipleImages: protectedProcedure
    .input(z.object({ ids: z.array(z.string()) }))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.session || !ctx.session.user.id) return;
      if (!admins.includes(ctx.session.user?.email || "")) return;
      return await ctx.prisma.imagesUser.deleteMany({
        where: {
          id: {
            in: input.ids,
          },
        },
      });
    }),
});
