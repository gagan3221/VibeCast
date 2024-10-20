//UserModel : How the configurations of user should look like?

//interface (typescript)
import { Model, model, ObjectId, Schema } from "mongoose";
import { hash , compare } from "bcrypt";

interface UserDocument {
  name: string;
  email: string;
  password: string;
  verified: boolean;
  avatar?: { url: string; publicId: string };
  tokens: string[];
  favorites: ObjectId[];
  followers: ObjectId[];
  following: ObjectId[];
}

interface Methods {
  comparePassword(password : string) : Promise<boolean>

}
//Javascript (MongoDB) Schema
const userSchema = new Schema<UserDocument , {} , Methods>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    avatar: {
      type: Object,
      url: String,
      publicId: String,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    favorites: [
      {
        type: Schema.Types.ObjectId,
        ref: "Audio",
      },
    ],
    followers: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    following: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    tokens: [String],
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  //hash the token
  if (this.isModified("password")) {
    this.password = await hash(this.password, 10);
  }
  next();
});

userSchema.methods.comparePassword = async function (password) {
  const result = await compare(password , this.password)
  return result;
};

export default model("User", userSchema) as Model<UserDocument ,{}, Methods>;
