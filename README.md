# Setting up The Stack Worker with prisma connection Pooling and postgres using Hono;


### Install Hono use 

```
npm instal latest@hono

```

Select the wrangler and hollo world worker template.

 - Take the connection string of the postgres from your deployed DB.
 - Login with Prisma Accelarete and the prisma accelarete and the DB url and get the accerlate url.
 - npm install prisma
 - prisma init
 - Add your accelarate URL in the wrangler toml in 

 ```
 [vars]
 DATABAE_URL = ''
 
 ```
  - ADD YOUR connection string postgres sql url in env 
  - set up your schema
  - Start the Inital Migrate

  ```
  npm prisma migrate dev --name my_inital_migrate_

  ```

  Install the latest version of Prisma Client and Accelerate Prisma Client extension

```
$ npm install prisma @prisma/client@latest @prisma/extension-accelerate

```
npx prisma generate --no-engine

```
  npx prisma generate --no-engine
```


# Prisma Client is Setted up

    ```
    import { PrismaClient } from '@prisma/client/edge'
    import { withAccelerate } from '@prisma/extension-accelerate'

    const prisma = new PrismaClient().$extends(withAccelerate()) 
    ```
