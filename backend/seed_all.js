import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import connectDB from './config/db.js';

// Models
import User from './models/User.js';
import Grievance from './models/Grievance.js';
import News from './models/News.js';
import Poll from './models/Poll.js';
import Asset from './models/Asset.js';
import AuditLog from './models/AuditLog.js';
import CivicCredits from './models/CivicCredits.js';
import EmergencyComplaint from './models/EmergencyComplaint.js';
import SupportRequest from './models/SupportRequest.js';
import WardVote from './models/WardVote.js';

dotenv.config();

const seedData = async () => {
    try {
        await connectDB();

        // Clear existing data
        console.log('Cleaning up existing data...');
        await Promise.all([
            User.deleteMany(),
            Grievance.deleteMany(),
            News.deleteMany(),
            Poll.deleteMany(),
            Asset.deleteMany(),
            AuditLog.deleteMany(),
            CivicCredits.deleteMany(),
            EmergencyComplaint.deleteMany(),
            SupportRequest.deleteMany(),
            WardVote.deleteMany()
        ]);

        console.log('Seeding Users...');
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('password123', salt);

        const users = await User.insertMany([
            {
                name: 'Admin User',
                email: 'admin@urbanpulse.ai',
                password: hashedPassword,
                role: 'Department',
                phoneNumber: '9000000000',
                address: 'Municipal Headquarters, Sector 1'
            },
            {
                name: 'Arjun PMC',
                email: 'arjun@pmc.gov',
                password: hashedPassword,
                role: 'Worker',
                workerPoints: 1250,
                tasksVerified: 12,
                qualityScore: 98,
                latitude: 18.5204,
                longitude: 73.8567,
                phoneNumber: '9876543210'
            },
            {
                name: 'Suresh Field Ops',
                email: 'suresh@ops.gov',
                password: hashedPassword,
                role: 'Worker',
                workerPoints: 950,
                tasksVerified: 9,
                qualityScore: 92,
                latitude: 18.5304,
                longitude: 73.8667,
                phoneNumber: '9876543211'
            },
            {
                name: 'Rahul Sharma',
                email: 'rahul@example.com',
                password: hashedPassword,
                role: 'Local People',
                scoreCredit: 500,
                latitude: 18.5204,
                longitude: 73.8567,
                phoneNumber: '9876543212'
            },
            {
                name: 'Sneha Patil',
                email: 'sneha@example.com',
                password: hashedPassword,
                role: 'Local People',
                scoreCredit: 300,
                latitude: 18.5150,
                longitude: 73.8500,
                phoneNumber: '9876543213'
            },
            {
                name: 'Lokesh',
                email: 'lokesh@example.com',
                password: hashedPassword,
                role: 'Local People',
                scoreCredit: 750,
                latitude: 18.5204,
                longitude: 73.8567,
                phoneNumber: '9000000001'
            }
        ]);

        const adminUser = users[0];
        const arjun = users[1];
        const rahul = users[3];
        const sneha = users[4];
        const lokesh = users[5];

        console.log('Seeding Grievances...');
        const grievances = await Grievance.insertMany([
            {
                citizenName: "Rahul Sharma",
                email: "rahul@example.com",
                phone: "9876543212",
                category: "Pothole",
                location: "Kothrud Depot",
                latitude: 18.5204,
                longitude: 73.8567,
                description: "Deep pothole causing traffic and minor accidents.",
                status: "Resolved",
                assignedWorker: arjun._id,
                assignedAt: new Date(Date.now() - 86400000 * 5),
                completedAt: new Date(Date.now() - 86400000 * 3),
                resolutionProofUrl: "https://images.unsplash.com/photo-1599427303058-f06cbdf0bb9d?auto=format&fit=crop&q=80&w=400",
                department: "Roads",
                priorityScore: 85,
                grievanceId: "GRV100001",
                originalReporter: rahul._id,
                verificationVotes: { upvotes: 25, downvotes: 0 },
                citizenFeedback: 'Resolved',
                feedbackComment: 'The patch work is solid. Thank you PMC!'
            },
            {
                citizenName: "Sneha Patil",
                email: "sneha@example.com",
                phone: "9876543213",
                category: "Electricity",
                location: "Baner Road",
                latitude: 18.5150,
                longitude: 73.8500,
                description: "Streetlight wires hanging dangerously low near the school entrance.",
                status: "Resolved",
                assignedWorker: arjun._id,
                assignedAt: new Date(Date.now() - 86400000 * 2),
                completedAt: new Date(Date.now() - 86400000 * 1),
                resolutionProofUrl: "https://images.unsplash.com/photo-1544724569-5f546fd6f2b5?auto=format&fit=crop&q=80&w=400",
                department: "Electricity",
                priorityScore: 92,
                grievanceId: "GRV100002",
                originalReporter: sneha._id,
                verificationVotes: { upvotes: 42, downvotes: 1 },
                citizenFeedback: 'Resolved',
                feedbackComment: 'Fixed within 24 hours. Great job.'
            },
            {
                citizenName: "Amit Shah",
                email: "amit@example.com",
                phone: "9876543220",
                category: "Public Health",
                location: "Viman Nagar Square",
                latitude: 18.5300,
                longitude: 73.8600,
                description: "Open sewage drain near market area emitting foul smell.",
                status: "Resolved",
                assignedWorker: arjun._id,
                assignedAt: new Date(Date.now() - 86400000 * 10),
                completedAt: new Date(Date.now() - 86400000 * 8),
                department: "Public Health",
                priorityScore: 95,
                grievanceId: "GRV100003",
                originalReporter: rahul._id,
                verificationVotes: { upvotes: 12, downvotes: 0 },
                aiAnalysis: {
                    rootCause: "Blocked pipeline due to industrial waste",
                    structuralHealth: 40,
                    historicalFrequency: 3,
                    contextEscalation: true
                }
            },
            {
                citizenName: "Priya Das",
                email: "priya@example.com",
                phone: "9876543225",
                category: "Water Supply",
                location: "Hinjewadi Phase 2",
                latitude: 18.5913,
                longitude: 73.7389,
                description: "Major water leak in the main supply line near the IT park.",
                status: "Worker Assigned",
                assignedWorker: arjun._id,
                assignedAt: new Date(),
                department: "Water",
                priorityScore: 88,
                grievanceId: "GRV100004",
                originalReporter: rahul._id
            },
            {
                citizenName: "Vikram Malhotra",
                email: "vikram@example.com",
                phone: "9876543230",
                category: "Garbage",
                location: "Kalyani Nagar",
                latitude: 18.5463,
                longitude: 73.9033,
                description: "Overflowing garbage bins near the Central Park for 3 days.",
                status: "AI Classified",
                department: "Waste Management",
                priorityScore: 75,
                grievanceId: "GRV100005",
                originalReporter: sneha._id
            },
            {
                citizenName: "Anjali Verma",
                email: "anjali@example.com",
                phone: "9876543235",
                category: "Stray Animals",
                location: "Hadapsar",
                latitude: 18.5089,
                longitude: 73.9259,
                description: "Aggressive stray dogs near the municipal school.",
                status: "Resolved",
                assignedWorker: arjun._id,
                assignedAt: new Date(Date.now() - 86400000 * 4),
                completedAt: new Date(Date.now() - 86400000 * 2),
                department: "Public Health",
                priorityScore: 90,
                grievanceId: "GRV100006",
                originalReporter: rahul._id,
                verificationVotes: { upvotes: 31, downvotes: 2 },
                feedbackComment: 'Dogs relocated safely. Thanks for the quick response.'
            },
            {
                citizenName: "Lokesh",
                email: "lokesh@example.com",
                phone: "9000000001",
                category: "Pothole",
                location: "Magarpatta City",
                latitude: 18.5246,
                longitude: 73.9259,
                description: "Huge pothole at the entrance of Magarpatta Phase 1.",
                status: "Worker Assigned",
                assignedWorker: arjun._id,
                assignedAt: new Date(),
                department: "Roads",
                priorityScore: 88,
                grievanceId: "GRV100007",
                originalReporter: lokesh._id
            },
            {
                citizenName: "Lokesh",
                email: "lokesh@example.com",
                phone: "9000000001",
                category: "Electricity",
                location: "Amanora Park",
                latitude: 18.5200,
                longitude: 73.9300,
                description: "Frequent power cuts in the evening hours.",
                status: "AI Classified",
                department: "Electricity",
                priorityScore: 70,
                grievanceId: "GRV100008",
                originalReporter: lokesh._id
            }
        ]);

        console.log('Seeding News...');
        await News.insertMany([
            {
                title: "PMC Solar Power Initiative",
                category: "Decision",
                date: new Date().toISOString().split('T')[0],
                content: "Official board decision to install solar panels across all 15 ward offices by Q3 2026. This move is expected to save 30% on energy costs.",
                important: true
            },
            {
                title: "Smart Waste Management Rollout",
                category: "Decision",
                date: new Date(Date.now() - 86400000 * 2).toISOString().split('T')[0],
                content: "Implementation of AI-driven garbage bin sensors in Kothrud and Baner starting next Monday. Real-time alerts will optimize collection routes.",
                important: true
            },
            {
                title: "Baner Road Expansion Project",
                category: "Development",
                date: "2026-02-20",
                content: "Phase 2 of Baner road widening approved. Residents can vote on the median landscaping options in the Impact Hub.",
                important: false
            },
            {
                title: "Budget Allocation for Public Parks",
                category: "Decision",
                date: "2026-02-24",
                content: "12Cr+ budget approved for rejuvenation of 5 major parks including Saras Baug and Model Colony Lake.",
                important: true
            }
        ]);

        console.log('Seeding Polls...');
        await Poll.insertMany([
            {
                title: "Priority for Ward Development (Baner)",
                description: "What should be the main focus for Ward P04 (Baner) this quarter?",
                options: [
                    { label: "Community Park", votes: 145 },
                    { label: "Solar Street Lights", votes: 230 },
                    { label: "Waste Segregation", votes: 95 }
                ],
                isActive: true,
                createdBy: adminUser._id,
                wardId: "P04",
                category: "Infrastructure"
            },
            {
                title: "Weekly Civic Priority",
                description: "Which upcoming project deserves maximum budget acceleration?",
                options: [
                    { label: "IT Park Connectivity", votes: 450 },
                    { label: "Water Reservoir Phase 2", votes: 680 },
                    { label: "Pedestrian Walkways", votes: 320 }
                ],
                isActive: true,
                createdBy: adminUser._id,
                category: "General"
            }
        ]);

        console.log('Seeding Assets...');
        await Asset.insertMany([
            {
                assetId: "ROAD-KOT-001",
                assetType: "ROAD",
                location: { type: "Point", coordinates: [73.8567, 18.5204] },
                healthStatus: "DEGRADED",
                recommendation: "PATCH",
                failureCount18Months: 6,
                lastFailureDate: new Date(Date.now() - 86400000 * 5)
            },
            {
                assetId: "LIGHT-BAN-402",
                assetType: "LIGHT",
                location: { type: "Point", coordinates: [73.8500, 18.5150] },
                healthStatus: "STRUCTURAL_FATIGUE",
                recommendation: "FULL_REBUILD",
                failureCount18Months: 12,
                lastFailureDate: new Date(Date.now() - 86400000 * 2)
            },
            {
                assetId: "PIPE-VIM-112",
                assetType: "PIPE",
                location: { type: "Point", coordinates: [73.8600, 18.5300] },
                healthStatus: "DEGRADED",
                recommendation: "PATCH",
                failureCount18Months: 8,
                lastFailureDate: new Date(Date.now() - 86400000 * 10)
            }
        ]);

        console.log('Seeding Civic Credits...');
        await CivicCredits.insertMany([
            {
                userId: rahul._id,
                totalCredits: 1250,
                lockedCredits: { taxUtility: 500, healthcare: 450, developmentVoting: 300 },
                history: [
                    { reason: "Verified resolution for GRV100001", credits: 100, complaintId: "GRV100001", date: new Date(Date.now() - 86400000 * 3) },
                    { reason: "Reporting stray dog hazard (GRV100006)", credits: 50, complaintId: "GRV100006", date: new Date(Date.now() - 86400000 * 4) },
                    { reason: "Daily civic participation bonus", credits: 10, date: new Date() }
                ]
            },
            {
                userId: sneha._id,
                totalCredits: 850,
                lockedCredits: { taxUtility: 300, healthcare: 300, developmentVoting: 250 },
                history: [
                    { reason: "Verified resolution for GRV100002", credits: 100, complaintId: "GRV100002", date: new Date(Date.now() - 86400000 * 1) },
                    { reason: "Initial citizen registration bonus", credits: 100, date: new Date(Date.now() - 86400000 * 30) }
                ]
            },
            {
                userId: lokesh._id,
                totalCredits: 1500,
                lockedCredits: { taxUtility: 600, healthcare: 500, developmentVoting: 400 },
                history: [
                    { reason: "Initial registration bonus", credits: 500, date: new Date(Date.now() - 86400000 * 10) },
                    { reason: "Reporting potholes at Magarpatta", credits: 200, complaintId: "GRV100007", date: new Date(Date.now() - 86400000 * 5) },
                    { reason: "Civic engagement award", credits: 800, date: new Date() }
                ]
            }
        ]);

        console.log('Seeding Audit Logs...');
        await AuditLog.insertMany([
            {
                ticketId: grievances[0]._id,
                action: "Status Changed to Resolved",
                previousHash: "0x00000000000000000000000000000000",
                currentHash: "0x1234567890abcdef1234567890abcdef",
                timestamp: new Date(Date.now() - 86400000 * 3),
                metadata: {
                    performedBy: adminUser._id,
                    details: "Engineering team verified the patch work."
                }
            },
            {
                ticketId: grievances[0]._id,
                action: "Blockchain Verification Successful",
                previousHash: "0x1234567890abcdef1234567890abcdef",
                currentHash: "0xbcdef1234567890abcdef1234567890",
                timestamp: new Date(Date.now() - 86400000 * 3 + 1000),
                metadata: { details: "Transparency node 04 verified." }
            },
            {
                ticketId: grievances[1]._id,
                action: "Status Changed to Resolved",
                previousHash: "0xabcdef1234567890abcdef1234567890",
                currentHash: "0xfedcba0987654321fedcba0987654321",
                timestamp: new Date(Date.now() - 86400000 * 1),
                metadata: {
                    performedBy: adminUser._id,
                    details: "Assigned worker uploaded proof images. AI verification passed."
                }
            }
        ]);

        console.log('Seeding Ward Votes...');
        await WardVote.insertMany([
            {
                wardId: "WARD_P04",
                option: "Solar Street Lights",
                votes: 230,
                creditSpent: 230
            },
            {
                wardId: "WARD_P04",
                option: "Community Park",
                votes: 145,
                creditSpent: 145
            }
        ]);

        console.log('Seeding Emergency Complaints...');
        await EmergencyComplaint.insertMany([
            {
                userId: rahul._id,
                type: "Officer Inaction",
                description: "Officer at Ward Office 4 refused to accept formal complaint regarding water supply.",
                referenceId: "EMG-1001",
                status: "Under Investigation",
                isRestricted: true,
                createdAt: new Date(Date.now() - 86400000 * 2)
            }
        ]);

        console.log('Seeding Support Requests...');
        await SupportRequest.insertMany([
            {
                userId: sneha._id,
                type: "Help",
                subject: "App login issue",
                message: "Unable to login using biometric on Android 14.",
                referenceId: "SUP-2001",
                status: "Submitted",
                createdAt: new Date(Date.now() - 86400000 * 5)
            }
        ]);

        console.log('✅ Seeding completed successfully!');
        process.exit();
    } catch (error) {
        console.error(`❌ Error seeding data: ${error.message}`);
        process.exit(1);
    }
};

seedData();
