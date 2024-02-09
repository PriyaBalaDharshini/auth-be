import userModel from '../models/user.js'
import Auth from '../helper/auth.js'

const getAllUsers = async (req, res) => {
    try {
        let users = await userModel.find()
        res.status(200).send({
            message: "User data fetch successful",
            users
        })
    } catch (error) {
        res.status(500).send({
            message: "Internal Server Error"
        })
    }
};

const getUserById = async (req, res) => {
    try {
        const user = await userModel.findById({ _id: req.params.id })
        if (user) {
            res.status(200).send({
                message: "Data fetched successfully",
                user
            })
        } else {
            res.status(404).send({
                message: "User not found"
            });
        }
    } catch (error) {
        res.status(500).send({
            message: "Internal server error"
        });
    }

};

/*  */
const createUser = async (req, res) => {
    try {
        const user = await userModel.findOne({ email: req.body.email });
        if (!user) {
            req.body.password = await Auth.createHash(req.body.password);
            let newUser = await userModel.create(req.body);

            res.status(200).send({
                message: "User Added Successfully",
            });
        } else {
            res.status(400).send({ message: `User already exists with ${req.body.email}` });
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({
            meaasage: "Internal error",
            error: error.message
        });

    }
}
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email: email });
        if (user) {
            if (await Auth.hashCompare(password, user.password)) {
                const token = await Auth.createToken({
                    name: user.name,
                    email: user.email,
                    role: user.role,
                })
                res.status(200).send({
                    message: "Login Successful",
                    token,
                    role: user.role
                });
            } else {
                res.status(400).send({
                    message: "Incorrect password"
                });
            }
        } else {
            res.status(400).send({
                message: "User does not exist"
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: "Internal server Error",
            error: error.message
        });
    }
};
export default {
    createUser,
    login,
    getAllUsers,
    getUserById
}