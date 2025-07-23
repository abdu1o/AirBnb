import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    }
});

const User = mongoose.models.Users || mongoose.model("users", userSchema);
export default User;