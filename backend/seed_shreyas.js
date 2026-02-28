import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Grievance from './models/Grievance.js';
import News from './models/News.js';
import Poll from './models/Poll.js';
import CivicCredits from './models/CivicCredits.js';
import bcrypt from 'bcryptjs';

dotenv.config();

const seedShreyas = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        // 1. Process User
        let user = await User.findOne({ email: 'shreyas@123' });

        if (!user) {
            console.log('User shreyas@123 not found. Creating...');
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash('123', salt);

            user = await User.create({
                name: 'Shreyas',
                email: 'shreyas@123',
                password: hashedPassword,
                role: 'Local People',
                scoreCredit: 500,
                phoneNumber: '9876543210',
                address: 'Amravati, Maharashtra',
                latitude: 20.9320,
                longitude: 77.7523
            });
            console.log('User created.');
        } else {
            user.scoreCredit = 500;
            user.name = 'Shreyas';
            await user.save();
            console.log('User profile updated.');
        }

        // 2. Process Civic Credits (The source of truth for the Impact Hub)
        let credits = await CivicCredits.findOne({ userId: user._id });
        const creditData = {
            userId: user._id,
            totalCredits: 500,
            lockedCredits: {
                taxUtility: 150,
                healthcare: 200,
                developmentVoting: 150
            },
            history: [
                { reason: 'Initial Neural Welcome Bonus', credits: 100, date: new Date() },
                { reason: 'Reported GRV-001 Verification', credits: 250, date: new Date() },
                { reason: 'Community Impact Bonus', credits: 150, date: new Date() }
            ]
        };

        if (!credits) {
            await CivicCredits.create(creditData);
            console.log('CivicCredits document created with 500 total points.');
        } else {
            Object.assign(credits, creditData);
            await credits.save();
            console.log('CivicCredits document updated with 500 total points.');
        }

        // 3. Add Dummy News
        const newsData = [
            { title: 'Smart City Phase 2 Approved', category: 'Development', date: '2026-03-01', content: 'The municipal corporation has approved the second phase of the Smart City project for Amravati.', important: true },
            { title: 'New Public Garden in Rajapeth', category: 'Environment', date: '2026-02-28', content: 'A new green zone is being developed near Rajapeth to improve air quality.', important: false },
            { title: 'Water Supply Maintenance', category: 'Decision', date: '2026-02-27', content: 'Routine maintenance will occur on March 5th. No supply from 10 AM to 4 PM.', important: true }
        ];

        for (const n of newsData) {
            await News.findOneAndUpdate({ title: n.title }, n, { upsert: true });
        }
        console.log('Dummy News seeded.');

        // 4. Add Dummy Polls
        const pollData = [
            {
                title: 'New Metro Route Priority',
                description: 'Which route should be prioritized for the Amravati Metro Phase 1?',
                options: [
                    { label: 'Badnera to Rajapeth', votes: 120 },
                    { label: 'Panchavati to Gadge Nagar', votes: 145 },
                    { label: 'Station to Camp', votes: 90 }
                ],
                createdBy: user._id,
                isActive: true,
                category: 'Infrastructure'
            },
            {
                title: 'Clean City Campaign Name',
                description: 'Suggest a name for our upcoming cleanliness drive.',
                options: [
                    { label: 'Clean Amravati', votes: 50 },
                    { label: 'Mazi Amravati, Swachh Amravati', votes: 210 },
                    { label: 'Green Pulse Drive', votes: 85 }
                ],
                createdBy: user._id,
                isActive: true,
                category: 'Environment'
            }
        ];

        for (const p of pollData) {
            await Poll.findOneAndUpdate({ title: p.title }, p, { upsert: true });
        }
        console.log('Dummy Polls seeded.');

        // 5. Add Dummy Grievances
        const grievanceData = [
            {
                grievanceId: 'GRV-001',
                originalReporter: user._id,
                citizenName: 'Shreyas',
                email: 'shreyas@123',
                phone: '9876543210',
                category: 'Roads',
                description: 'Large pothole near Gadge Baba temple causing traffic issues.',
                location: 'Gadge Baba Temple Area',
                latitude: 20.9325,
                longitude: 77.7530,
                status: 'Worker Assigned',
                priorityScore: 85,
                aiAnalysis: { rootCause: 'Asphalt erosion' }
            },
            {
                grievanceId: 'GRV-002',
                originalReporter: user._id,
                citizenName: 'Shreyas',
                email: 'shreyas@123',
                phone: '9876543210',
                category: 'Waste Management',
                description: 'Garbage not collected for 3 days in Rajapeth area.',
                location: 'Rajapeth Market',
                latitude: 20.9340,
                longitude: 77.7510,
                status: 'Reported',
                priorityScore: 70,
                aiAnalysis: { rootCause: 'Collection route delay' }
            },
            {
                grievanceId: 'GRV-003',
                originalReporter: user._id,
                citizenName: 'Anjali',
                email: 'anjali@test.com',
                phone: '9999988888',
                category: 'Electricity',
                description: 'Street lights are out on the main highway stretch.',
                location: 'National Highway 6 Stretch',
                latitude: 20.9300,
                longitude: 77.7550,
                status: 'Resolved',
                priorityScore: 40,
                aiAnalysis: { rootCause: 'Fuse malfunction' }
            }
        ];

        for (const g of grievanceData) {
            await Grievance.findOneAndUpdate({ grievanceId: g.grievanceId }, g, { upsert: true });
        }
        console.log('Dummy Grievances seeded.');

        console.log('✅ All dummy data for City Pulse / Impact Hub has been seeded successfully.');
        process.exit();
    } catch (error) {
        console.error('❌ Error seeding data:', error);
        process.exit(1);
    }
};

seedShreyas();
