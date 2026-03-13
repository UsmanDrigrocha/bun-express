import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    isVerified?: boolean;
    isDeleted: boolean;
    isSubscribed: boolean;
    profilePic: string | null;
    role: 'user' | 'admin';
}

const userSchema = new Schema<IUser>(
    {
        name: { type: String, default: 'User' },
        email: { type: String, required: true, unique: true },
        password: { type: String, default: "" },
        isVerified: { type: Boolean, default: false },
        isDeleted: { type: Boolean, default: false },
        isSubscribed: { type: Boolean, default: false },
        profilePic: { type: String, required: false, default: null },
        role: { type: String, default: 'user', enum: ['user', 'admin'] },
    },
    { timestamps: true }
);

userSchema.index({ createdAt: -1, email: 1, name: 1, aiCredits: 1, isSubscribed: 1 });

const User = mongoose.model<IUser>('Users', userSchema);

export default User;