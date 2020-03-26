import { Enforcer } from "casbin"
import BasicAuthorizer from "./BasicAuthorizer"

var hapiauthz = {
  pkg: require("../package.json"),
  register: async function (server, options) {
    server.ext("onRequest", async function (request, h) {
      try {
        const { newEnforcer, authorizer } = options
        const enforcer = newEnforcer;

        if (!(enforcer instanceof Enforcer)) {
          throw new Error('Invalid enforcer')
        }

        const authzorizer = authorizer ? authorizer(request, enforcer) : new BasicAuthorizer(request, enforcer)
        if (!(authzorizer instanceof BasicAuthorizer)) {
          throw new Error('Please extends BasicAuthorizer class')
        }
        if (!await authzorizer.checkPermission()) {
          h.request.path = "/login";
          return h.continue;
        } else return h.continue;
      } catch (e) {
        throw (e);
      }
    });

    server.route({
      method: ["GET", "POST"],
      path: "/login",
      handler: function (request, h) {
        return "403 Forbidden";
      }
    });
  }
};

module.exports = hapiauthz;