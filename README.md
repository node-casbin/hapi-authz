# Hapi Authz

[![NPM version][npm-image]][npm-url]
[![NPM download][download-image]][download-url]
[![codebeat badge](https://codebeat.co/badges/45934fbd-c678-4164-a05a-6098b0c96250)](https://codebeat.co/projects/github-com-node-casbin-hapi-authz-master)
[![Build Status](https://travis-ci.org/node-casbin/hapi-authz.svg?branch=master)](https://travis-ci.org/github/node-casbin/hapi-authz)
[![Release](https://img.shields.io/github/release/node-casbin/hapi-authz.svg)](https://github.com/node-casbin/hapi-authz/releases/latest)
[![Discord](https://img.shields.io/discord/1022748306096537660?logo=discord&label=discord&color=5865F2)](https://discord.gg/S5UjpzGZjN)

[npm-image]: https://img.shields.io/npm/v/@casbin/hapi-authz.svg?style=flat-square
[npm-url]: https://npmjs.org/package/@casbin/hapi-authz
[download-image]: https://img.shields.io/npm/dm/@casbin/hapi-authz.svg?style=flat-square
[download-url]: https://www.npmjs.com/package/@casbin/hapi-authz

This is a authorization middleware for [Hapi js](https://github.com/hapijs/hapi), and it is based on [Node-Casbin](https://github.com/casbin/node-casbin).

## Installation

```shell
npm i casbin @casbin/hapi-authz --save
```

## Integration

- Register the plugin inside your index.js file.
```javascript
const { newEnforcer } = require('casbin');
const hapiauthz = require('@casbin/hapi-authz');

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
