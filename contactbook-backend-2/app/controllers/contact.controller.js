const ContactService = require("../services/contact.service");
const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error")

exports.create = async (req, res, next) => {
    if (!req.body?.name) {
        return next(new ApiError(400, "Name cannot be empty"));
    }

    try {
        const contactService = new ContactService(MongoDB.client);
        const document = await contactService.create(req.body);
        return res.send(document);
    } catch (error) {
        console.error("Error creating contact:", error); // Log the error for debugging.
        return next(new ApiError(500, "An error occurred while creating the contact"));
    }
};

exports.finndAll = async( req,res,next) =>{
    let document =[];

    try{
        const contactService = new ContactService(MongoDB.client)
        const {name} = req.query;
        if(name){
            document = await contactService.finndByName(name);
        } else {
            document = await contactService.find({});
        }
    } catch (error){
        return next(
            new  ApiError(500,"An error occurred while creating the contact")
        );
    }
    return res.send(document);
};

exports.findOne = async ( req,res,next) =>{
    try{
        const contactService = new ContactService(MongoDB.client);
        const document = await contactService.findById(req.params.id);
        if(!document){
            return next( new ApiError(404,"Contact not found"));
        }
        return res.send(document)
    } catch (error){
        return next(
             new ApiError(
                500, `Error retreving contact with id=${req.params.id}`
             )
        );
    }
};

exports.update = async( req,res,next) =>{
    if(Object.keys(req.body).length === 0){
        return next(new ApiError (400,"Data to update can not be empty"));
    }

    try{
        const contactService = new ContactService(MongoDB.client);
        const document = await contactService.update(req.params.id,req.body);
        if(!document){
            return next (new ApiError(404,"Contact not found"));
        }
        return res.send({message:"Contact was update successfully"});
    } catch (error){
        return next(
            new ApiError(500,`Error updating contact with id=${req.params.id}`)
        );
    }
};


exports.delete = async( req,res,next) =>{
    try{
        const contactService = new ContactService(MongoDB.client);
        const document = await contactService.delete(req.params.id);
        if(!document){
            return next (new ApiError(404,"Contact not found"));
        }
        return res.send({message:"Contact was detele successfully"});
    } catch (error){
        return next(
            new ApiError(500,`Error delete contact with id=${req.params.id}`)
        );
    }
};



exports.deleteAll =async (_req,res,next) =>{
    try{
        const contactService = new ContactService(MongoDB.client);
        const deletedCount = await contactService.deleteAll();
        return res.send({
            message:`${deletedCount} contacts were deleted successfully` 
        });
    } catch (error){
        return next(
            new ApiError(500,"An error occurred while retrieving favorite contacts")
        );
    }
};

exports.findAllFavorites =async (_req,res,next) =>{
    try{
        const contactService = new ContactService(MongoDB.client);
        const document = await contactService.findFavorite();
        return res.send(document);
    } catch (error){
        return next(
            new ApiError(500,"An error occurred while retrieving favorite contacts")
        );
    }
};
