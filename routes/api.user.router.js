
const controller = require('../controller/app.controller')
const validation = require('../validations/app.validation')
const plugins = require("../plugins/app.plugins")
const subscriptionCheck = require('../middleware/app.subscription.auth')






let routes = [

    {
        method: 'GET',
        path: '/test',
        options: {
            handler: controller.test,
            auth: false,
        },
    },

    // User can add yourself
    {
        method: 'POST',
        path: '/add_user',
        options: {
            handler: controller.addUser,
            auth: false,
            description: 'User Add (Token not required for this endpoint)',
            notes: 'User can Add themselves',
            tags: ['api'],

            validate: validation.userAddValidation,
            plugins: plugins.userAddPlugin,


        },


    },
    

    // User can login their account 

    {
        method: 'POST',
        path: '/user_login',

        options: {
            pre: [{ method: subscriptionCheck }],
            handler: controller.userLogin,
            auth: false,
            description: 'User can Logged into their account (Token not required for this endpoint)',
            notes: 'User can Logged into their account and generate their respective tokens',
            tags: ['api'],
            validate: validation.userLoginValidation,
            plugins: plugins.userAddPlugin
        },

    },

    // User can forget their password 

    {
        method: 'POST',
        path: '/forget_password',

        options: {

            handler: controller.forgetPassword,
            auth: false,
            description: 'forget your Password',
            notes: 'User can forget your password',
            tags: ['api'],

            validate: validation.forgetPasswordValidation,
            plugins: plugins.forgetPasswordPlugin,
        },

    },




]


module.exports = routes






