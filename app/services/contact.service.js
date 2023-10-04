const { ObjectId } = require("mongodb");

class ContactService {
    constructor(client){
        this.Contact = client.db().collection("contacts");
    }

    extractConactData(payload){
      //  console.log("paylod " + payload.name);
        const contact = {
            name: payload.name,
            email: payload.email,
            address: payload.address,
            phone: payload.phone,
            favorite: payload.favorite,
        };
       // console.log("paylod contactextract " + contact);
        Object.keys(contact).forEach(
            (key) => { 
               // console.log("paylod contactextract 1 " + key + contact[key]);
                contact[key] === undefined && delete contact[key] }
        );
        return contact;
    }

    async create(payload){
        const contact = this.extractConactData(payload);
        console.log("create contact " + contact);
        const result = await this.Contact.findOneAndUpdate(
            contact,
            {   $set: {favorite: contact.favorite === true}},
            { returnDocument: "after", upsert: true }
        );
        return result.value;
    }

    async find(filter){
        const cursor = await this.Contact.find(filter);
        return await cursor.toArray();
    }

    async findByName(name){
        return await this.find({
            name: {
                $regex: new RegExp(name), $options: "i"
            }
        });
    }
    async findById(id){
        console.log("goi ham findById " +id);
        return await this.Contact.findOne({
            _id: ObjectId.isValid(id) ? new ObjectId(id): null
        });
    }
    async update(id, payload){
        console.log(id);
        const filter = {
            _id: ObjectId.isValid(id) ? new ObjectId(id): null,
        };
        console.log("fileder" + filter);
        const update = this.extractConactData(payload);
        console.log(update);
        const result = await this.Contact.findOneAndUpdate(
            filter, 
            { $set: update}, 
            {returnDocument: "after"}
        );
        console.log(result);
        return result;
    }
    async delete(id){
        console.log('goi ham delete conver  ' + id);
       const result = await this.Contact.findOneAndDelete({
        _id: ObjectId.isValid(id) ? new ObjectId(id): null,
       });
       console.log("resu " +result);
       return result;
    }

    async findFavorite (){
         return await this.find({
            favorite: true
         });
    }
    async deleteAll(){
        const resutl = await this.Contact.deleteMany({});
        return resutl.deleteCount;
    }
}

module.exports = ContactService;