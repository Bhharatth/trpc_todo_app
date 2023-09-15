import { Todo, User } from './db';
import { router } from './trpc';
import { createHTTPServer } from '@trpc/server/adapters/standalone';
import cors from "cors";
import jwt from "jsonwebtoken";
import { userRouter } from './routers/user';
import { todoRouter } from './routers/todo';
import mongoose ,{mongo} from 'mongoose';
export const SECRET = "secret";

mongoose.connect('mongodb+srv://bharath:12345@todo.tsdegdt.mongodb.net/?retryWrites=true&w=majority',{dbName:"todo"})

const appRouter = router({
    user: userRouter,
    todo: todoRouter
});

// Export type router type signature,
// NOT the router itself.
export type AppRouter = typeof appRouter;
const server = createHTTPServer({
    router: appRouter,
    middleware: cors(),
    createContext(opts) {
        let authHeader = opts.req.headers["authorization"];

          if (authHeader) {
            const token = authHeader.split(' ')[1];
            console.log(token);
            return new Promise<{db: {Todo: typeof Todo, User: typeof User}, userId?: string}>((resolve) => {
                jwt.verify(token, SECRET, (err, user) => {
                    if (user) {
                        const userId = (user as {userId : string}).userId;
                        resolve({userId, db: {Todo, User}});
                    } else {
                        resolve({db: {Todo, User}});
                    }
                });
            })
        }

        return {
            db: { Todo, User },
        }
    }

});

server.listen(3000);



