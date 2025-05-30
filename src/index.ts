import express from "express"
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@as-integrations/express5';


async function init() {
    const app = express();
    app.use(express.json());
    // Create GraphQL Server
    const gqlServer = new ApolloServer({
        typeDefs: `
          type Query {
            hello: String
            say(name: String): String
          }
        `, // Schema layer
        resolvers: {
            Query: {
                hello: () => `Hey there, I am a graphql server`,
                say: (_, {name}: {name: string}) => `Hey ${name}, How are you?`
            },
        }       // Query and Mutation layer 
    })

    // Start the gql server
    await gqlServer.start();


    const PORT = process.env.PORT || 8000;

    app.get("/", (req, res) => {
        res.json({ message: "Server is up and running"})
    })

    app.use(
        '/graphql',
        expressMiddleware(gqlServer, {
        context: async ({ req }) => ({ token: req.headers.token }),
        })
    );

    app.listen(PORT, () => console.log(`Server started at PORT:${PORT}`))

    
}

init();

