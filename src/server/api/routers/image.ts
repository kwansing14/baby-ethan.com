import { z } from "zod";
import { type UploadApiResponse } from "cloudinary";
import cloudinary from "@/src/utils/cloudinary";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";
import { admins } from "@/src/utils/admins";

export const imageRouter = createTRPCRouter({
  getImages: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.imagesUser.findMany({
      orderBy: { lastModified: "desc" },
    });
  }),
  uploadSingleImage: protectedProcedure
    .input(
      z.object({
        lastModified: z.number(),
        imgUrl: z.string(),
        orientation: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.session || !ctx.session.user.id) return;
      if (!admins.includes(ctx.session.user?.email || "")) {
        throw new Error("You are not authorized to upload images");
      }
      // get current Month and Year
      const now = new Date();
      const year = now.getFullYear();
      const month = new Intl.DateTimeFormat("en-US", {
        month: "short",
      }).format(now);
      // run cloudinary
      const res = await cloudinary.uploader.upload(input.imgUrl, {
        resource_type: "image",
        folder: `${month} ${year}`,
      });
      // store responses from cloudinary
      return ctx.prisma.imagesUser.create({
        data: {
          lastModified: input.lastModified || 0,
          image_url: res.secure_url,
          userId: ctx.session?.user.id,
          orientation: input.orientation || "landscape",
          folder: `${month} ${year}`,
        },
      });
    }),
  uploadMultipleImages: protectedProcedure
    .input(
      z.object({
        imgs: z.array(
          z.object({
            lastModified: z.number(),
            imgUrl: z.string(),
            orientation: z.string(),
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
          lastModified: input.imgs[index]?.lastModified || 0,
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
