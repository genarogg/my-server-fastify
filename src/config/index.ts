import viewEJS from './plugin/viewEJS';
import staticFiles from './plugin/staticFiles';
import graphql from './plugin/graphql';
import caching from './plugin/caching';
import swagger from "./plugin/swagger"
import rateLimit from './plugin/rateLimit';
import helmet from './plugin/helmet';

import dbConection from './db-conection';

export {
    staticFiles,
    viewEJS,
    graphql,
    caching,
    swagger,
    rateLimit,
    helmet,
    dbConection,
}