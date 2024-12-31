import fastifyStatic from "@fastify/static";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default async function (fastify, opts) {
  fastify.register(fastifyStatic, {
    root: path.join(__dirname, "../../client"),
  });
}