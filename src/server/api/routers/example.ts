import { z } from "zod";
import cloudinary from "../../../utils/cloudinary";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";

export const exampleRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.example.findMany();
  }),

  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),
  uploadImg: publicProcedure
    .input(
      z.object({
        img: z.string(),
      })
      // z.object({
      //   img: z.object({
      //     originalname: z.string(),
      //     buffer: z.string(),
      //   }),
      // })
    )
    .mutation(async ({ input }) => {
      try {
        const res = await cloudinary.uploader.upload(input.img, {
          resource_type: "image",
          folder: "test",
        });
        console.log(res);
        // store
        // url https://res.cloudinary.com/dnvld29ir/image/upload/v1676028808/bkmsuhrp4dvjs1inhio1.png
        // store.public_id is bkmsuhrp4dvjs1inhio1
        // store.version is 1676028808

        // res example
        /* {
              asset_id: '79037d1dfab825b47237447295e078c9',
              public_id: 'test/pheqhjxap9h5dm8urot7',
              version: 1676261961,
              version_id: '797d41323ab382b80a7fa461ac3b4c6c',
              signature: '061941004262ca0d867ee78a34ae50995137744a',
              width: 354,
              height: 354,
              format: 'png',
              resource_type: 'image',
              created_at: '2023-02-13T04:19:21Z',
              tags: [],
              bytes: 228587,
              type: 'upload',
              etag: 'c3efd7671a0a777724586fcc505d3eaf',
              placeholder: false,
              url: 'http://res.cloudinary.com/dnvld29ir/image/upload/v1676261961/test/pheqhjxap9h5dm8urot7.png',
              secure_url: 'https://res.cloudinary.com/dnvld29ir/image/upload/v1676261961/test/pheqhjxap9h5dm8urot7.png',
              folder: 'test',
              api_key: '881573527383675'
            }
          */
         // save image to db
        return;
      } catch (e) {
        console.log(e);
      }
    }),
});
