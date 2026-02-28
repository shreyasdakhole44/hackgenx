import Grievance from '../models/Grievance.js';
import AuditLog from '../models/AuditLog.js';
import User from '../models/User.js';
import Asset from '../models/Asset.js';
import CivicCredits from '../models/CivicCredits.js';
import sendEmail from '../utils/sendEmail.js';
import { sendRewardEmail } from '../utils/rewardEmail.js';
import { createBlockData } from '../utils/ledgerUtils.js';
import { verifyWork } from '../utils/AutomatedSuperior.js';

// --- HELPER: Citizen Rewards & Badges ---
export const handleCitizenRewards = async (user, grievanceId) => {
    user.badgeCount = (user.badgeCount || 0) + 1;
    await user.save();

    // --- NEW: Badge Reward Email Notification ---
    await sendRewardEmail(user.name, user.email, `Elite Citizen Badge #${user.badgeCount}`);

    console.log(`\n--- 📧 SENDING REAL EMAIL TO: ${user.email} ---`);

    // Construct HTML Email
    let emailHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; border: 1px solid #eee; padding: 20px; border-radius: 15px;">
            <h2 style="color: #2563eb;">Urban Pulse - Impact Verification</h2>
            <p>Dear ${user.name || 'Citizen'},</p>
            <p>Regarding your report: <strong>${grievanceId}</strong></p>
            <p style="font-size: 18px; color: #059669; font-weight: bold; border-left: 4px solid #059669; padding-left: 10px;">
                "You are the best person for self motivation and every time!"
            </p>
    `;

    if (user.badgeCount === 3) {
        emailHtml += `
            <div style="background: #fefce8; padding: 20px; border-radius: 12px; border: 1px solid #fef08a; margin-top: 20px;">
                <h3 style="color: #854d0e; margin-top: 0; display: flex; align-items: center; gap: 10px;">
                    🏆 Milestone Reached: BEST PERSON AWARD
                </h3>
                <p>Congratulations! You have earned 3 badges for your civic contributions.</p>
                <p><strong>Digital Certificate:</strong> Awarded for Citizen Excellence 2026</p>
                <p><strong>Coupon Code:</strong> <span style="background: #fff; padding: 5px 10px; border: 1px dashed #854d0e; font-family: monospace; font-weight: bold;">URBAN-HERO-FREE</span></p>
                <hr style="border: 0; border-top: 1px solid #fde68a; margin: 15px 0;">
                <p style="margin-bottom: 0;"><strong>Physical Rewards:</strong> Your free <strong>Urban Pulse Shirt & Goggles</strong> are now claimable from your rewards portal!</p>
            </div>
        `;
    } else {
        emailHtml += `
            <p style="background: #f1f5f9; padding: 10px; border-radius: 8px; color: #475569;">
                Current Badge Count: <strong>${user.badgeCount}/3</strong> for your next milestone award.
            </p>
        `;
    }

    emailHtml += `
            <p style="color: #64748b; font-size: 12px; margin-top: 30px; border-top: 1px solid #eee; padding-top: 15px;">
                Urban Pulse: Building better cities together.
            </p>
        </div>
    `;

    /* 
    // Commented out to use the simpler frontend Gmail redirect approach as requested
    await sendEmail({
        email: user.email,
        subject: `Urban Pulse Impact: ${grievanceId} Verified`,
        message: `You are the best person for self motivation and every time! Your badge count is ${user.badgeCount}.`,
        html: emailHtml
    });
    */
};

// --- HELPER: AI Priority Calculation ---
const calculateInternalPriority = (category, description, locationContext = {}) => {
    let severity = 5;
    if (category === 'Pothole') severity = 7;
    if (category === 'Health Hazard') severity = 10;
    if (category === 'Drainage Leak') severity = 8;

    let multiplier = 1.0;
    if (description.toLowerCase().includes('hospital')) multiplier *= 2.0;
    if (description.toLowerCase().includes('school')) multiplier *= 1.8;
    if (description.toLowerCase().includes('highway') || description.toLowerCase().includes('main road')) multiplier *= 1.5;

    // Population impact mock
    const popFactor = 5;
    return severity * popFactor * multiplier;
};

// @desc    Submit a new grievance
// @route   POST /api/grievances
// @access  Public
export const submitGrievance = async (req, res) => {
    try {
        const {
            citizenName, email, phone, category, location,
            description, latitude, longitude, exifTimestamp,
            proofUrl, userId, assetId
        } = req.body;

        const grievanceId = 'GRV' + Math.floor(100000 + Math.random() * 900000);

        // 1. AI Department Assignment
        const categoryMap = {
            'Pothole': 'Roads',
            'Roads': 'Roads',
            'Drainage Leak': 'Water',
            'Water Supply': 'Water',
            'Water': 'Water',
            'Streetlight': 'Electricity',
            'Electricity': 'Electricity',
            'Garbage': 'Waste Management',
            'Sanitation': 'Waste Management',
            'Health Hazard': 'Public Health'
        };
        const department = categoryMap[category] || 'Other';

        // 2. AI Dynamic Priority
        const priorityScore = calculateInternalPriority(category, description);

        // 3. AI Root-Cause & Asset Tracking
        const aiAnalysis = {
            rootCause: "Awaiting deeper correlation...",
            structuralHealth: 100, // default
            historicalFrequency: 0,
            contextEscalation: priorityScore > 80
        };

        if (assetId) {
            const asset = await Asset.findOne({ assetId });
            if (asset) {
                asset.failureCount18Months += 1;
                asset.lastFailureDate = new Date();

                if (asset.failureCount18Months >= 10) {
                    asset.healthStatus = 'STRUCTURAL_FATIGUE';
                    asset.recommendation = 'FULL_REBUILD';
                } else if (asset.failureCount18Months >= 5) {
                    asset.healthStatus = 'DEGRADED';
                    asset.recommendation = 'PATCH';
                }

                aiAnalysis.historicalFrequency = asset.failureCount18Months;
                aiAnalysis.structuralHealth = asset.healthStatus === 'GOOD' ? 90 : (asset.healthStatus === 'DEGRADED' ? 40 : 10);
                aiAnalysis.rootCause = asset.healthStatus === 'STRUCTURAL_FATIGUE' ?
                    "Chronic failure history detected. Recommend full infrastructure rebuild." :
                    "AI correlating with local asset health profiles...";

                await asset.save();
            }
        }

        // Initial block data
        const blockData = createBlockData(null, 'Grievance Created', '0');

        const grievance = await Grievance.create({
            citizenName, email, phone, category, location,
            latitude, longitude, exifTimestamp, description,
            grievanceId, proofUrl, originalReporter: userId,
            lastHash: blockData.currentHash,
            department, priorityScore: priorityScore || 100, aiAnalysis,
            status: 'AI Classified',
            assetId
        });

        // Update block with actual ticket DB ID
        blockData.ticketId = grievance._id;

        await AuditLog.create(blockData);

        // Emit real-time update
        if (req.io) {
            req.io.emit('newGrievance', grievance);
        }

        res.status(201).json(grievance);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update grievance status with blockchain audit
// @route   PUT /api/grievances/:id/status
// @access  Private/Admin
export const updateGrievanceStatus = async (req, res) => {
    try {
        const { status, actionMetadata } = req.body;
        const grievance = await Grievance.findOne({ grievanceId: req.params.id });

        if (!grievance) {
            return res.status(404).json({ message: 'Grievance not found' });
        }

        const oldStatus = grievance.status;
        const action = `Status Changed: ${oldStatus} -> ${status}`;

        const blockData = createBlockData(grievance._id, action, grievance.lastHash);

        grievance.status = status;
        grievance.lastHash = blockData.currentHash;
        await grievance.save();

        await AuditLog.create({
            ...blockData,
            metadata: actionMetadata
        });

        // WhatsApp Notification & Learning Loop
        if (status === 'Resolved') {
            console.log(`\n--- WHATSAPP: Dear ${grievance.citizenName}, report ${grievance.grievanceId} is RESOLVED. ---`);
            console.log(`Please verify the fix at: http://localhost:5173/city-pulse`);

            // Award points to the worker
            if (grievance.assignedWorker) {
                const worker = await User.findById(grievance.assignedWorker);
                if (worker) {
                    worker.workerPoints = (worker.workerPoints || 0) + 100;
                    worker.tasksVerified = (worker.tasksVerified || 0) + 1;
                    worker.qualityScore = Math.min(100, (worker.qualityScore || 0) + 5);
                    await worker.save();
                    console.log(`[GAMIFICATION] Awarded 100 points to worker: ${worker.name}`);
                }
            }

            // FEEDBACK LOOP (Industrial Learning System)
            // If resolving a high-priority issue quickly, we reinforce the priority engine's weights.
            if (grievance.priorityScore > 100) {
                console.log(`[LEARNING_SYSTEM] Feedback reinforcement: Priority formula validated for ${grievance.category}.`);
                // In a production app, we would update a 'ModelWeight' collection here.
            }
        }

        res.json(grievance);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Verify fix by original reporter
// @route   PUT /api/grievances/:id/verify
// @access  Private
export const verifyFix = async (req, res) => {
    try {
        const grievance = await Grievance.findOne({ grievanceId: req.params.id });

        if (!grievance) {
            return res.status(404).json({ message: 'Grievance not found' });
        }

        // Logic for reporter verification
        const blockData = createBlockData(grievance._id, 'Fix Verified by Reporter', grievance.lastHash);

        grievance.status = 'Archived';
        grievance.lastHash = blockData.currentHash;
        await grievance.save();

        // --- NEW: Gamification System ---
        // Award credit points to the user who verified the fix
        if (grievance.originalReporter) {
            const user = await User.findById(grievance.originalReporter);
            if (user) {
                user.scoreCredit += 50; // Legacy score
                await user.save();

                // ADDITIVE: Purpose-Locked Civic Credits
                let civicCredits = await CivicCredits.findOne({ userId: user._id });
                if (!civicCredits) {
                    civicCredits = new CivicCredits({ userId: user._id });
                }

                const amount = 10; // 10 credits per verification
                civicCredits.totalCredits += amount;

                // Purpose Lock Split: 40% Tax, 30% Health, 30% Voting
                civicCredits.lockedCredits.taxUtility += amount * 0.4;
                civicCredits.lockedCredits.healthcare += amount * 0.3;
                civicCredits.lockedCredits.developmentVoting += amount * 0.3;

                civicCredits.history.push({
                    reason: 'Verified fix for complaint',
                    credits: amount,
                    complaintId: grievance.grievanceId
                });

                await civicCredits.save();

                // --- NEW: Badge & Reward Logic ---
                await handleCitizenRewards(user, grievance.grievanceId);
            }
        }
        // -------------------------------

        await AuditLog.create(blockData);

        res.json({ message: 'Grievance archived successfully and credit points awarded', grievance });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get nearby verified users for validation
// @route   GET /api/grievances/:id/nearby-validators
// @access  Private
export const getNearbyValidators = async (req, res) => {
    try {
        const grievance = await Grievance.findOne({ grievanceId: req.params.id });
        if (!grievance) return res.status(404).json({ message: 'Grievance not found' });

        // Mocking neighbor search based on lat/long
        // In a real MongoDB setup, you'd use $near or $geoWithin
        const neighbors = await User.find({
            isVerified: true,
            _id: { $ne: grievance.originalReporter }
        }).limit(5);

        res.json(neighbors);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all grievances
// @route   GET /api/grievances
// @access  Public
export const getGrievances = async (req, res) => {
    try {
        const grievances = await Grievance.find({}).sort({ createdAt: -1 });
        res.json(grievances);
    } catch (error) {
        console.error("GET_GRIEVANCES_ERROR:", error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get grievance by ID
// @route   GET /api/grievances/:id
// @access  Public
export const getGrievanceById = async (req, res) => {
    try {
        const grievance = await Grievance.findOne({ grievanceId: req.params.id });
        if (grievance) {
            res.json(grievance);
        } else {
            res.status(404).json({ message: 'Grievance not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
// @desc    Get Department-wise metrics
// @route   GET /api/grievances/stats/departments
// @access  Private/Admin
export const getDepartmentStats = async (req, res) => {
    try {
        const stats = await Grievance.aggregate([
            {
                $group: {
                    _id: "$department",
                    count: { $sum: 1 },
                    resolved: {
                        $sum: { $cond: [{ $eq: ["$status", "Resolved"] }, 1, 0] }
                    },
                    pending: {
                        $sum: { $cond: [{ $eq: ["$status", "Reported"] }, 1, 0] }
                    }
                }
            }
        ]);
        res.json(stats);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Review Resolution (Citizen Feedback Loop)
// @route   PUT /api/grievances/:id/review
// @access  Private
export const reviewResolution = async (req, res) => {
    try {
        const { satisfaction, comment } = req.body;
        const grievance = await Grievance.findOne({ grievanceId: req.params.id });

        if (!grievance) return res.status(404).json({ message: "Grievance not found" });

        grievance.citizenFeedback = satisfaction ? 'Resolved' : 'Not Resolved';
        grievance.feedbackComment = comment;

        if (satisfaction) {
            grievance.status = 'Archived';

            // --- Gamification System (Credit Awarding) ---
            if (grievance.originalReporter) {
                const user = await User.findById(grievance.originalReporter);
                if (user) {
                    user.scoreCredit += 50; // Legacy score
                    await user.save();

                    // ADDITIVE: Purpose-Locked Civic Credits
                    let civicCredits = await CivicCredits.findOne({ userId: user._id });
                    if (!civicCredits) {
                        civicCredits = new CivicCredits({ userId: user._id });
                    }

                    const amount = 10; // 10 credits per verification
                    civicCredits.totalCredits += amount;

                    // Purpose Lock Split: 40% Tax, 30% Health, 30% Voting
                    civicCredits.lockedCredits.taxUtility += amount * 0.4;
                    civicCredits.lockedCredits.healthcare += amount * 0.3;
                    civicCredits.lockedCredits.developmentVoting += amount * 0.3;

                    civicCredits.history.push({
                        reason: 'Verified fix for complaint (Review Loop)',
                        credits: amount,
                        complaintId: grievance.grievanceId
                    });

                    await civicCredits.save();

                    // --- NEW: Badge & Reward Logic ---
                    handleCitizenRewards(user, grievance.grievanceId);
                }
            }
            // ----------------------------------------------
        } else {
            // Re-open if citizen rejects the fix
            grievance.status = 'Reported';
            grievance.priorityScore += 50; // Bump priority due to failed fix
        }

        await grievance.save();
        res.json({ message: "Review processed", grievance });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

// @desc    Assign worker to grievance
// @route   PUT /api/grievances/:id/assign
// @access  Private/Worker
export const assignTask = async (req, res) => {
    try {
        const { workerId } = req.body;
        const grievance = await Grievance.findOne({ grievanceId: req.params.id });

        if (!grievance) return res.status(404).json({ message: "Grievance not found" });

        grievance.status = 'Worker Assigned';
        grievance.assignedWorker = workerId;
        grievance.assignedAt = new Date();

        const blockData = createBlockData(grievance._id, `Worker Assigned: ${workerId}`, grievance.lastHash);
        grievance.lastHash = blockData.currentHash;

        await grievance.save();
        await AuditLog.create(blockData);

        res.json({ message: "Task assigned successfully", grievance });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Submit resolution proof
// @route   PUT /api/grievances/:id/resolve
// @access  Private/Worker
export const submitResolution = async (req, res) => {
    try {
        const { resolutionProofUrl, latitude, longitude } = req.body;
        const grievance = await Grievance.findOne({ grievanceId: req.params.id });

        if (!grievance) return res.status(404).json({ message: "Grievance not found" });

        // --- NEW: AI Automated Verification (CV + Geofencing) ---
        const verification = await verifyWork(
            resolutionProofUrl,
            latitude,
            longitude,
            grievance.latitude || latitude, // Fallback to provided if task has no lat
            grievance.longitude || longitude
        );

        if (!verification.success) {
            return res.status(400).json({
                message: verification.message,
                verificationDetails: verification
            });
        }
        // -------------------------------------------------------

        grievance.status = 'Resolved'; // Promoted from 'Work Under Review' if AI pass
        grievance.resolutionProofUrl = resolutionProofUrl;
        grievance.completedAt = new Date();

        const blockData = createBlockData(grievance._id, `Resolution Verified by AI Superior (Conf: ${verification.confidence}%)`, grievance.lastHash);
        grievance.lastHash = blockData.currentHash;

        await grievance.save();
        await AuditLog.create(blockData);

        // Award points immediately on AI pass
        if (grievance.assignedWorker) {
            const worker = await User.findById(grievance.assignedWorker);
            if (worker) {
                worker.workerPoints = (worker.workerPoints || 0) + 100;
                worker.tasksVerified = (worker.tasksVerified || 0) + 1;
                worker.qualityScore = Math.min(100, (worker.qualityScore || 0) + 5);
                await worker.save();
            }
        }

        res.json({
            message: "Resolution verified by AI! Points awarded.",
            confidence: verification.confidence,
            grievance
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
