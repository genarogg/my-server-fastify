import serverless from "serverless-http";
import server from "../index";

//@ts-ignore
export const handler = serverless(server);