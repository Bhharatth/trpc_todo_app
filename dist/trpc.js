"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.middleware = exports.publicProcedure = exports.router = void 0;
const server_1 = require("@trpc/server");
/**
 * Initialization of tRPC backend
 * Should be done only once per backend!
 */
// const t = initTRPC.context<{db: {Todo: typeof Todo, User: typeof User};userId?: string;}>().create();
const t = server_1.initTRPC.context().create();
/**
 * Export reusable router and procedure helpers
 * that can be used throughout the router
 */
exports.router = t.router;
exports.publicProcedure = t.procedure;
exports.middleware = t.middleware;
