## Install git and clone the repo on the host machine

If your host machine is Windows, download and install git from here: https://git-scm.com/download/win

#### Important: Make sure that you choose the installer option to not change the line endings when checking in or out. If you clone this repo on a Windows machine and git for Windows changes the line endings you will get errors while following the instructions in this document. If you've already installed git for Windows and aren't sure if you have the correct setting, modify `.gitconfig` in your users folder and set `autocrlf=false`.

## Generate your public and private RSA key pair

Open a terminal window on the host machine and run:

```
ssh-keygen
```

- Accept the default file path (i.e. `C:\Users\your.name\.ssh`)
- Use an empty pass-phrase
- Copy the contents of the `id_rsa.pub` file as a new public SSH key in DevOps: https://dev.azure.com/gentex/_usersSettings/keys
- You can also follow these work instructions: https://confluence.gentex.com/display/SES/Azure+DevOps+Work+Instructions

## Clone the repo

Find a path on your host machine where you want the `EABackEnd` checkout folder to exist and run:

```
git clone git@ssh.dev.azure.com:v3/gentex/MFG/EABackEnd
```

## Setup Docker Development Environment

All development should be done inside a Docker container. This allows for a consistent development environment across Mac/Linux/Windows and prevents issues with needing multiple versions of Node, npm, etc...

[Install WSL2 on Windows](https://docs.microsoft.com/en-us/windows/wsl/install)

[Run Docker inside WSL2](docker/WSL2.md)

## Build and run your Docker containers

1. Open a WSL2 instance and navigate to where the EABackEnd repository was cloned on the host machine: i.e. `/mnt/c/dev/EABackEnd`
2. Make sure the Docker service is running: `sudo service docker start`
3. Run `docker-compose up -d` from the root of the project. This will build all the Docker images (if they don't already exist) and start up the Docker containers in the background.
4. Now, run `docker-compose exec dev /bin/bash -l`. This will give you a bash prompt within the main dev container along with some instructions for adding the SSH key for that container into DevOps.
5. From the bash prompt, run `project-init`. This will clone the repository and install needed dependencies in the container.
6. Copy `.env.example` to `.env`. This will define your environment variables while running and testing the app in the Docker container.
7. Run `yarn build` to build the codebase including utility scripts and generated types.
8. Run `yarn initial` to create and seed all the data into redis.
9. After remote connecting to the project in VSCode (instructions after gitconfig setup), open another terminal and run `yarn redis:load:processdata` to seed and update Mes Process Data into redis for querying statistics.

## Configure git

You will need to setup your gitconfig so that git can author your commit messages. Create a file named `gitconfig` inside `/home/dev/config/` and add the following information:

```
[core]
autocrlf = false
[user]
email = youremail@gentex.com
name = FirstName LastName
```

You can either create and edit the `gitconfig` file with [vim](https://coderwall.com/p/adv71w/basic-vim-commands-for-getting-started), or you can run these commands to do the basic setup:

```
git config --file /home/dev/config/gitconfig user.name "John Doe"
git config --file /home/dev/config/gitconfig user.email johndoe@example.com
```

## User-specific Configuration/Customizations

The `~/config` directory contains the following configuration files that can be customized:

```
bashrc
gitconfig
vimrc
```

## Connecting to the Docker Container from Visual Studio Code

- Add the [Remote Development extension pack](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.vscode-remote-extensionpack) in VSCode.
- On the left toolbar in VSCode, click on `Remote Explorer`.
- Select `WSL Targets` from the drop down at the top. Select the `Ubuntu` distro and click the Connect button. The tooltip should say `Connect To WSL`. This will open a new instance of VSCode inside the WSL2 environment. You can close your old instance of VSCode.
- Click on `Remote Explorer` in the left toolbar again. This time select `Containers` from the drop down at the top. A list should populate showing all the Docker containers running in the WSL2 environment.
- Click on the main development container, i.e. `/eabackend_dev_1`.
- Click the button on the selected container that looks like a new window icon. The tooltip should say `Attach to Container`.
- This will open a new instance of VSCode. You can close your old instance of VSCode.
- Select `Open folder...` and choose `/home/dev/app`. You now have a EABackEnd Linux development environment within a Docker container running inside WSL2 on Windows.
- If you open a terminal in VSCode, it will now give you a prompt with direct access to the dev container and the Linux filesystem.

### VSCode Extensions

- In your instance of VSCode that is connected to the container, install these required workspace extensions: `ESLint` and `Prettier`
- Recommended: Install the extension: `GitLens` for version control history to be displayed while you are editing a file
- Recommended: Install the extension `Todo Tree` so that code comments that contain `TODO` will show up in an easy to view list.
- Recommended: Install the extension `Code Spell Checker` so that you can catch your spelling mistakes. This spell checking extension is integrated with the project.
- Finally, you should personalize your VSCode environment with font and icon extensions such as `One Monokai Theme`, or `vscode-icons`.

### VSCode Settings

- Turn on automatic code formatting after a save by enabling the setting `editor.formatOnSave`. This requires an extension like `Prettier` to have been installed.
- Set `Prettier` as the default formatter under the setting `editor.defaultFormatter`
- Ensure that VSCode is using the same version of TypeScript for intellisense that is being used to compile the code. Enable the setting `typescript.enablePromptUseWorkspaceTsdk`. This will cause VSCode to prompt you to switch to use the same version of typescript for its built in language server that matches the installed npm typescript package.

## Tech Stack

This project is a single-page webapp using the following [technologies](https://dev.azure.com/gentex/gtm_core_software/_wiki/wikis/GTM-Core-Software.wiki/2568/Tech-Stack-Professional-Development.md):

- [TypeScript](https://www.typescriptlang.org) – A type-safe variant of JavaScript from Microsoft which reduces errors and improves IDE/editor support over regular JavaScript.
- [Node.js](https://nodejs.org/en/about/) – Powers our server, and is pinned to the latest LTS release.
- [Express](https://expressjs.com) – Our HTTP server, which is lightly used only to host our GraphQL API.
- [GraphQL](http://graphql.org) – An alternative to REST which supports a demand-driven architecture. Our GraphQL server is [Apollo GraphQL server](http://dev.apollodata.com/tools/graphql-server/).
- [Redis](https://redis.io) – A key/value store used for caching and pub/sub by the server. Also hosts the [Bull](https://github.com/OptimalBits/bull) job queue.
- [Webpack](https://webpack.github.io) – Builds our application for our various deployment targets.
- [Jest](http://facebook.github.io/jest/#use) - For unit testing.
- [Robot Framework](https://robotframework.org/SeleniumLibrary/#introduction) - For end to end (e2e) acceptance testing with browser automation.
- [@testing-library/react](https://testing-library.com/docs/react-testing-library/intro) - For React component testing
- [React Storybook](https://storybook.js.org/) - For component documentation, style guides, and [StoryShots](https://www.npmjs.com/package/@storybook/addon-storyshots)

## Code Organization

This repository is structured to encourage a view of the whole repository as one application. The client and server are just different entry points, and we use webpack to elide libraries and code that are irrelevant to a particular entry point.

### Directories:

- `entry` – Contains the primary entry points of the application. If you want to see what happens when you start up the client or server, start there. These are also the entry points for webpack.
- `webpack` - Contains a webpack configuration for each entry point, as well as `webpack-dev-server.js` which sets up the dev server used during development.
- `modules` - Contains all of the code. Each module is a self-contained concept that may be used by other modules, command-line scripts, etc.
- `config` - Contains configuration files for the various environments that we deploy to. Used by the [Node-config](https://www.npmjs.com/package/config) npm package. Most settings can be controlled via environment variables – see `config/default.js`.
- `dist` - Where webpack stores compiled slices of the app.

### Modules:

- `client` – React/redux front-end.
- `graphql` – Graphql schema and implementation. Depends on `records` and `db`
- `server` – Express.js server that serves the client and graphql api. Depends on `graphql`
- `helpers` – Generic helpers that can be used in any other module – no dependencies
- `atomic-object` – Core architecture, including the cache port, hexagonal library, job runner, logging and KNEX wrapper

An overview of the architecture can be found here: https://dev.azure.com/gentex/gtm_core_software/_wiki/wikis/GTM-Core-Software.wiki/2640/Architecture-Overview

### Features:

- [Text Editor](modules/client/texteditor/README.md)
- [GraphQL API](/modules/graphql-api/GraphQLAuthorization.md)
- [Undo \ Redo](modules/client/redux/undox/README.md)
- [Execution](modules/domain-services/execution-data/execution.md)
- [Web Workers](modules/client/web-workers/README.md)
- [Help Context](modules/domain-services/help-context/help-context.md)

## Environment Variables

This app is set up as a [12-factor app](https://12factor.net/), configurable via environment variables.

The [dotenv](https://www.npmjs.com/package/dotenv) npm package is used to pre-load environment variables from the `.env` file at the root of the project. These environment variables will be automatically set on the Node process that is running our server and will be available via `process.env` calls.

When deployed to [Kubernetes](https://rancherdev.gentex.com/), the environment variables are defined inside one of several `manifests/app-values.yml` files (depending on if the endpoint is `production`, `qa` or `development`) and the `secrets` are stored in [Rancher](https://rancher.com/) directly.

You can use `webpack.DefinePlugin` to put environment variables in `process.env` for use in client code running in the browser. For an example of this, see `/webpack/client.config.js`.

#### List of Environment Variables:

- `NODE_ENV` – `test`, `development`, or `production`. Defaults to `development`. Unit tests will only run if this is set to `test`. Determines which [Node-config](https://www.npmjs.com/package/config) file to load from the `/config` folder.
- `PORT` – Port for the server to bind to. Defaults to `3001`. GraphQL Subscriptions also use this port.
- `WEB_CONCURRENCY` – Number of server workers to use in clustered mode. Clustering disabled if value is 1.
- `WORKER_CONCURRENCY`- The number of jobs that can be processing simultaneous. Defaults to be the same as `WEB_CONCURRENCY`.
- `PROD_DATABASE_SERVER`, `ENG_DATABASE_SERVER` - The Microsoft SQL Server host name.
- `PROD_DATABASE_NAME`, `ENG_DATABASE_NAME` - The name of the Test Plan database on the server.
- `SVN_URL`- The Subversion server base URL, i.e. `http://vcs.gentex.com/svn/sandbox`.
- `SVN_REPO` - The name of the top level folder in the SVN repo that contains configuration data, i.e. `config-data`.
- `SMB_DOMAIN` - The network domain where the samba share lives, i.e. `gentex.com`.
- `SMB_SHARE` - The network path of a shared samba folder, i.e. `\\znas1.gentex.com\Production`.
- `SMB_VERSIONED_LIBRARY_BASEPATH` - The name of the folder on the samba share where the versioned DCIGen libraries live, i.e. `TM\Libraries`.
- `REDIS_URL` - The endpoint of the Redis server.
- `TP_LOCKOUT_TIME_MS` - The amount of time before the lockout expires when a user is editing a Test Plan.
- `AUTH_LOCAL` - When true, authentication will only require that you enter the name of an active Gentex employee.
- `APP_ENDPOINT`- The type of endpoint the app is deployed to:`dev`, `qa`, or `prod`. Note that `graphiql`is disabled on the`prod` endpoint.

## Config Files

This app uses the [Node-config](https://www.npmjs.com/package/config) npm package to manage hierarchical configurations of server deployments.

Inside the `/config` folder at the root of the project are various configuration files named after each deployment type:

- default.js
- development.js
- production.js
- test.js;

The `default.js` file contains the default settings for all deployments. The default settings can be overwritten by the deployment file that is currently in use.

The current deployment is set by the `NODE_ENV` environment variable, and the value should match one of the config filenames without a file extension, i.e. `"production"`.

Note that most of the values for the settings defined in the configuration files should come from environment variables to adhere to the principles of a [12-factor app](https://12factor.net/).

You can access configuration settings from server code in the following way:

```
const config = require("config");
const PROXY_HOST = config.get("server.apiHost");
```

Based on the value of the `NODE_ENV` environment variable, the `config` object returned by `require("config")` will contain either unique or overridden settings from the matching deployment configuration file in the `/config` folder. This is how we can configure the server to behave differently when we are developing versus when we are deployed to production.

## Development build

To do a normal development build, run `yarn build`. This will use the settings from `config/development.js`. The app will run un-optimized, but you will have access to things like breakpoints, source maps, and browser debugging tools for React and Redux.

In a development build, you control the use of local or Microsoft authentication by changing the `AUTH_LOCAL` environment variable in the `.env` file.

## Production build with Microsoft authentication

To do a production build with Microsoft authentication, run `yarn build:production` which will do the following:

```
NODE_ENV=production AUTH_LOCAL=false yarn build
```

This will build the entire app into `./dist/` and webpack will minify and chunk up the client files so that everything is as small and efficient as possible. There are also optimizations that are enabled by React, so you should see that the app runs faster and is more responsive. See `/config/production.js` for differences in the production deployment configuration.

Microsoft authentication will require you to sign in with your Gentex credentials.

```
NOTE: You will have to set the following environment variables in your .env file to the correct values in order to use Microsoft Authentication:

OAUTH_APP_ID=rancher_secret
OAUTH_APP_PASSWORD=rancher_secret
OATH_TENANT_ID=rancher_secret

Also note that if you are using the `webpack-dev-server` with hot-reloading on port 3000, you will also need to change OAUTH_REDIRECT_URI to use port 3000:
OAUTH_REDIRECT_URI=http://localhost:3000/auth/callback
```

## Production build with local authentication

To do a production build with local authentication, run `yarn build:local` which will do the following:

```
NODE_ENV=production AUTH_LOCAL=true yarn build
```

Local authentication will only require that you enter the name of a valid Gentex employee. No password is required. This mode is for development only.

## Running development builds

Run `yarn dev` to start the `webpack-dev-server`. This will enable hot-reloading of the server and client when files are modified inside the code editor:

- This will do a development build, equivalent to `yarn build`.
- The `webpack-dev-server` will run on port http://localhost:3000 and [nodemon](https://www.npmjs.com/package/nodemon) will watch for file changes. It will recompile any modified files and restart the `express server` whenever a dependency changes. The `webpack-dev-server` will then proxy requests through to the real `express server` on port 3001.
- The dev client should connect to the `webpack-dev-server` on port http://localhost:3000 to enable hot reloading of the page whenever a client file changes.
- In a development build, you control the use of local or Microsoft authentication by changing the `AUTH_LOCAL` environment variable in the `.env` file.

## Running production builds

Run `yarn server:local` or `yarn server:production` to manually start the `express server` on port http://localhost:3001 without automatic recompilation or hot-client reloading:

- This will take up far fewer system resources and is useful for those times when you don't need to modify the codebase and just want to quickly run the app.
- You will need to pair these with the matching `yarn build:production` or `yarn build:local` to properly run the app with or without local authentication.
- For convenience, you can combine the build and run steps with `yarn dev:local` or `yarn dev:production`.

## User Info API's

By default, when developing locally the app will use the `rest-endpoint` container to mock out the real API's for returning user information.

```
When using the local rest-endpoints container, the user information returned will always be for "John.Smith" and that will be who appears to be logged into the App, regardless of what name you typed in for Local Authentication or if you are using Microsoft Authentication.
```

If you are on the Gentex Corporate network, you can change your your `.env` file to point at the real REST API's:

```
MES_SECURITY_ENDPOINT=http://zvm-msgprod.gentex.com/SecurityWeb/api/v1/
MES_USER_PICTURE=https://api.gentex.com/user/image/v1/
MES_EMPLOYEE_DIRECTORY=https://api.gentex.com/employeedemo/v1/employees/
```

Note that changing these will have an effect on logging in. When using Local Authentication, the username you enter will have to be a valid gentex employee, otherwise the calls to these API's will return errors and Local Authentication will fail. When using Microsoft Authentication, your own user info will be queried.

```
NOTE: Be careful of where your DATABASE_SERVER environment variables are pointing when using REST API overrides. After a successful login, the users table in each database (PROD, ENG) will be updated (or a new user will be inserted) with the information from the REST API's provided.
```

## Redis

Our server is using [Redis](https://redis.io) to provide a variety of services:

- As an in-memory [cache](https://redis.io/topics/client-side-caching) for fast retrieval of data.
- As a [key/value](https://redis.com/nosql/key-value-databases) store for holding user data.
- As a [pub/sub](https://redis.io/topics/pubsub) service for asynchronous messaging between server and client.
- As a host for the [Bull](https://github.com/OptimalBits/bull) job runner.

If you want to connect to the local instance of Redis with a tool like `TablePlus`:

```
Host: `localhost` Port: `6379`
```

Make sure you run the `wsl_port_forwarding.py` script on the host system.

Occasionally, the Redis instances on the deployed endpoints may be need to be flushed. This could be required if the schema used to store data in Redis changes.
There should be nothing stored in Redis used for long term data retention. It should be able to be cleared without risk of breaking the app or losing process data.
Worst case scenario, after clearing Redis the data has to be re-cached resulting in longer load times in the client.
Our deployed Redis instances are configured such that the commands for deleting keys have been intentionally removed, and data is not preserved across container re-deployments.
So the only way to clear the data is to redeploy the Redis PODs in Rancher on each endpoint.

## GraphQL and Code Generation

We're generating type definitions from our graphql schema, queries, and mutations. This allows us to get static type safety between our graphql code and typescript implementations.

To enable this, we're storing all graphql code in individual `.graphql` files. Our build process and dev server look for these and use them to generate the appropriate type definitions.

### Server

The file `modules/graphql/schema-types.ts` is generated by `graphql-code-generator` from `schema.graphql` and any other `.graphql` file in the `graphql` module.

`schema-types` exports interfaces for all graphql `type`s in the schema, including e.g. `Query`.

For example, if we have the following schema:

```graphql
type User {
  id: Int!
  name: String!
  email: String!
}

type Query {
  usersById(id: Int!): [User]!
}
```

`schema-types.ts` will contain definitions for:

- `Query` – containing the return types for each query
- `UsersByIdQueryArgs` – the expected arguments for the `usersById` query
- `User` – the straightforward typescript definition for `User`.

Note that we make liberal use of `!` in the query definition to disallow `null` values as appropriate. `!` should **not** be used when the operation may fail. `Graphql` prefers `null` returns in that case in most circumstances.

To make use of these types, we import them into our `modules/graphql/index.ts` for our resolver definition.

In particular, we would define our `usersById` resolver as:

```ts
 usersById(obj: {}, args: UsersByIdQueryArgs, context: Context): Promise<Query['usersById']> {
   ...
 }
```

Note that we use `UsersByIdQueryArgs` to tell typescript that this should be consistent with the defined schema arguments. We could use an inline type or separate interface, but doing so would defeat TypeScript's ability to tell us when we change the schema that our implementation is no longer compatible.

Similarly, we define the return type to be `Promise<Query['usersById']>`. `Query['usersById']` is TypeScript syntax that means "whatever tye type of `usersById` on in the `Query` type is". By using this type subscripting syntax, we get static validation that our resolver is compatible with our schema.

### GraphQL in the client

In the client we generate types for our graphql queries and mutations.

Given a `.graphql` file containing the query:

```graphql
query Users($foo: Int!) {
  usersById(id: $foo) {
    id
    name
  }
}
```

Entries will be added to `modules/client/graphql-types.ts`:

```typescript
export interface UsersQueryVariables {
  foo: number;
}

export interface UsersQuery {
  (TBD);
  // Returns all of the users in the system (canned results)
  usersById: Array<{
    id: number;
    name: string;
  }>;
}
```

The types and query can be used with Apollo by `require`-ing the `.graphql` file directly from typescript and passing it in where a query is expected. The `UsersQuery`

```typescript
export async function fetchUsers(id: number): Promise<UsersQuery["usersById"]> {
  const vars: UsersQueryVariables = {
    foo: id,
  };
  const result = await graphqlClient.query<UsersQuery>({
    query: require("./Answer.graphql"),
    variables: vars,
  });

  return result.data.usersById;
}
```

### Graphql building

The `build:graphql` task generates all type files. It:

1.  Generates `modules/graphql/schema.json` from the `schema.graphql`. This is used by subsequent steps.
2.  Generates `schema-types.ts` in the graphql module
3.  Generates `graphql-types.ts` in the client

The `dev:graphql` task – which is run automatically by `dev` – watches for changes to any `.graphql` file and reruns `build:graphql`
