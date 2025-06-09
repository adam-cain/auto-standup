// Re-export NextAuth configuration for server-side use
export { providerMap, handlers, signOut, auth } from "./config"

// Re-export server actions for client-side use
export { signUp, loginUser } from "./actions" 
