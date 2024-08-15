require('dotenv').config();
const sdk = require('node-appwrite');

const client = new sdk.Client();

client
.setEndpoint(process.env.APPWRITE_ENDPOINT)
.setProject(process.env.APPWRITE_PROJECT_ID)

const database = new sdk.Databases(client);

module.exports = database;
