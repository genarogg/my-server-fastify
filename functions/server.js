"use strict";

import serverless from "serverless-http";
import server from "../index";

export const handler = serverless(server);