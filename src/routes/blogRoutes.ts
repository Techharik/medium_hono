import { Hono } from "hono";

const app = new Hono();


app.post('/blog', (c) => {
    return c.json('Hello Hono!')
})

app.put('/blog', (c) => {
    return c.json('Hello Hono!')
})

app.get('/blog', (c) => {
    return c.json('Hello Hono!')
})


app.get('/blog/:id', (c) => {
    return c.json('Hello Hono!')
})


export default app;