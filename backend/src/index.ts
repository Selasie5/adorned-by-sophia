import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';
import { typeDefs } from './graphql/schema';
import { resolvers } from './graphql/resolvers';
import { connectDB } from './config/database.js';
import { connectRedis } from './config/redis.js';
import { connectRabbitMQ } from './config/rabbitmq.js';
import { authenticate } from './middleware/auth.js';
import dotenv from 'dotenv';
import { createSuperAdmin } from './scripts/createSuperAdmin';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000,
//   max: 100
// });

async function startServer() {
  await connectDB();
  await connectRedis();
  await connectRabbitMQ();
  // await createSuperAdmin();

  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  await server.start();

  app.use(helmet({ contentSecurityPolicy: process.env.NODE_ENV === 'production' }));
  app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
  app.use(express.json());
  app.use(cookieParser());
  // app.use(limiter);

  app.use('/graphql', expressMiddleware(server, {
    context: async ({ req, res }) => {
      const user = await authenticate(req);
      return { user, req, res };
    },
  }));

  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}/graphql`);
  });
}

startServer().catch(console.error);
