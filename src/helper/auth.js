import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const SALT = 8;
const createHash = async (data) => {
    let salt = await bcrypt.genSalt(SALT);
    /* console.log(salt); */
    let hash = await bcrypt.hash(data, salt);
    /* console.log(hash); */
    return hash
}

const hashCompare = async (data, hash) => {
    return await bcrypt.compare(data, hash);
}

const createToken = async (payload) => {
    let token = await jwt.sign(payload, process.env.JWT_CODE, {
        expiresIn: process.env.JWT_EXP
    })
    return token
}
const decodeToken = async (token) => {
    return await jwt.decode(token)
}
const authenticate = async (req, res, next) => {
    let token = req?.headers?.authorization?.split(" ")[1];
    if (token) {
        let payload = await decodeToken(token);
        let currentTime = +new Date();
        console.log(payload.exp);
        console.log();
        if (Math.floor(currentTime / 1000) < payload.exp) {
            next()
        } else {
            res.status(402).send({
                message: "Session Expired"
            })
        }
    } else {
        res.status(402).send({
            message: "Un-Authorize req"
        })
    }
}

const adminGuard = async (req, res, next) => {
    let token = req?.headers?.authorization?.split(" ")[1];
    if (token) {
        let payload = await decodeToken(token);
        if (payload.role === 'admin') {
            next()
        } else {
            res.status(402).send({
                message: "Only Admins are allowed"
            })
        }
    } else {
        res.status(402).send({
            message: "Un-Authorize req"
        })
    }
}


export default { createHash, hashCompare, createToken, authenticate, adminGuard };