import express from 'express';
import UserRoutes from './user.js'
const route = express.Router();


route.get('/', (req, res) => {
    res.status(200).send(
        `<h1>Welcome to Authorisation and Authentication</h1>`
    )
})

route.use("/user", UserRoutes)

export default route