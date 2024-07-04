// const { jwtDecode } = require('jwt-decode');
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const JWTvalidate = async function (decode) {

    try {
        // let token = request.auth.token
        // console.log(jwtDecode(token));
        // console.log(decode);
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
            return { isValid: true };
        }
    } catch (error) {
        console.log("errorrrrr", error);
    }
};




module.exports = JWTvalidate

