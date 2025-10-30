import User from "../models/UserModel.js";

export const searchContacts = async (request, response, next) => {
  try {
    // implement search logic here
    const {searchTerm} = request.body;

    if(searchTerm === undefined || searchTerm === null){
        response.status(400).send("searchTerm is required.");
    }

    // regex to remove special characters and make it case insensitive
    const sanitizedSearchTerm = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    const regex = new RegExp(sanitizedSearchTerm, 'i');

    const contacts = await User.find({
      $and: [
        { _id: { $ne: request.userId } }, // if the id is not equal to the logged in user then only search
        { $or: [{ firstName: regex }, { lastName: regex }, { email: regex }] }
      ],
    });

    // regex to remove special characters and make it case insensitive
    // from that if we found any user then return that user
    return response.status(200).json({contacts});

    // return response.status(200).send("Logout successfull.");  
  } catch (error) {
    console.log(error);
    return response.status(500).send("Internal Server Error");
  }
};