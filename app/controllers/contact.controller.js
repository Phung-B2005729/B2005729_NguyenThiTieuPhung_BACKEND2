const ApiError = require("../api-error");
const ContactService = require("../services/contact.service");
const MongoDB = require("../utils/mongodb.util");

exports.create = async (req, res, next) => {
  if(!req.body?.name){
    return next(new ApiError(400,"Name can not be empty"));
  }

  try{
    const contactService = new ContactService(MongoDB.client);
    const document = await ContactService.create(req.body);
    return res.send(document);
  }catch(err){
    return next(new ApiError(500, "An error ocurred while creating the contact"));
  }
};

exports.findAll = async (req,res, next) => {
   let document = [];
   try{
    const contactService = new ContactService(MongoDB.client);
    const { name } = req.query;
   
   if(name){
     document = await contactService.findByName(name);
   }
   else{
    document = await contactService.find({});
   }
}catch(err){
    return next(
        new ApiError(500, "An error occured while retrieving contacts")
    );
}
return res.send(document);
};

exports.findOne = async (req,res, next) => {
   try{
    const contactService = new ContactService(MongoDB.client);
    const document = await contactService.findById(req.params.id);
    if(!document){
        return next(new ApiError(404, "Contact not found"));
    }
    return res.send(document);
   }catch(error){
    return next(new ApiError(500, `Error retrieving contact with id=${req.params.id}`));
   }
};

exports.update = async (req,res, next) => {
   if(Object.keys(req.body).length == 0){
    return next(new ApiError(400,"Data to update can not be empty"));
   }
   try{
    const contactService = new ContactService(MongoDB.client);
    const document = await contactService.update(req.params.id, req.body);
    if(!document){
        return next(new ApiError(404,"Contact not found"));
    }
    return res.send({
        message: "Contact was updated successfully"
    });
   }catch(err){
    return next(new ApiError(500, `Error updating contact with id=${req.params.id}`));
   }
};

exports.delete = async (req,res, next) => {
    try{
        const contactService = new ContactService(MongoDB.client);
        const document = await contactService.delete(req.params.id);
        if(!document){
            return next(new ApiError(404, "Contact not found"));
        }
        return res.send({
            message: "Contact was deleted succesfully"
        });
    }catch(err){
        return next(new ApiError(500, `Could not delete contact with id=${req.params.id}`));
    }
}

exports.findAllFavorite = async (_req,res, next) => {
    try {
        const contactService = new ContactService(MongoDB.client);
        const document = await contactService.findFavorite();
        return res.send(document);
    }catch(err){
        return next(new ApiError(500, "An error occurred while favorite contacts"));
    }
}
exports.deleteAll = async (_req, res, next) => {
   try {
    const contactService = new ContactService(MongoDB.client);
    const deleteCount = await contactService.deleteAll();
    return res,send({
        message: `${deleteCount} contact were deleted successfully`
    });
   } catch(err){
    return next(new ApiError(500,"An error occurred while removing all contacts"))
   }
};
