import viewEJS from './plugin/viewEJS';
import staticFiles from './plugin/staticFiles';
import graphql from './plugin/graphql';
import caching from './plugin/caching';
import swagger from "./plugin/swagger"
import rateLimit from './plugin/rateLimit';
import helmet from './plugin/helmet';
import fastifyMetrics from './plugin/metrics';
import corsFastify from './plugin/corsFastify';
import underPressureFastify from './plugin/underPressureFastify';
import slowDownFastify from './plugin/slowDownFastify';
import compressFastify from './plugin/compressFastify';

import dbConection from './db-conection';

export {
    staticFiles,
    viewEJS,
    graphql,
    caching,
    swagger,
    rateLimit,
    helmet,
    fastifyMetrics,
    corsFastify,
    underPressureFastify,
    slowDownFastify,
    compressFastify,
    dbConection,
}