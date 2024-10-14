//UserModel : How the configurations of user should look like?

//interface (typescript)
import { Model, model, ObjectId, Schema } from "mongoose";

interface EmailVerificationTokenDocument {
  owner : ObjectId ;
  token : string;
  createdAt : Date;
}
//Expire them after 1 hrs

const emailVerificationTokenSchema = new Schema<EmailVerificationTokenDocument>({
    owner:{
        type : Schema.Types.ObjectId ,
        required : true ,
        ref : "User"
    },
    token:{
        type : String,
        required : true
    },
    createdAt : {
        type : Date ,
        expires : 3600 , //60 min * 60 sec = 3600s
        default : Date.now()
    }
});

export default model(
  "emailVerificationToken",
  emailVerificationTokenSchema
) as Model<EmailVerificationTokenDocument>;
