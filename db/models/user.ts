import {Schema, model} from "mongoose"

const statScheme = new Schema({
    name: {type: String, require: true},
    count: {type: Number, require: true},
    description: {type: String, require: true}
})

const UserScheme = new Schema({
    UserEmail: {type: String, require: true},
    UserImages: [{type: Schema.ObjectId, ref: "Image"}],
    UserPassword: {type: String, require: true},
    UserStat: [{type: statScheme, require: true}]
}, {timestamps: true})


const User = model("User", UserScheme)
export default User