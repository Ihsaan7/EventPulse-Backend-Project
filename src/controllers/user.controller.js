import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiError} from "../utils/apiError.js"
import {ApiResponse} from "../utils/apiResponse.js"
import { getDB } from "../db/index.js"
import {hashPass , comparePass} from "../utils/passUtil.js"
import { genAccessToken , genRefreshToken} from "../utils/jwtUtil.js"
import {
    findUserByEmail,
    findUserById,
    updateRefreshToken
}   from "../models/user.model.js"

const registerUser = asyncHandler(async( req , res)=>
    {
        const {name ,email , password , role} = req.body
        const db = getDB()

        if([name , email , password ].some((field)=> field?.trim() === ""))
            {
                throw new ApiError(400 , "All fields are required!")
            }
        
        const existedUser = await findUserByEmail(db , email)
        if(existedUser){ throw new ApiError(400, "User with this mail already exists!")}

        const hashPassword = await hashPass(password)

        const user = await createUser(db,
            {
                name,
                email,
                password: hashPassword,
                role: role || "ATTENDEE"
            })

        if(!user){ throw new ApiError(500 , "Something went wrong while registerting user!")}

        return res
            .status(201)
            .json(new ApiResponse(201 , user , "User registered successfully"))
    })


const loginUser = asyncHandler(async(req ,res)=>
    {
        const { email , password } = req.body
        const db = getDB()

        if(!email || !password){ throw new ApiError(400, "Both fields are required!")}

        const user = await findUserByEmail(db , email)
        if(!user){ throw new ApiError(404, "No user found!")}

        const isPassValid = await comparePass(password , user.password_hash)
        if(!isPassValid){throw new ApiError(401, "Invalid user credentials!")}

        const accessToken = genAccessToken(user)
        const refreshToken = genRefreshToken(user)

        await updateRefreshToken(db , user.id , refreshToken)

        const { password_hash , refresh_token , ...cleanUser} = user

        const options={
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        }

        return res
            .status(200)
            .cookie("accessToken" , accessToken , options)
            .cookie("refreshToken" , refreshToken , options)
            .json(
                new ApiResponse(
                    200,
                    {
                        user:cleanUser,
                        accessToken,
                        refreshToken
                    },
                    "User Logged in Successfully"
                )
            )
    })

    export { registerUser , loginUser}