import { Hono } from "hono";
import { authToken } from "../middlewares/authToken";


const app = new Hono<{
    Bindings: {
        DATABASE_URL: string,
        JWT_KEY: string
    }
}>()

app.post('/blog', (c) => {
    return c.json('Hello Hono!')
})

app.put('/blog', authToken, (c) => {
    return c.json('Hello Hono!')
})

app.get('/blog', (c) => {
    return c.json('Hello Hono!')
})


app.get('/blog/:id', authToken, async (c) => {
    const loggedInUser = c.get('user'); // Retrieve the user from the context

    return c.json(loggedInUser)
})


export default app;