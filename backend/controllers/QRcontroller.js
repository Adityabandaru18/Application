const database = require('../services/appwriteService');
const QRCode = require('qrcode');
const {Query} = require("appwrite");
require('dotenv').config();

const cart_QR = async(req,res)=>{

   const {Mobile} = req.body;
   try{
        let response1 = await database.listDocuments(
                process.env.DATABASE_ID,
                process.env.COLLECTION_ID_CART,
                [Query.equal("Mobile",Mobile),Query.equal("bought",false)]
            );
        let response2 = await database.listDocuments(
                process.env.DATABASE_ID,
                process.env.COLLECTION_ID_USER,
                [Query.equal("Mobile",Mobile)]
            );
        response1.documents.push(response2.documents[0]);
        console.log(response1.documents);
        const qrData = JSON.stringify(response1.documents);
        const qrCodeUrl = await QRCode.toDataURL(qrData);
        res.status(200).json({qrCodeUrl});
        } 
    
    catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Failed to generate QR. Please try again later' });
    }
}

module.exports = cart_QR;