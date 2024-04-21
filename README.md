# Traffic Monitoring and Weather Forecast

A monorepo containing all library packages, rest-ful API backend server, website implementations.

Project is bootstrapped by using [`create-turbo`](https://turbo.build/) cli.

```sh
npx create-turbo@latest
```

## Current State

As of this document is first written, the project includes two main applications

- REST API server (NestJS)
- Website (NextJS, 100% client side rendering)

### Develop

#### Prerequisites in your machine

- `os` - should not matter, only tested on ARM based MacOS
- `node` - >= version 18
- `docker` - docker runtime
- `pnpm` - as package manager, `npm` might work with glitches

#### Quick Start

```sh
# any your working dir
git clone git@github.com:ivan-zynesis/weather-and-traffic.git

cd weather-and-traffic
pnpm install

# start a postgres server
docker-compose -f ./apps/postgres/docker-compose.yml up -d

pnpm dev

# shortly
# REST API server listening to localhost:3001
# website server listening to localhost:3000
```

### Production Build & Deployment

TODO

### Generate Swagger Axios Client

With `dev` server running in local, run following command to pull the swagger doc and generate a strongly-typed Axios client.

```sh
swagger-codegen generate -i http://localhost:3001/swagger-json -l typescript-axios -o packages/generated-api-client
```

The generated client package will be updated, fix the overwritten package name in `/packages/generated-api-client/package.json`
back to `@repo/generated-api-client`. Run the `build` script (in the same package.json file), the client SDK is now ready
for install in the workspace.

### Database

By default (see `./apps/postgres/docker-compose.yml`), the postgres container is using a static volume attached to FS
within /apps/postgres. The container is being used for run tests, generate migration script and serve as localhost app
postgres server. Change the volume's directory to have isolated instance or delete it to create a fresh copy.

```sh
rm -rf ./apps/api/postgres/postgres-data
```

#### Migration Script Generation

0. With postgres container running

```sh
# <rootdir>
➜ <rootdir> docker-compose -f ./apps/postgres/docker-compose.yml up -d
```

1. make desired changes to database entities.
2. (optional) add newly created entity to `/apps/api/src/database/data-source.ts` if any.
3. Execute typeorm cli generate script

```sh
# <rootdir>/apps/api
➜ pnpm run migration:generate ./src/database/migrations/<NewMigrationFileNameHere>
```

4. Include generated migration into `/apps/api/src/database/migrations/index.ts`

```typescript
export const migrations = [...existings, NewGeneratedMigration.ts];
```
