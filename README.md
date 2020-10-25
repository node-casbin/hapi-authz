# Hapi Authz

This is a authorization middleware for [Hapi js](https://github.com/hapijs/hapi), and it is based on [Node-Casbin](https://github.com/casbin/node-casbin).

## Installation

```shell
npm i casbin hapi-authz --save
```

## Integration

- Register the plugin inside your index.js file.
```javascript
const { newEnforcer } = require('casbin');
const hapiauthz = require('hapi-authz');

...

const init = async () => {
    ...
    const enforcer = await newEnforcer('model.conf', 'policy.csv') // replace with your model and policy file location

    await server.register({  
    plugin: hapiauthz.Hapiauthz,
    options: {
      newEnforcer: enforcer
    }

    ...
  })
}
```

## Use a customized authorizer

This package provides ``BasicAuthorizer``, which checks the Authorization header for the username.
If you want to use another authentication method like OAuth, you needs to extends ``BasicAuthorizer`` as below:

```js
class MyAuthorizer extends hapiauthz.BasicAuthorizer {
  constructor(request, enforcer) {
    super(request, enforcer);
  }

  getUserName () {
    const { username } = this.request.credentials.username
    return username
  }
}

const init = async () => {
    ...
    const enforcer = await newEnforcer('model.conf', 'policy.csv') // replace with your model and policy file location

    await server.register({  
    plugin: hapiauthz.Hapiauthz,
    options: {
      newEnforcer: enforcer,
      authorizer: (request, option) => new MyAuthorizer(request, option)
    }

    ...
  })
}
```


## How to control the access

The authorization determines a request based on ``{subject, object, action}``, which means what ``subject`` can perform what ``action`` on what ``object``. In this plugin, the meanings are:

1. ``subject``: the logged-on user name
2. ``object``: the URL path for the web resource like "dataset1/item1"
3. ``action``: HTTP method like GET, POST, PUT, DELETE, or the high-level actions you defined like "read-file", "write-blog"


For how to write authorization policy and other details, please refer to [the Casbin's documentation](https://casbin.org).

## Getting Help

- [Node-Casbin](https://github.com/casbin/node-casbin)
