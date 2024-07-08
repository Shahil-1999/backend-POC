const joi = require("joi")

const getUserDetailValidation = {
    params: joi.object({
        id: joi.string().required().description('the id of the user')
    }),
    failAction: (req, h, err) => {
        console.log(`Error occured in : ${err.details[0].context.label}\nError description : ${err.details[0].message}`)
        throw err;
    }
}

const addPostValidation = {
    payload: joi.object({
        title: joi.string().required().description('title of the post'),
        post_description: joi.string().required().description('post description'),
        userDetailsId: joi.number().required().description('the id of the user (userDetailsId)')
    }),
    failAction: (req, h, err) => {
        console.log(`Error occured in : ${err.details[0].context.label}\nError description : ${err.details[0].message}`)
        throw err
    }
}

const getAllPostValidation = {
    params: joi.object({
        userDetailsId: joi.string().required().description('the id of the user (userDetailsId)'),

    }),
    failAction: (req, h, err) => {
        console.log(`Error occured in : ${err.details[0].context.label}\nError description : ${err.details[0].message}`)
        throw err
    }
}

const postDeleteValidation = {
    params: joi.object({
        userDetailsId: joi.string().required().description('the id of the user (userDetailsId)'),
        postId: joi.string().required().description('the id of the Post (postId)')

    }),
    failAction: (req, h, err) => {
        console.log(`Error occured in : ${err.details[0].context.label}\nError description : ${err.details[0].message}`)
        throw err;
    }
}

const addCommentsOnAnyPostValidation = {
    payload: joi.object({
        comments: joi.string().required().description('post comments'),
        postID: joi.number().required().description('the id of the Post (postId)'),
        userDetailsId: joi.number().required().description('the id of the user (userDetailsId)')
    }),
    failAction: (req, h, err) => {
        console.log(`Error occured in : ${err.details[0].context.label}\nError description : ${err.details[0].message}`)
        throw err
    }
}

const getCommentsOnPostValidation = {
    params: joi.object({
        userDetailsId: joi.string().required().description('the id of the user (userDetailsId)'),

    }),
    failAction: (req, h, err) => {
        console.log(`Error occured in : ${err.details[0].context.label}\nError description : ${err.details[0].message}`)
        throw err;
    }
}

const deleteOwnPostCommentsValidation = {
    params: joi.object({
        userDetailsId: joi.string().required().description('the id of the user (userDetailsId)'),
        commentsId: joi.string().required().description('the id of the Post (commentsId)')

    }),
    failAction: (req, h, err) => {
        console.log(`Error occured in : ${err.details[0].context.label}\nError description : ${err.details[0].message}`)
        throw err;
    }
}

const userAddValidation = {
    payload: joi.object({
        name: joi.string().required().description('the name of the user'),
        email: joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required().description('user email'),
        password: joi.string().min(8).max(16).required().description('password of the user'),
        phone_number: joi.string().required().description('phone number of the user'),
        gender: joi.string().required().description('gender of the user'),
        role: joi.string().required().description("user role")
    }),
    failAction: (req, h, err) => {

        console.log(`Error occured in : ${err.details[0].context.label}\nError description : ${err.details[0].message}`);
        throw err
    }
}

const userLoginValidation = {
    payload: joi.object({

        email: joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required().description('user email'),
        password: joi.string().required().description('user password')

    }),
    failAction: (req, h, err) => {
        console.log(`Error occured in : ${err.details[0].context.label}\nError description : ${err.details[0].message}`)
        throw err;
    }
}

const userAccountDeleteValidation = {
    params: joi.object({
        userDetailsId: joi.string().required().description('the id of the user (userDetailsId)'),

    }),
    failAction: (req, h, err) => {
        console.log(`Error occured in : ${err.details[0].context.label}\nError description : ${err.details[0].message}`)
        throw err;
    }
}

const resetPasswordValidation = {
    params: joi.object({
        userDetailsId: joi.number().required().description('the id of the user (userDetailsId)'),
        token: joi.string().required().description('the id of the Post (token)'),
    }),
    payload: joi.object({
        password: joi.string().required().description('Enter Your New Password'),

    }),
    failAction: (req, h, err) => {
        console.log(`Error occured in : ${err.details[0].context.label}\nError description : ${err.details[0].message}`)
        throw err;
    }
}

const forgetPasswordValidation = {
    payload: joi.object({
        email: joi.string().email().required().description('user email'),

    }),
    failAction: (req, h, err) => {
        console.log(`Error occured in : ${err.details[0].context.label}\nError description : ${err.details[0].message}`)
        throw err;
    }
}

const getOwnPostValidation = {
    params: joi.object({
        userDetailsId: joi.string().required().description('the id of the user (userDetailsId)')

    }),
    failAction: (req, h, err) => {
        console.log(`Error occured in : ${err.details[0].context.label}\nError description : ${err.details[0].message}`)
        throw err;
    }

}

const editpostValidation = {

    params: joi.object({
        userDetailsId: joi.number().required().description('the id of the user (userDetailsId)'),
        postId: joi.string().required().description('the id of the Post (PostId)')

    }),

    payload: joi.object({
        title: joi.string().optional().description('Post Title'),
        post_description: joi.string().optional().description('user description'),

    }),
    failAction: (req, h, err) => {
        console.log(`Error occured in : ${err.details[0].context.label}\nError description : ${err.details[0].message}`)
        throw err
    }

}

const editOwnCommentValidation = {
    params: joi.object({
        userDetailsId: joi.number().required().description('the id of the user (userDetailsId)'),
        postId: joi.number().required().description('the id of the post (postId)'),
        commentsId: joi.string().required().description('the id of the comment (commentsId)')

    }),

    payload: joi.object({
        comments: joi.string().required().description('add post comments')

    }),
    failAction: (req, h, err) => {
        console.log(`Error occured in : ${err.details[0].context.label}\nError description : ${err.details[0].message}`)
        throw err
    }
}

const userDeletionValidation = {
    params: joi.object({
        id: joi.number().required().description('the id of the user (userDetailsId)'),
    }),



    failAction: (req, h, err) => {
        console.log(`Error occured in : ${err.details[0].context.label}\nError description : ${err.details[0].message}`)
        throw err
    }

}

const deleteOwnCommentsInAnyPostValidation = {
    params: joi.object({
        userDetailsId: joi.string().required().description('the id of the user (userDetailsId)'),

        commentsId: joi.string().required().description('the id of the comment (commentsId)')

    }),


    failAction: (req, h, err) => {
        console.log(`Error occured in : ${err.details[0].context.label}\nError description : ${err.details[0].message}`)
        throw err
    }
}

const uploadProfileImageValidation = {

    payload: joi.object({
        userDetailsId: joi.number().required().description('the id of the user (userDetailsId)'),
        file: joi.any()
        .meta({ swaggerType: 'file' })
        .required()
        .description('File to upload only jpg, jpeg, png')
        .custom((value, helpers) => {
            if (value.hapi.filename.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG)$/)) {
                return value;
            }
            return helpers.error('any.invalid');
        }),



        // filename: joi.string().required().description('filename'),
        // fileData: joi.binary().required().description('fileData'),

    }),
    failAction: (req, h, err) => {
        console.log(`Error occured in : ${err.details[0].context.label}\nError description : ${err.details[0].message}`)
        throw err;
    }
}

const getImageValidation = {
    params: joi.object({
        userDetailsId: joi.string().required().description('the id of the user (userDetailsId)'),

    }),
    failAction: (req, h, err) => {
        console.log(`Error occured in : ${err.details[0].context.label}\nError description : ${err.details[0].message}`)
        throw err
    }
}

const getAllImageValidation = {
    params: joi.object({
        userDetailsId: joi.string().required().description('the id of the user (userDetailsId)'),

    }),
    failAction: (req, h, err) => {
        console.log(`Error occured in : ${err.details[0].context.label}\nError description : ${err.details[0].message}`)
        throw err
    }
}

const getAllUserValidation = {
    params: joi.object({
        id: joi.string().required().description('the id of the user (id)'),

    }),
    failAction: (req, h, err) => {
        console.log(`Error occured in : ${err.details[0].context.label}\nError description : ${err.details[0].message}`)
        throw err
    }
}


module.exports = {
    getUserDetailValidation,
    addPostValidation,
    postDeleteValidation,
    addCommentsOnAnyPostValidation,
    getCommentsOnPostValidation,
    deleteOwnPostCommentsValidation,
    userAddValidation,
    userLoginValidation,
    userAccountDeleteValidation,
    resetPasswordValidation,
    forgetPasswordValidation,
    getOwnPostValidation,
    editpostValidation,
    editOwnCommentValidation,
    userDeletionValidation,
    deleteOwnCommentsInAnyPostValidation,
    uploadProfileImageValidation,
    getAllPostValidation,
    getImageValidation,
    getAllImageValidation,
    getAllUserValidation
}