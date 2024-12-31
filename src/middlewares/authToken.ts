// authTokenMiddleware.ts
import { Hono } from 'hono';
import { verify } from 'hono/jwt';
import { createMiddleware } from 'hono/factory';


export const authToken = createMiddleware<{
    Bindings: {
        JWT_KEY: string;
    };
    //variable we need to set the when we do c.set() --> set the types here tp avoid type error in c.get()
    Variables: {
        user: {
            id: string,
            name: string,
            email: string
        };
    };
}>(
    async (c, next: () => Promise<void>) => {
        const authHeader = c.req.header('Authorization');

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return c.json({ error: 'Unauthorized' }, 401);
        }

        const token = authHeader.substring(7);

        if (!token) {
            return c.json({
                success: false,
                message: 'Token not found',
            });
        }

        try {
            const decodedObj = await verify(token, c.env.JWT_KEY);
            const userid = decodedObj as {
                id: string,
                name: string,
                email: string
            }
            c.set('user', userid);
            await next();
        } catch (e) {
            return c.json({
                success: false,
                error: e,
                message: 'Unexpected error occurred while verifying the token.',
            }, 403);
        }
    }
);

export default authToken;
