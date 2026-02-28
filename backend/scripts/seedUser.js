import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import CivicCredits from '../models/CivicCredits.js';
import bcrypt from 'bcryptjs';

dotenv.config();

const seedShreyas = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        const email = 'shreyas@123';
        const password = '123';
        const hashedPassword = await bcrypt.hash(password, 10);

        let user = await User.findOne({ email });

        if (!user) {
            user = await User.create({
                name: 'Shreyas Dakhole',
                email: email,
                password: password, // The model should handle hashing if defined, but we'll see
                role: 'Citizen',
                scoreCredit: 500
            });
            console.log('Created user Shreyas');
        } else {
            user.scoreCredit = 500;
            user.name = 'Shreyas Dakhole';
            await user.save();
            console.log('Updated user Shreyas');
        }

        let credits = await CivicCredits.findOne({ userId: user._id });

        if (!credits) {
            credits = await CivicCredits.create({
                userId: user._id,
                totalCredits: 1250,
                lockedCredits: { taxUtility: 450, healthcare: 300, developmentVoting: 500 },
                history: [
                    { reason: 'Early Adopter Bonus', credits: 500, date: new Date() },
                    { reason: 'Frequent Reporter Reward', credits: 750, date: new Date() }
                ]
            });
            console.log('Created credits for Shreyas');
        } else {
            credits.totalCredits = 1250;
            credits.lockedCredits = { taxUtility: 450, healthcare: 300, developmentVoting: 500 };
            credits.history = [
                { reason: 'Early Adopter Bonus', credits: 500, date: new Date() },
                { reason: 'Frequent Reporter Reward', credits: 750, date: new Date() }
            ];
            await credits.save();
            console.log('Updated credits for Shreyas');
        }

        console.log('Seeding complete');
        process.exit();
    } catch (error) {
        console.error('Seeding failed:', error);
        process.exit(1);
    }
};

seedShreyas();
