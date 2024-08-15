const database = require('../services/appwriteService');
const { Query } = require("appwrite");
require('dotenv').config();

const authenticateUser = async (req, res, next) => {
    const { Mobile } = req.body;

    if (!Mobile) {
        return res.status(400).json({ error: 'Mobile number is required for authentication' });
    }

    try {
        let response = await database.listDocuments(
            process.env.DATABASE_ID,
            process.env.COLLECTION_ID_USER,
            [Query.equal("Mobile", Mobile)]
        );

        if (response.total === 0) {
            return res.status(401).json({ error: 'Unauthorized: User not found' });
        }
        next();
    } catch (error) {
        console.error('Error in authentication middleware:', error);
        res.status(500).json({ error: 'Internal server error during authentication' });
    }
};

module.exports = authenticateUser;
