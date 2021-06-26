const mongodbUser = process.env.MONGODB_USER;
const mongodbPassword = process.env.MONGODB_PASSWORD;
const mongodbCluster = process.env.MONGODB_CLUSTER;
const mongodbSchema = process.env.MONGODB_SCHEMA;

const mongodbUri = `mongodb+srv://${mongodbUser}:${mongodbPassword}@${mongodbCluster}.dstz0.mongodb.net/${mongodbSchema}?retryWrites=true&w=majority`;

module.exports = {
    MongoURI: mongodbUri
}