import express from 'express';
import cors from 'cors';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import rateLimit from 'express-rate-limit';
import { typeDefs } from './schema';
import { resolvers } from './resolvers';
import NodeCache from 'node-cache';

const app = express();
const cache = new NodeCache({ stdTTL: 100, checkperiod: 120 });

app.use(cors());
app.use(express.json());

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 500, // Increased limit to prevent issues during dev
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

async function start() {
  await server.start();
  app.use('/graphql', expressMiddleware(server));

  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/graphql`);
  });
}

start();
