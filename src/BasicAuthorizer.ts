import { Enforcer } from "casbin"
import { Request } from "hapi"

export default class BasicAuthorizer {
  enforcer: Enforcer;
  request: Request;
  constructor(request: Request, enforcer: Enforcer) {
    this.enforcer = enforcer;
    this.request = request;
  }

  // getUserName gets the user name from the request.
  // Currently, only HTTP basic authentication is supported
  getUserName(): string {
    var username: string;
    username = this.request.headers.authorization || "anonymous";

    return username;
  }

  // checkPermission checks the user/method/path combination from the request.
  // Returns true (permission granted) or false (permission forbidden)
  async checkPermission(): Promise<boolean> {
    const user = this.getUserName()
    return await this.enforcer.enforce(user, this.request.path, this.request.method);
  }
}