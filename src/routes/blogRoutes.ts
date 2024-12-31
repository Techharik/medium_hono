import { Hono } from "hono";
import { authToken } from "../middlewares/authToken";
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { blogInInput, blogInInputUpdate } from '@pattari/medium-types'


const app = new Hono<{
    Bindings: {
        DATABASE_URL: string,
        // JWT_KEY: string
    }
}>()

app.get('/userprofile', authToken, async (c) => {
    const prisma = new PrismaClient({ datasourceUrl: c.env.DATABASE_URL }).$extends(withAccelerate());
    const loggedUser = c.get('user');

    const findUser = await prisma.user.findUnique({
        where: {
            id: loggedUser.id
        },
        select: {
            email: true,
            name: true
        }
    })

    return c.json({
        succes: false,
        data: findUser,
        message: 'User profiled fetched successfully'
    })
})


app.post('/blog', authToken, async (c) => {
    const prisma = new PrismaClient({ datasourceUrl: c.env.DATABASE_URL }).$extends(withAccelerate());
    const loggedInId = c.get('user');
    const body = await c.req.json();

    const { success, error } = blogInInput.safeParse(body);

    if (!success) {
        return c.json({
            success: false,
            error: error,
            message: 'validation failed'
        }, 400)
    }


    try {

        const response = await prisma.blog.create({
            data: {
                title: body.title,
                content: body.content,
                authorId: loggedInId.id
            }
        })

        return c.json({
            success: true,
            data: response,
            message: 'Blog added successfully'
        }, 200)
    } catch (e) {
        return c.json({
            success: false,
            error: e,
            message: 'Blog adding failed ',
        }, 400)
    }
})

app.put('/blog/:id', authToken, async (c) => {
    const prisma = new PrismaClient({ datasourceUrl: c.env.DATABASE_URL }).$extends(withAccelerate());
    const id = c.req.param('id');
    const body = await c.req.json();
    const { success, error } = blogInInputUpdate.safeParse(body);

    if (!success) {
        return c.json({
            success: false,
            error: error,
            message: 'validation failed'
        }, 400)
    }
    try {

        const fetchBlog = await prisma.blog.update({
            data: {
                ...body
            },
            where: {
                id: id
            }
        });


        return c.json({
            success: true,
            data: fetchBlog,
            message: 'Updated Blog Successflly ',
        }, 200)
    } catch (e) {
        return c.json({
            success: false,
            error: e,
            message: 'Update Faield',
        }, 400)
    }


})

app.get('/blog', async (c) => {
    const prisma = new PrismaClient({ datasourceUrl: c.env.DATABASE_URL }).$extends(withAccelerate());


    const fetchBlog = await prisma.blog.findMany();

    return c.json({
        success: true,
        data: fetchBlog,
        message: 'Detail View of the blog',
    }, 200);

})


app.get('/blog/:id', async (c) => {
    const prisma = new PrismaClient({ datasourceUrl: c.env.DATABASE_URL }).$extends(withAccelerate());
    const id = c.req.param('id');

    const fetchBlog = await prisma.blog.findUnique({
        where: {
            id: id
        }
    })

    if (!fetchBlog) {
        return c.json({
            success: false,
            message: 'Blog not exits',
        }, 400)
    }

    return c.json({
        success: true,
        data: fetchBlog,
        message: 'Detail View of the blog',
    }, 200)
})


export default app;