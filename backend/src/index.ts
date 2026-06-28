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

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

app.use(cors());
app.use(express.json());

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
