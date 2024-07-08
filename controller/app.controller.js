const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const randomstring = require("randomstring")
const nodemailer = require("nodemailer")
require('dotenv').config()
const SECRET_KEY = process.env.SECRET_KEY;
const commonFunction = require("../common/app.commonFunction")
const fs = require('fs');
const path = require('path');


async function test(req, res) {
    return res.response({
        status: true,
        msg: "Test is running"
    })
}

async function addUser(req, res) {


    try {

        const isUserExist = await commonFunction.isUserExist(req)


        if (isUserExist) {
            return res.response({
                status: false,
                msg: "user already exist",
            })
        }

        else {

            req.payload.password = bcrypt.hashSync(req.payload.password, bcrypt.genSaltSync(10));



            let user = await prisma.userDetails.create({
                data: req.payload
            })
            // console.log("userrrrrr", user);
            return res.response({
                status: true,
                msg: "user add sucessfully",
                data: { user }
            })
        }

    } catch (error) {
        console.log(error);
        return res.response({
            status: false,
            msg: error
        })
    }

}

async function userLogin(req, res) {
    try {

        const isUserExist = await commonFunction.isUserExist(req)

        if (!isUserExist) {
            return res.response({
                status: false,
                msg: "user dosent exist"
            })
        } else {
            let hashPassword = isUserExist.password;
            if (bcrypt.compareSync(req.payload.password, hashPassword)) {
                const token = jwt.sign({
                    id: isUserExist.id,
                    user_email: isUserExist.email,
                    scope: isUserExist.role
                }, SECRET_KEY, {
                    expiresIn: '1y'
                })
                return res.response({
                    status: true,
                    message: "User logged in and token generated Sucessfully",
                    data: {
                        userName: isUserExist.name,
                        token,
                        userDetailsId: isUserExist.id,
                        role: isUserExist.role
                    }
                })
            } else {
                return res.response({
                    status: false,
                    message: "Password not matched"
                })

            }
        }


    } catch (error) {
        console.log(error);
        return res.response({
            msg: "error", error
        })
    }
}

async function getUserById(req, res) {
    try {

        const user_data = await prisma.userDetails.findFirst({
            where: {
                id: +req.params.id, //whatever you send in params it consider as string thats wh we downcast string to number
                is_deleted: false
            },

        })
        if (!user_data) {
            return res.response({
                status: false,
                message: 'user dosent exist'
            })

        } else {
            const { credentials } = req.auth

            if (credentials.id === +req.params.id) {
                return res.response({
                    status: true,
                    message: 'user data fetch sucessfully',
                    data: user_data
                })
            } else {
                return res.response({
                    status: false,
                    msg: "Please Check Your UserDetailsId (token's id and UserDetailsId is mismatched)"
                })
            }
        }

    } catch (error) {
        console.log(error);
        return res.response({
            status: false,
            msg: error
        })
    }

}

async function getAllUser(req, res) {
    try {

        const user_data = await prisma.userDetails.findFirst({
            where: {
                id: +req.params.id,
                is_deleted: false
            },

        })
        if (!user_data) {
            return res.response({
                status: false,
                message: 'No user exist'
            })

        } else {

            const getAllData = await prisma.userDetails.findMany({
                where:{
                    is_deleted: false
                }
            })
            const { credentials } = req.auth
            // console.log(user_data);
        
            if (credentials.id === +req.params.id) {
                return res.response({
                    status: true,
                    message: 'user data fetch sucessfully',
                    data: getAllData
                })
            } else {
                return res.response({
                    status: false,
                    msg: "Please Check Your UserDetailsId (token's id and UserDetailsId is mismatched)"
                })
            }
        }

    } catch (error) {
        console.log(error);
        return res.response({
            status: false,
            msg: error
        })
    }

}

async function addPost(req, res) {


    try {


        let isUserExist = await prisma.userDetails.findFirst({
            where: {
                id: req.payload.userDetailsId,
                is_deleted: false
            }
        })
        // console.log(isUserExist);

        if (!isUserExist) {
            return res.response({
                status: false,
                msg: "user dosent exist ",
            })
        } else {
            req.payload.user_name = isUserExist.name
            // console.log(req.payload, isUserExist);



            let posts = await prisma.posts.create({
                data: req.payload
            })


            // console.log("payloadddddddd", req.payload);
            // console.log(cred);
            // console.log("aaaa",credentials.id, "bbbb",req.payload.userDetailsId);
            const { credentials } = req.auth
            if (credentials.id === req.payload.userDetailsId) {
                return res.response({
                    status: true,
                    msg: "posts added sucessfully",
                    data: { posts }
                })
            } else {
                return res.response({
                    status: false,
                    msg: "Please Check Your UserDetailsId (token's id and UserDetailsId is mismatched)"
                })
            }
        }


    } catch (error) {
        console.log(error);
        return res.response({
            status: false,
            msg: error
        })
    }

}

async function addCommentsOnAnyPost(req, res) {

    try {

        let isUserExist = await prisma.userDetails.findFirst({
            where: {
                id: req.payload.userDetailsId,
                is_deleted: false
            }
        })
        if (!isUserExist) {
            return res.response({
                status: false,
                msg: "user dosent exist "
            })

        } else {

            let isPostExist = await prisma.posts.findUnique({
                where: {
                    id: req.payload.postID,
                    is_deleted: false
                }
            })
            if (!isPostExist) {
                return res.response({
                    status: false,
                    msg: "post dosent exist "
                })

            } else {

                req.payload.user_name = isUserExist.name



                let comments = await prisma.comments.create({
                    data: req.payload
                })



                const { credentials } = req.auth
                // console.log(credentials.id, req.payload.userDetailsId);
                if (credentials.id === req.payload.userDetailsId) {

                    return res.response({
                        status: true,
                        msg: "Comments add sucessfully",
                        data: comments
                    })
                } else {
                    return res.response({
                        status: false,
                        msg: "Please Check Your UserDetailsId (token's id and UserDetailsId is mismatched)"
                    })
                }

            }
        }


    } catch (error) {
        console.log(error);
        return res.response({
            status: false,
            msg: error
        })
    }

}

async function readCommentsOnPost(req, res) {
    try {
        let isUserExist = await prisma.userDetails.findFirst({
            where: {
                id: +req.params.userDetailsId,
                is_deleted: false
            }
        })
        if (!isUserExist) {
            return res.response({
                status: false,
                msg: "user dosent exist "
            })

        } else {




            const comments_on_post = await prisma.comments.findMany({
                where: {
                    userDetailsId: +req.params.userDetailsId,
                    is_deleted: false
                },
                include: {
                    post: true,
                    userDetails: true

                }

            })
            // const { credentials } = req.auth
            // if (credentials.id === req.params.userDetailsId) {
            //     // console.log(credentials.id,  req.params.userDetailsId);
            return res.response({
                status: true,
                message: 'all comments fetch sucessfully',
                data: { comments_on_post }
            })
            // } else {
            //     return res.response({
            //         status: false,
            //         msg: "Please Check Your UserDetailsId (token's id and UserDetailsId is mismatched)"
            //     })
            // }





        }
    } catch (error) {
        console.log(error);
        return res.response({
            status: false,
            msg: error
        })

    }


}

async function readAllPost(req, res) {
    try {

        const isUserExist = await prisma.userDetails.findFirst({
            where: {
                id: +req.params.userDetailsId,
                is_deleted: false
            }
        })


        if (isUserExist) {




            const readAllPosts = await prisma.posts.findMany({
                where: {
                    is_deleted: false
                },
                include: {
                    comments: true
                }
            })



            return res.response({
                status: true,
                message: 'all post fetch sucessfully',
                data: { readAllPosts }
            })
        } else {
            return res.response({
                status: false,
                msg: "User Doesnt exist"
            })
        }



    } catch (error) {
        console.log(error);
        return res.response({
            status: false,
            msg: error
        })

    }

}

async function editPost(req, res) {


    try {


        let isUserExist = await prisma.userDetails.findFirst({
            where: {
                id: req.params.userDetailsId,
                is_deleted: false
            }
        })

        if (!isUserExist) {
            return res.response({
                status: false,
                msg: "user dosent exist ",
            })
        } else {

            let postExist = await prisma.posts.findUnique({
                where: {
                    id: +req.params.postId,
                    is_deleted: false
                }
            })

            if (postExist) {
                let post = await prisma.posts.update({
                    where: {
                        id: +req.params.postId,
                        is_deleted: false
                    },
                    data: req.payload
                })

                const { credentials } = req.auth
                if (credentials.id === req.params.userDetailsId) {
                    // console.log(credentials.id,  req.params.userDetailsId);
                    return res.response({
                        status: true,
                        msg: "posts added sucessfully",
                        data: { post }
                    })
                } else {
                    return res.response({
                        status: false,
                        msg: "Please Check Your UserDetailsId (token's id and UserDetailsId is mismatched)"
                    })
                }
            } else {
                return res.response({
                    status: false,
                    msg: "posts doesnt exist",
                    data: {}
                })
            }
        }


    } catch (error) {
        console.log(error);
        return res.response({
            status: false,
            msg: error
        })
    }

}

async function editOwnComments(req, res) {
    try {

        let isUserExist = await prisma.userDetails.findFirst({
            where: {
                id: +req.params.userDetailsId,
                is_deleted: false
            }
        })

        if (!isUserExist) {
            return res.response({
                status: false,
                msg: "user dosent exist ",
            })
        } else {
            let isPostExist = await prisma.posts.findUnique({
                where: {
                    id: +req.params.postId,
                    is_deleted: false
                }
            })
            if (isPostExist) {
                let isCommentExist = await prisma.comments.findUnique({
                    where: {
                        id: +req.params.commentsId,
                        is_deleted: false
                    }
                })
                if (isCommentExist) {
                    let comment = await prisma.comments.update({
                        where: {
                            id: +req.params.commentsId,
                            is_deleted: false
                        },
                        data: req.payload
                    })
                    console.log("comment.userDetailsId === +req.params.userDetailsId", comment.userDetailsId === +req.params.userDetailsId);
                    if (!(comment.userDetailsId === +req.params.userDetailsId)) {

                        return res.response({
                            status: true,
                            msg: "This User is not authorized to edit this comment",
                            data: {}
                        })
                    } else {

                        const { credentials } = req.auth
                        if (credentials.id === req.params.userDetailsId) {
                            // console.log(credentials.id,  req.params.userDetailsId);
                            return res.response({
                                status: true,
                                msg: "Comment Updated",
                                data: { comment }
                            })
                        } else {
                            return res.response({
                                status: false,
                                msg: "Please Check Your UserDetailsId (token's id and UserDetailsId is mismatched)"
                            })
                        }
                    }
                } else {
                    return res.response({
                        status: false,
                        msg: "Comment not exist"
                    })
                }
            } else {
                return res.response({
                    status: false,
                    msg: "Post not exist"
                })

            }
        }

    } catch (error) {
        console.log(error);
        return res.response({
            status: false,
            msg: error
        })

    }


}

async function readOwnPost(req, res) {
    try {



        const readOwnPosts = await prisma.posts.findMany({
            where: {
                userDetailsId: +req.params.userDetailsId,
                is_deleted: false,
            },
            include: {
                comments: true
            }
        })


        const { credentials } = req.auth

        if (credentials.id === +req.params.userDetailsId) {
            return res.response({
                status: true,
                message: 'post Fetch sucessfully',
                data: { readOwnPosts }
            })
        } else {
            return res.response({
                status: false,
                msg: "Please Check Your UserDetailsId (token's id and UserDetailsId is mismatched)"
            })
        }




    } catch (error) {
        console.log(error);
        return res.response({
            status: false,
            msg: error
        })

    }

}

async function deletePost(req, res) {

    try {
        let isUserExist = await prisma.userDetails.findFirst({
            where: {
                id: +req.params.userDetailsId,
                is_deleted: false
            }
        })
        if (!isUserExist) {
            return res.response({
                status: false,
                msg: "user dosent exist "
            })

        } else {

            let isPostExist = await prisma.posts.findUnique({
                where: {
                    id: +req.params.postId
                }
            })
            if (!isPostExist) {
                return res.response({
                    status: false,
                    msg: "post dosent exist"
                })

            } else {

                const post = await prisma.posts.update({
                    where: {
                        id: +req.params.postId //whatever you send in params it consider as string thats wh we downcast string to number

                    },
                    data: {
                        is_deleted: true
                    }
                })
                const postCommentsDelete = await prisma.comments.updateMany({
                    where: {
                        postID: +req.params.postId,
                        is_deleted: false
                    },
                    data: {
                        is_deleted: true
                    }
                })

                const { credentials } = req.auth

                if (credentials.id === +req.params.userDetailsId) {
                    return res.response({
                        status: true,
                        message: 'post deleted sucessfully',
                        data: post, postCommentsDelete
                    })
                } else {
                    return res.response({
                        status: false,
                        msg: "Please Check Your UserDetailsId (token's id and UserDetailsId is mismatched)"
                    })
                }



            }


        }
    } catch (error) {
        console.log(error);
        return res.response({
            status: false,
            msg: error
        })
    }

}

async function deleteOwnPostComment(req, res) {
    try {
        let isUserExist = await prisma.userDetails.findFirst({
            where: {
                id: +req.params.userDetailsId,
                is_deleted: false
            }
        })
        if (!isUserExist) {
            return res.response({
                status: false,
                msg: "user dosent exist"
            })

        } else {
            let isCommentExist = await prisma.comments.findUnique({
                where: {
                    id: +req.params.commentsId,
                    is_deleted: false
                }
            })
            if (!isCommentExist) {
                return res.response({
                    status: false,
                    msg: "comments dosent exist "
                })

            }

            const comments = await prisma.comments.update({
                where: {
                    id: +req.params.commentsId //whatever you send in params it consider as string thats wh we downcast string to number

                },
                data: {
                    is_deleted: true
                }
            })
            const { credentials } = req.auth

            if (credentials.id === +req.params.userDetailsId) {
                return res.response({
                    status: true,
                    message: 'comment deleted sucessfully',
                    data: comments
                })
            } else {
                return res.response({
                    status: false,
                    msg: "Please Check Your UserDetailsId (token's id and UserDetailsId is mismatched)"
                })
            }
        }


    } catch (error) {
        console.log(error);
        return res.response({
            status: false,
            msg: error
        })
    }

}

async function deleteOwnCommentsInAnyPost(req, res) {
    try {
        let isUserExist = await prisma.userDetails.findFirst({
            where: {
                id: +req.params.userDetailsId,
                is_deleted: false
            }
        })
        if (!isUserExist) {
            return res.response({
                status: false,
                msg: "user dosent exist"
            })

        } else {
            let isCommentExist = await prisma.comments.findUnique({
                where: {
                    id: +req.params.commentsId,
                    userDetailsId: +req.params.userDetailsId,
                    is_deleted: false
                }
            })
            if (!isCommentExist) {
                return res.response({
                    status: false,
                    msg: "you are not authorized to delete this comment "
                })

            } else {
                const comments = await prisma.comments.update({
                    where: {
                        id: +req.params.commentsId //whatever you send in params it consider as string thats wh we downcast string to number

                    },
                    data: {
                        is_deleted: true
                    }
                })
                const { credentials } = req.auth

                if (credentials.id === +req.params.userDetailsId) {
                    return res.response({
                        status: true,
                        message: 'comment deleted sucessfully',
                        data: comments
                    })
                } else {
                    return res.response({
                        status: false,
                        msg: "Please Check Your UserDetailsId (token's id and UserDetailsId is mismatched)"
                    })
                }
            }
        }
    } catch (error) {
        console.log(error);
        return res.response({
            status: false,
            msg: error
        })
    }

}

async function deleteAccount(req, res) {
    try {
        const isUserExist = await prisma.userDetails.findFirst({
            where: {
                id: +req.params.userDetailsId,
                is_deleted: false
            }
        })

        if (!isUserExist) {
            return res.response({
                status: false,
                msg: "user not exist"
            })
        } else {
            const userAcct = await prisma.userDetails.update({
                where: {
                    id: +req.params.userDetailsId, //whatever you send in params it consider as string thats why we downcast string to number
                    is_deleted: false

                },
                data: {
                    is_deleted: true
                }
            })
            // console.log("userAcct0", userAcct);
            const userPost = await prisma.posts.updateMany({
                where: {
                    userDetailsId: +req.params.userDetailsId, //whatever you send in params it consider as string thats why we downcast string to number
                    is_deleted: false

                },
                data: {
                    is_deleted: true
                }
            })
            const userDeletedPost = await prisma.posts.findMany({
                where: {
                    userDetailsId: +req.params.userDetailsId, //whatever you send in params it consider as string thats why we downcast string to number
                    is_deleted: true

                },

            })
            // console.log("userPostCommentsBeforeDeletion", userDeletedPost);

            const deletedUserPostIds = userDeletedPost.map(post => post.id);

            // Soft delete comments related to deleted posts
            const deleteCommentsPromises = deletedUserPostIds.map(async postId => {
                return prisma.comments.updateMany({
                    where: {
                        postID: postId,

                        is_deleted: false
                    },
                    data: {
                        is_deleted: true
                    }
                });
            });

            // Execute all comment deletion promises
            await Promise.all(deleteCommentsPromises);
            console.log("deleteCommentsPromises", deleteCommentsPromises);



            const { credentials } = req.auth

            if (credentials.id === +req.params.userDetailsId) {
                return res.response({
                    status: true,
                    message: 'account deleted sucessfully',
                    data: userAcct, userPost, deleteCommentsPromises
                })
            } else {
                return res.response({
                    status: false,
                    msg: "Please Check Your UserDetailsId (token's id and UserDetailsId is mismatched)"
                })
            }
        }



    } catch (error) {
        console.log(error);
        return res.response({
            status: false,
            msg: error
        })
    }



}

async function sendMail(userName, email, token) {
    try {
        const mailTransporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            requireTLS: true,
            auth: {
                user: process.env.USER_EMAIL,
                pass: process.env.USER_EMAIL_PASSWORD
            }
        })

        // console.log("mailTransporter", mailTransporter);
        const mailOptions = {
            from: process.env.USER_EMAIL,
            to: email,
            subject: `Password Reset`,
            html: `<h1> Password Reset: </h1> <span> please reset your password <a href= "http://localhost:3000/reset_password?token=${token}"> Reset Your Passsword </a>`

        }
        // console.log("mailOptions", mailOptions);
        mailTransporter.sendMail(mailOptions, ((err, info) => {
            if (err) {
                console.log("Error", err);
            } else {
                console.log(`Mail has been sent ${info.response}`);
            }
        }))
    } catch (error) {
        console.log(error);
    }

}

async function forgetPassword(req, res) {
    try {
        const isUserExist = await prisma.userDetails.findFirst({
            where: {
                email: req.payload.email,
                is_deleted: false
            }
        })
        if (!isUserExist) {
            return res.response({
                status: false,
                msg: "user dosent exist"
            })
        } else {
            let randomString = randomstring.generate()
            await prisma.userDetails.update({
                where: {
                    email: req.payload.email,
                },
                data: {
                    token: randomString
                }
            })

            await sendMail(isUserExist.name, isUserExist.email, randomString)
            return res.response({
                status: true,
                msg: "Mail has been sent please check your email"
            })
        }

    } catch (error) {
        console.log(error);
    }
}

async function resetPassword(req, res) {
    try {

        // console.log(req.auth);
        const { credentials } = req.auth
        // console.log(+req.params.userDetailsId);

        if (credentials.id === +req.params.userDetailsId) {
            let tokenVerification = await prisma.userDetails.findFirst({
                where: {
                    id: +req.params.userDetailsId,
                    is_deleted: false,
                    token: req.params.token
                }
            })
            console.log(tokenVerification);
            if (tokenVerification == null || !req.params.token) {
                return res.response({
                    status: false,
                    msg: "Token Expired"
                })

            } else {
                req.payload.password = bcrypt.hashSync(req.payload.password, bcrypt.genSaltSync(10));

                await prisma.userDetails.update({
                    where: {
                        id: +req.params.userDetailsId,
                        is_deleted: false
                    },
                    data: {
                        password: req.payload.password,
                        token: ""
                    }
                })
                return res.response({
                    status: true,
                    msg: "Password Reset Sucessfully"
                })
            }
        } else {
            return res.response({
                status: false,
                msg: "Please Check Your UserDetailsId (token's id and UserDetailsId is mismatched)"
            })
        }




    } catch (error) {
        console.log(error);
    }
}

async function fileUpload(req, res) {
    try {
        // Check if the user exists
        const userDetailsId = +req.payload.userDetailsId;
        const isUserExist = await prisma.userDetails.findUnique({
            where: {
                id: userDetailsId,
                is_deleted: false
            }
        });
        // console.log("isUserExist.name", isUserExist.name);

        if (!isUserExist) {
            return res.response({
                status: false,
                msg: "User does not exist"
            });
        }

        // Check if the user already has an image uploaded
        const existingFile = await prisma.file.findFirst({
            where: {
                userDetailsId: userDetailsId
            }
        });
        console.log(existingFile);

        if (existingFile) {
            // Delete the existing file
            await prisma.file.delete({
                where: {
                    id: existingFile.id
                }
            });

            // Delete the existing file from the filesystem

        }

        // Process the uploaded file
        const file = req.payload.file;
        // console.log("file", file);

        if (!file) {
            return res.response({
                status: false,
                msg: "No file uploaded"
            });
        }

        const fileData = await file._data; // Read file data (Buffer Data)
        const filename = file.hapi.filename;

        // Generate a random file name based on the current timestamp
        const randomFileName = Date.now();

        // Get the file extension from the original filename
        const fileArray = filename.split('.');
        const originalFileName = fileArray[0];
        const fileExtension = fileArray[1];

        // Construct the final file name with the random part and the original extension
        const finalFileName = `${originalFileName}-${randomFileName}.${fileExtension}`;

        // Save the new file to the database

        const savedFile = await prisma.file.create({
            data: {
                filename: finalFileName,
                // eslint-disable-next-line no-undef
                fileData: Buffer.from(fileData),
                user_name: isUserExist.name,
                userDetailsId: userDetailsId
            }
        });

        // Save the new file to the filesystem
        // eslint-disable-next-line no-undef
        const uploadsFolder = path.join(__dirname, '../uploads');
        if (!fs.existsSync(uploadsFolder)) {
            fs.mkdirSync(uploadsFolder);
        }
        const filePath = path.join(uploadsFolder, finalFileName);
        fs.writeFileSync(filePath, fileData);

        return res.response({
            status: true,
            msg: "File uploaded",
            data: {
                filename: savedFile.filename,
                userDetailsId: savedFile.userDetailsId,
                user_name: savedFile.user_name
            }
        });
    } catch (error) {
        console.log(error);
        return res.response({
            status: false,
            msg: error.message || "Internal server error"
        });
    }
}

async function readFile(req, res) {
    try {

        const isUserExit = await prisma.userDetails.findUnique({
            where: {
                id: +req.params.userDetailsId,
                is_deleted: false
            }
        })
        if (isUserExit) {

            // Retrieve file data from Prisma
            const file = await prisma.file.findFirst({
                where: {
                    userDetailsId: +req.params.userDetailsId
                }
            });

            if (!file) {
                return res.response({
                    status: false,
                    msg: "File not found"
                })
            } else {

                // Serve file data
                // return res.response(file.fileData).header('Content-Disposition', `attachment; filename="${file.filename}"`);
                const { credentials } = req.auth
                // console.log("credentials", credentials);
                if (credentials?.id === +req.params.userDetailsId) {
                    return res.response({
                        status: true,
                        msg: "file fetch sucessfully",
                        data: {
                            fileName: file.filename,
                            fileData: file.fileData
                        }
                    })
                } else {
                    return res.response({
                        status: false,
                        msg: "Please Check Your UserDetailsId (token's id and UserDetailsId is mismatched)"
                    })
                }
            }
        } else {
            return res.response({
                status: false,
                msg: "User Does Not Exist",
                data: {}
            })
        }
    } catch (error) {
        console.log(error);
    }

}

async function readAllFile(req, res) {
    try {
        // Check if user exists and is not deleted
        const isUserExist = await prisma.userDetails.findUnique({
            where: {
                id: +req.params.userDetailsId,
                is_deleted: false
            }
        });

        if (isUserExist) {
            // Retrieve file data from Prisma
            const files = await prisma.file.findMany({
                where: {
                    is_deleted: false
                }
            });

            if (files.length === 0) {
                return res.response({
                    status: false,
                    msg: "File not found"
                });
            } else {
                const { credentials } = req.auth;
                // console.log("files", files);
                // console.log("credentials", credentials);

                if (credentials?.id === +req.params.userDetailsId) {
                    return res.response({
                        status: true,
                        msg: "Files fetched successfully",
                        data: files.map(file => ({
                            fileName: file.filename,
                            fileData: file.fileData,
                            userDetailsId: file.userDetailsId
                        }))
                    });
                } else {
                    return res.json({
                        status: false,
                        msg: "Please check your UserDetailsId (token's id and UserDetailsId mismatched)"
                    });
                }
            }
        } else {
            return res.json({
                status: false,
                msg: "User does not exist",
                data: {}
            });
        }
    } catch (error) {
        console.error(error);
        return res.json({
            status: false,
            msg: "An error occurred",
            error: error.message
        });
    }
}



module.exports = {
    addUser,
    userLogin,
    getUserById,
    addPost,
    addCommentsOnAnyPost,
    readCommentsOnPost,
    readAllPost,
    readOwnPost,
    editPost,
    deletePost,
    deleteOwnPostComment,
    deleteAccount,
    forgetPassword,
    resetPassword,
    editOwnComments,
    deleteOwnCommentsInAnyPost,
    fileUpload,
    readFile,
    test,
    getAllUser,
    readAllFile
}