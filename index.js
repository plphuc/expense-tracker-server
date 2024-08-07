import { ApolloServer } from "@apollo/server"
import { startStandaloneServer } from "@apollo/server/standalone"
import mergedResolvers from "./resolvers/index.js"
import mergedTypeDefs from "./typeDefs/index.js"

const server = new ApolloServer({
	resolvers: mergedResolvers,
	typeDefs: mergedTypeDefs,
});
 
const { url } = await startStandaloneServer(server)
console.log(`🚀 Server ready at ${url}`)
