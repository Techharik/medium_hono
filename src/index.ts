import { Hono } from 'hono'
import BlogRoutes from './routes/blogRoutes'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { sign } from 'hono/jwt'

const app = new Hono<{
  Bindings: {
    DATABASE_URL: string,
    JWT_KEY: string
  }
}>()

app.post('/api/v1/signup', async (c) => {

  const prisma = new PrismaClient({ datasourceUrl: c.env.DATABASE_URL }).$extends(withAccelerate())

  const body = await c.req.json();
  try {

    const email = body.email;

    const findUser = await prisma.user.findUnique({
      where: {
        email: email
      }
    })

    if (findUser) {
      return c.json({
        success: false,
        error: 'USER_ALREADY_EXITS',
        message: 'User is Registered'
      }, 400)
    }


    let response = await prisma.user.create({
      data: {
        name: body.name,
        password: body.password,
        email: body.email
      },
      select: {
        id: true,
        email: true,
        name: true,
      },
    })

    const payload = {
      ...response,
      exp: Math.floor(Date.now() / 1000) + 60 * 60,

    }
    const token: string = await sign(payload, c.env.JWT_KEY)


    return c.json({
      success: true,
      message: 'Request successful',
      data: response,
      token
    }, 200);


  } catch (e) {
    return c.json({
      success: false,
      error: e,
      message: 'Failed User creations'
    }, 400)
  }

});


app.post('/api/v1/signin', async (c) => {
  const prisma = new PrismaClient({ datasourceUrl: c.env.DATABASE_URL }).$extends(withAccelerate());

  const body = await c.req.json();

  const findUser = await prisma.user.findUnique({
    where: {
      email: body.email,
    },
    select: {
      email: true,
      id: true,
      name: true
    }
  })

  if (!findUser) {
    return c.json({
      success: false,
      message: 'user not found , Regester'
    }, 400)
  }

  try {
    const payload: {
      name: string | null,
      exp: number,
      email: string,
      id: string
    } = {
      ...findUser,
      exp: Math.floor(Date.now() / 1000) + 60 * 60,
    }


    const token = await sign(payload, c.env.JWT_KEY);

    return c.json({
      success: true,
      message: 'user loggedIn successfully',
      token: token
    })
  } catch (e) {

    return c.json({
      success: false,
      error: e,
      message: 'Failed Logged In REQUEST',
    }, 400)
  }


});












app.route('/api/v1/m', BlogRoutes)
app.notFound((c) => c.text('Not Found', 404));

export default app
