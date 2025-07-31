import { MongoClient } from "mongodb"

if (!process.env.MONGODB_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"')
}

const uri = process.env.MONGODB_URI
const options = {
  maxPoolSize: 10, // Maintain up to 10 socket connections
  serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
  socketTimeoutMS: 45000 // Close sockets after 45 seconds of inactivity
}

let client
let clientPromise

if (process.env.NODE_ENV === "development") {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options)
    global._mongoClientPromise = client.connect()
    
    // Add connection event listeners
    client.on('serverOpening', () => {
      console.log('🚀 MongoDB connection established')
    })
    
    client.on('serverClosed', () => {
      console.log('❌ MongoDB connection closed')
    })
    
    client.on('error', (error) => {
      console.error('❌ MongoDB connection error:', error)
    })
  }
  clientPromise = global._mongoClientPromise
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri, options)
  clientPromise = client.connect()
}

// Export a promise that resolves to the MongoDB client
export default clientPromise

// Helper function to get database
export async function getDatabase(dbName = 'crm') {
  try {
    const client = await clientPromise
    return client.db(dbName)
  } catch (error) {
    console.error('Failed to connect to database:', error)
    throw error
  }
}

// Helper function to test connection
export async function testConnection() {
  try {
    const client = await clientPromise
    await client.db('admin').command({ ping: 1 })
    console.log('✅ MongoDB connection test successful')
    return true
  } catch (error) {
    console.error('❌ MongoDB connection test failed:', error)
    return false
  }
}
