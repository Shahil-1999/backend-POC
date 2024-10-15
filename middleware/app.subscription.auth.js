const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const subscriptionCheck = async function (decode) {
    try {
        // Fetch the user's subscription details using the user ID from JWT token
        const subscription = await prisma.subscription.findFirst({
            where: {
                userId: decode.id,
                status: 'active',
            }
        });

        // Check if subscription exists and is still valid
        if (!subscription || new Date() > new Date(subscription.endDate)) {
            // Subscription has either expired or doesn't exist
            return { isValid: false, credentials: { id: decode.id, scope: decode.scope }, message: "Subscription expired" };
        }

        // If subscription is valid, continue
        return { isValid: true, credentials: { id: decode.id, scope: decode.scope } };
    } catch (error) {
        console.log("Subscription validation error:", error);
        return { isValid: false, credentials: { id: decode.id, scope: decode.scope }, message: "Error validating subscription" };
    }
};

module.exports = subscriptionCheck;
