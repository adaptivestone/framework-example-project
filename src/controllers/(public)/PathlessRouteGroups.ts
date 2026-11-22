import AbstractController, {
  type TMiddleware,
} from '@adaptivestone/framework/modules/AbstractController.js';
import Pagination from '@adaptivestone/framework/services/http/middleware/Pagination.js';
import { HttpResponse } from '@adaptivestone/framework/services/http/responses.js';
import { z } from 'zod';
// Generated beside this controller by `npm run gen`. The physical pathless
// route-group directory remains source organization and is absent from the URL.
import type { GetRouteGroupsRequest } from './PathlessRouteGroups.routes.gen.ts';

class PathlessRouteGroups extends AbstractController {
  get routes() {
    return {
      get: {
        '/': {
          handler: this.getRouteGroups,
          middleware: [Pagination],
          // OpenAPI describes this as a date-time string while the generated
          // handler type receives the coerced Date value.
          query: z.object({ changedAfter: z.coerce.date().optional() }),
        },
      },
    };
  }

  // GET /pathlessroutegroups, not /(public)/pathlessroutegroups.
  async getRouteGroups(req: GetRouteGroupsRequest) {
    // The default memory cache works with no optional service. Applications can
    // select the Redis driver when cache entries must be shared by workers.
    const data = await req.appInfo.app.cache.getSetValue(
      'pathless-route-groups',
      async () => [{ convention: 'pathless-route-group-directories' }],
      60,
    );
    return HttpResponse.json(200, {
      data,
      pagination: req.appInfo.pagination,
      filters: {
        changedAfter: req.appInfo.query.changedAfter?.toISOString() ?? null,
      },
    });
  }

  static get middleware(): Map<string, TMiddleware> {
    return new Map([['/{*splat}', []]]);
  }
}

export default PathlessRouteGroups;
