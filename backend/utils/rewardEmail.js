import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Generates a random unique coupon code in format UP-XXXXXX
 */
const generateCoupon = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return `UP-${code}`;
};

/**
 * Sends a Reward Email to the citizen
 * @param {string} citizenName 
 * @param {string} citizenEmail 
 * @param {string} badgeName 
 */
export const sendRewardEmail = async (citizenName, citizenEmail, badgeName) => {
    // Fail fast if credentials missing
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.log(`[SKIPPED] Reward Email for ${citizenName} - Credentials missing in .env`);
        return { success: false, message: "Email configuration missing" };
    }

    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const couponCode = generateCoupon();
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + 7);
        const formattedDate = expiryDate.toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });

        const mailOptions = {
            from: `"Urban Pulse Rewards" <${process.env.EMAIL_USER}>`,
            to: citizenEmail,
            subject: `🏆 Congratulations! You've Earned the ${badgeName}!`,
            html: `
                <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; color: #1a202c;">
                    <div style="background-color: #2563eb; padding: 30px; text-align: center; color: white;">
                        <h1 style="margin: 0; font-size: 24px;">New Badge Earned!</h1>
                    </div>
                    <div style="padding: 30px; line-height: 1.6;">
                        <p style="font-size: 18px; margin-top: 0;">Hi <strong>${citizenName}</strong>,</p>
                        <p>We are thrilled to inform you that you have earned the <strong>${badgeName}</strong> for your outstanding civic contributions!</p>
                        <p style="background-color: #f0fdf4; border-left: 4px solid #22c55e; padding: 15px; color: #166534; font-weight: 500;">
                            "You are the best person for self motivation and every time!"
                        </p>
                        
                        <div style="margin: 30px 0; padding: 25px; background-color: #f8fafc; border-radius: 10px; border: 1px dashed #cbd5e1; text-align: center;">
                            <h2 style="margin: 0; color: #1e40af; font-size: 20px;">🎁 Special Reward: FREE SHIRT</h2>
                            <p style="font-size: 14px; color: #64748b;">(100% Discount Single Use)</p>
                            <div style="margin: 20px 0; padding: 15px; background: white; border-radius: 8px; font-family: monospace; font-size: 24px; font-weight: bold; color: #2563eb; letter-spacing: 2px;">
                                ${couponCode}
                            </div>
                            <p style="margin: 0; color: #ef4444; font-size: 13px; font-weight: bold;">
                                EXPIRES ON: ${formattedDate}
                            </p>
                        </div>
                        
                        <p style="font-size: 14px; color: #475569;">
                            <strong>Instruction:</strong> Please show this email at any Urban Pulse Partner Shop to redeem your reward.
                        </p>
                    </div>
                    <div style="background-color: #f1f5f9; padding: 20px; text-align: center; font-size: 12px; color: #94a3b8;">
                        <p style="margin: 0;">&copy; 2026 Urban Pulse Civic Engagement Program</p>
                        <p style="margin: 5px 0 0;">Building better cities together.</p>
                    </div>
                </div>
            `
        };

        const info = await transporter.sendMail(mailOptions);
        console.log(`✅ Reward Email Sent: ${info.messageId}`);
        return { success: true, couponCode };
    } catch (error) {
        console.error(`❌ Failed to send reward email: ${error.message}`);
        // Fallback log as requested
        console.log(`[FALLBACK] Reward Earned by ${citizenName} (${citizenEmail}): ${badgeName}`);
        return { success: false, error: error.message };
    }
};
