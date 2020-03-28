const Hapi = require("@hapi/hapi");
import { newEnforcer } from "casbin";
import * as Lab from '@hapi/lab';
import { expect } from '@hapi/code';
import { Hapiauthz, BasicAuthorizer } from ".."

const lab = Lab.script();
const { describe, it, before } = lab;
export { lab };

class MyAuthorizer extends BasicAuthorizer {
  constructor(request, enforcer) {
    super(request, enforcer);
  }

  getUserName () {
    return "alice1"
  }
}

describe("Basic authentication", () => {
  it("returns a reply on successful auth", async () => {
    const server = Hapi.server();
    const enforcer = await newEnforcer('examples/model.conf', 'examples/policy.csv')

    await server.register({
      plugin: Hapiauthz,
      options: {
        newEnforcer: enforcer
      }
    });

    server.route({
      method: "GET",
      path: "/",
      handler: function(request, h) {
        return "ok";
      }
    });

    const request = {
      method: "GET",
      url: "/",
      headers: { authorization: "alice" }
    };
    const res = await server.inject(request);

    expect(res.result).to.equal("ok");
  });

  it("returns a reply on unsuccessful auth", async () => {
    const server = Hapi.server();
    const enforcer = await newEnforcer('examples/model.conf', 'examples/policy.csv')

    await server.register({
      plugin: Hapiauthz,
      options: {
        newEnforcer: enforcer,
        authorizer: (request, enforcer) => new MyAuthorizer(request, enforcer)
      }
    });

    server.route({
      method: "GET",
      path: "/",
      handler: function(request, h) {
        return "ok";
      }
    });

    const request = {
      method: "GET",
      url: "/"
    };
    const res = await server.inject(request);

    expect(res.result).to.equal("403 Forbidden");
  });

  it("returns a reply for anonymous", async () => {
    const server = Hapi.server();
    const enforcer = await newEnforcer('examples/model.conf', 'examples/policy.csv')

    await server.register({
      plugin: Hapiauthz,
      options: {
        newEnforcer: enforcer
      }
    });

    server.route({
      method: "GET",
      path: "/",
      handler: function(request, h) {
        return "ok";
      }
    });

    const request = {
      method: "GET",
      url: "/"
    };
    const res = await server.inject(request);

    expect(res.result).to.equal("403 Forbidden");
  });
});
