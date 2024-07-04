
const controller = require('../controller/app.controller')
const validation = require('../validations/app.validation')
const plugins = require("../plugins/app.plugins")


let routes = [

    // User can retrive himself

    {
        method: 'GET',
        path: '/user_details/{id}',

        options: {
            handler: controller.getUserById,
            auth: 'jwt',
            description: 'User Details',
            tags: ['api'],
            notes: ['User can see their details by entering respective id which is in token'],
            validate: validation.getUserDetailValidation,
            plugins: plugins.getUserDetailsPlugin

        }

    },


    // User can edit their post

    {
        method: 'PUT',
        path: '/edit_own_post/{userDetailsId}/{postId}',

        options: {
            handler: controller.editPost,
            auth: 'jwt',
            description: 'Post Edit',
            tags: ['api'],
            notes: ['User can edit their post by entering respective id which is in token'],
            validate: validation.editpostValidation,
            plugins: plugins.editPostPlugin

        }

    },


    // User Can Get Own Post
    {
        method: 'GET',
        path: '/read_own_post/{userDetailsId}',

        options: {
            handler: controller.readOwnPost,
            auth: 'jwt',
            description: 'User Post',
            tags: ['api'],
            notes: ['User can see their Post by entering respective userDetailsId which is in token'],
            validate: validation.getOwnPostValidation,
            plugins: plugins.getOwnPostPlugin

        }

    },

    // User can post their post 

    {
        method: 'POST',
        path: '/add_post',
        options: {
            handler: controller.addPost,
            auth: 'jwt',
            description: 'Get add their Posts',
            notes: ['User can add Posts like in instagram'],
            tags: ['api'],
            validate: validation.addPostValidation,
            plugins: plugins.addPostPlugin

        }
    },

    // User can retrive the posts

    {
        method: 'GET',
        path: '/read_all_post/{userDetailsId}',

        options: {
            handler: controller.readAllPost,
            auth: 'jwt',
            description: 'Get all Posts',
            tags: ['api'],
            notes: ['User can Get all Posts'],
            validate: validation.getAllPostValidation,
            plugins: plugins.getAllPostPlugin
        }

    },

    // User can delete their posts

    {
        method: 'DELETE',
        path: '/delete_post/{userDetailsId}/{postId}',
        options: {
            handler: controller.deletePost,
            auth: 'jwt',
            description: 'Delete Post',
            tags: ['api'],
            notes: ['User can delete their own Posts'],
            validate: validation.postDeleteValidation,
            plugins: plugins.postDeleteplugin
        },

    },

    // User can add comments in post

    {
        method: 'POST',
        path: '/add_comments_on_any_post',
        options: {
            handler: controller.addCommentsOnAnyPost,
            auth: 'jwt',
            description: 'Add Comments on Post',
            tags: ['api'],
            notes: ['User can Add Comments on any Post'],
            validate: validation.addCommentsOnAnyPostValidation,
            plugins: plugins.addCommentsOnAnyPostPlugin

        }

    },

    // User can read post's comment

    {
        method: 'GET',
        path: '/get_comments_on_post/{userDetailsId}',

        options: {
            handler: controller.readCommentsOnPost,
            auth: 'jwt',
            description: 'Get Comments',
            tags: ['api'],
            notes: ['User can retreive all comments in any post'],
            validate: validation.getCommentsOnPostValidation,
            plugins: plugins.getCommentsOnPostPlugin
        },

    },

    // User can delete their comments

    {
        method: 'DELETE',
        path: '/delete_own_post_comment/{userDetailsId}/{commentsId}',
        options: {
            handler: controller.deleteOwnPostComment,
            auth: 'jwt',
            description: 'Delete Comments',
            tags: ['api'],
            notes: ['User can delete their own comments'],
            validate: validation.deleteOwnPostCommentsValidation,
            plugins: plugins.deleteOwnPostCommentsPlugin
        },

    },
    // User can delete own comments in any post

    {
        method: 'DELETE',
        path: '/delete_own_comments_in_any_post/{userDetailsId}/{commentsId}',
        options: {
            handler: controller.deleteOwnCommentsInAnyPost,
            auth: 'jwt',
            description: 'Delete Comments',
            tags: ['api'],
            notes: ['User can delete their own comments'],
            validate: validation.deleteOwnCommentsInAnyPostValidation,
            plugins: plugins.deleteOwnCommentsInAnyPostPlugin

        },

    },

    // User can delete their account

    {
        method: 'DELETE',
        path: '/delete_user_acct/{userDetailsId}',

        options: {
            handler: controller.deleteAccount,
            auth: 'jwt',
            description: 'User can Delete Their Account',
            notes: ['User can Delete Their Account'],
            tags: ['api'],
            validate: validation.userAccountDeleteValidation,
            plugins: plugins.userDeletionPlugin
        },

    },

    // user can edit their comments
    {
        method: 'PUT',
        path: '/edit_own_comment/{userDetailsId}/{postId}/{commentsId}',

        options: {
            handler: controller.editOwnComments,
            auth: 'jwt',
            description: 'comment Edit',
            tags: ['api'],
            notes: ['User can edit their comment by entering respective id which is in token'],
            validate: validation.editOwnCommentValidation,
            plugins: plugins.editOwnCommentPlugin

        }
    },

    // User can Reset their Password 

    {
        method: 'PATCH',
        path: '/reset_password/{userDetailsId}/{token}',
        options: {
            handler: controller.resetPassword,
            auth: 'jwt',
            description: 'Reset your Password',
            notes: 'User can change their password',
            tags: ['api'],

            validate: validation.resetPasswordValidation,
            plugins: plugins.resetPasswordPlugin,


        },

    },

    // User can add their profile image
    {
        method: 'POST',
        path: '/profile_img/upload',
        options: {
            auth: 'jwt',
            handler: controller.fileUpload,
            description: 'Upload Profile Image (File size should not be more then 1mb',
            notes: 'User can upload his profile image',
            tags: ['api'],

            validate: validation.uploadProfileImageValidation,
            plugins: plugins.uploadProfileImagPlugin,
            payload: {
                output: 'stream',
                parse: true,
                multipart: true
            },
            
        },
    },

        // User can get their profile image

    {
        method: 'GET',
        path: '/get_profile_image/{userDetailsId}',
        options: {
            auth: 'jwt',
            description: 'Get profile iamge',
            tags: ['api'],
            notes: ['User can Get profile image'],
            handler: controller.readFile,
            validate: validation.getImageValidation,
            plugins: plugins.getUserImagePlugin,
        }
    }

]


module.exports = routes
