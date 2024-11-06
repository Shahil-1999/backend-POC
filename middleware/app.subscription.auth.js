const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const subscriptionCheck = async function (decode) {
    try {
        const subscription = await prisma.subscription.findFirst({
            where: {
                userId: decode.id,
                status: 'active',
            }
        });

        if (!subscription || new Date() > new Date(subscription.endDate)) {
            return { isValid: false, credentials: { id: decode.id, scope: decode.scope }, message: "Subscription expired" };
        }

        return { isValid: true, credentials: { id: decode.id, scope: decode.scope } };
    } catch (error) {
        console.log("Subscription validation error:", error);
        return { isValid: false, credentials: { id: decode.id, scope: decode.scope }, message: "Error validating subscription" };
    }
};

module.exports = subscriptionCheck;
