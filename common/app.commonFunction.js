const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function isUserExist(req) {
    const commonIsUserExist = await prisma.userDetails.findFirst({
        where: {
            email: req.payload.email,
            is_deleted: false
        }
    })
    return commonIsUserExist

}
module.exports = {
    isUserExist
}
