const database = require('../services/appwriteService');
const client = require("../services/twilioservice.js");
const {Query} = require("appwrite");
require('dotenv').config();

//done
const Generate_otp = async (req, res) => {
    const { phoneNumber } = req.body;
  
    try {

       const serviceId = process.env.SERVICE_SID;
      const otpResponse = await client.verify.v2
        .services(serviceId)
        .verifications.create({ to: phoneNumber, channel: 'sms' });
  
      res.status(200).json({ message: 'OTP sent successfully!', data: otpResponse });
    } catch (error) {
      res.status(500).json({ message: 'Failed to send OTP', error });
    }
  };

//done
const Verify_otp = async (req, res) => {
    const { Mobile, code, Name } = req.body;
  
    try {
      const serviceId = process.env.SERVICE_SID;
      const verificationResponse = await client.verify.v2
        .services(serviceId)
        .verificationChecks.create({ to: Mobile, code });
  
      if (verificationResponse.status === 'approved') {
        await database.createDocument(
            process.env.DATABASE_ID,
            process.env.COLLECTION_ID_USER,
            'unique()',
            {
                Mobile,
                Name
            }
        );
        res.status(200).json({ message: 'OTP verified successfully!' });
      } else {
        res.status(400).json({ message: 'Invalid OTP' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Failed to verify OTP', error });
    }
  };


const Getall = async (req, res) => {
    try {
        let response = await database.listDocuments(
            process.env.DATABASE_ID,
            process.env.COLLECTION_ID_CART
        );
        console.log(response);
        res.status(200).json(response);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'An error occurred while fetching documents' });
    }
};


//done
const Getcart = async (req, res) => {
    const {Mobile} = req.body;
    try {
        let response = await database.listDocuments(
            process.env.DATABASE_ID,
            process.env.COLLECTION_ID_CART,
            [Query.equal("Mobile",Mobile),Query.equal("bought",false)]
        );
        console.log(response);
        res.status(200).json(response);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'An error occurred while fetching documents' });
    }
};

//done
// const Getorders = async (req, res) => {
//     const uuid = req.params.id;
//     try {
//         let response = await database.listDocuments(
//             process.env.DATABASE_ID,
//             process.env.COLLECTION_ID_CART,
//             [Query.equal("uuid",uuid),Query.equal("bought",true)]
//         );
//         console.log(response);
//         res.status(200).json(response);
//     } catch (error) {
//         console.log(error);
//         res.status(500).json({ error: 'An error occurred while fetching documents' });
//     }
// };

//done
// const Updatecart = async (req, res) => {
//     const { uuid } = req.body;

//     try {
//         const documents = await database.listDocuments(process.env.DATABASE_ID, process.env.COLLECTION_ID_CART);
//         const matchingDocuments = documents.documents.filter(doc => doc.uuid === uuid);

//         if (matchingDocuments.length === 0) {
//             return res.status(404).json({ error: 'No documents found with the specified UUID' });
//         }

//         for (const doc of matchingDocuments) {
//             await database.updateDocument(
//                 process.env.DATABASE_ID,
//                 process.env.COLLECTION_ID_CART,
//                 doc.$id,
//                 { bought: true }
//             );
//         }

//         res.status(200).json({ message: 'Documents updated successfully' });
//     } catch (error) {
//         console.log(error);
//         res.status(500).json({ error: 'An error occurred while updating the cart items' });
//     }
// };


//done
const Getproduct = async (req, res) => {
    const { prod_id} = req.body;
    try {
      let response = await database.getCollection(
        process.env.DATABASE_ID,
        process.env.COLLECTION_ID_PRODUCTS,
        Query.equal("product_id", prod_id)
      );
  
      console.log(response);
      res.status(200).json(response);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred while fetching the collection: ' + error.message });
    }
  };
  

//done
const Addcart = async (req, res) => {
    const { Mobile, product_id, product_quantity, product_cost } = req.body;
    try {
        let response = await database.createDocument(
            process.env.DATABASE_ID,
            process.env.COLLECTION_ID_CART,
            'unique()',
            {
                Mobile,
                product_id,
                product_quantity,
                product_cost,
            }
        );
        console.log(response);
        res.status(200).json(response);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'An error occurred while adding to the cart' });
    }
};

//done
const Deleteitem = async (req, res) => {
    const { Mobile, product_id } = req.body;

    try {
        const documents = await database.listDocuments(process.env.DATABASE_ID, process.env.COLLECTION_ID_CART);
        const document = documents.documents.find(doc => doc.Mobile === Mobile && doc.product_id === product_id);

        await database.deleteDocument(
            process.env.DATABASE_ID,
            process.env.COLLECTION_ID_CART,
            document.$id,
        );
        
      res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'An error occurred while deleting the cart item' });
    }
};

//done
const IncreaseProductQuantity = async (req, res) => {
    const { Mobile, product_id } = req.body;
    try {
        const documents = await database.listDocuments(process.env.DATABASE_ID, process.env.COLLECTION_ID_CART);
        const document = documents.documents.find(doc => doc.Mobile === Mobile && doc.product_id === product_id);

        if (!document) {
            return res.status(404).json({ error: 'Document not found' });
        }

        const newQuantity = document.product_quantity + 1;

        let response = await database.updateDocument(
            process.env.DATABASE_ID,
            process.env.COLLECTION_ID_CART,
            document.$id,
            { product_quantity: newQuantity }
        );

        res.status(200).json(response);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'An error occurred while increasing the product quantity' });
    }
};

//done
const DecreaseProductQuantity = async (req, res) => {
    const { Mobile, product_id } = req.body;
    try {
        const documents = await database.listDocuments(process.env.DATABASE_ID, process.env.COLLECTION_ID_CART);

        const document = documents.documents.find(doc => doc.Mobile === Mobile && doc.product_id === product_id);

        if (!document) {
            return res.status(404).json({ error: 'Document not found' });
        }

        if (document.product_quantity <= 0) {
            return res.status(400).json({ error: 'No product available' });
        }

        const newQuantity = document.product_quantity - 1;

        let response = await database.updateDocument(
            process.env.DATABASE_ID,
            process.env.COLLECTION_ID_CART,
            document.$id,
            { product_quantity: newQuantity }
        );

        res.status(200).json(response);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'An error occurred while decreasing the product quantity' });
    }
};

//done
const Verify_coupon = async (req, res) => {
    const { coupon, total_price } = req.body;
    try {
      const dummy_coupon = "JP67YT";
  
      if (coupon === dummy_coupon) {
        const discount = total_price * 0.15;
        const discounted_total = total_price - discount;
  
        res.status(200).json({
          message: "Coupon applied successfully! You get 15% off.",
          original_price: total_price,
          discount: discount,
          discounted_total: discounted_total
        });
      } else {
        res.status(400).json({
          message: "Invalid coupon code. Please try again.",
          original_price: total_price,
          discount: 0,
          discounted_total: total_price
        });
      }
    } catch (error) {
      res.status(500).json({
        message: "An error occurred while verifying the coupon.",
        error: error.message
      });
    }
  };
  
module.exports = {
    Generate_otp,
    Verify_otp,
    Verify_coupon,
    Getall,
    Getcart,
    Getproduct,
    Addcart,
    Deleteitem,
    IncreaseProductQuantity,
    DecreaseProductQuantity
};
