// const { jwtDecode } = require('jwt-decode');
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const JWTvalidate = async function (decode) {

    try {

        const user = await prisma.userDetails.findUnique({
            where: {
                id: decode.id,
                is_deleted: false
            }

        })
        if (!user) {
            return { isValid: false };
        }
        else {
            return { isValid: true, credentials: { id: user.id, scope: user.role } };
        }
    } catch (error) {
        console.log("error", error);
    }
};




module.exports = JWTvalidate

