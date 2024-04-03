const { generateToken } = require("../config/jwtToken");
const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const createUser = asyncHandler(async (req,res) => {
    const email = req.body.email;
    const findUser = await User.findOne({ email: email });
    if (!findUser) {
        // Tạo tài khoản mới
        const newUser = await User.create(req.body);
        res.json(newUser);
    } else {
        throw new Error("Tài khoản đã tồn tại");
    }
});

const loginUserCtrl = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    // Kiểm tra tài khoản có hay không
    const findUser = await User.findOne({ email });
    if(findUser && (await findUser.isPasswordMatched(password))) {
        res.json({
            _id: findUser?._id,
            firstname: findUser?.firstname,
            lastname: findUser?.lastname,
            email: findUser?.email,
            mobile: findUser?.mobile,
            token: generateToken(findUser?._id),
        });
    } else {
        throw new Error("Thông tin không hợp lệ");
    }
});

// Update A User

const updateUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
        const updateUser = await User.findByIdAndUpdate(id, {
            firstname: req?.body?.firstname,
            lastname: req?.body?.lastname,
            email: req?.body?.email,
            mobile: req?.body?.mobile,
        },
        {
            new: true,
        }
    );
        res.json(updateUser);
    } catch (error) {
        throw new Error(error);
    }
})

// Get All User

const getallUser = asyncHandler( async (req, res) => {
    try {
        const getUsers = await User.find();
        res.json(getUsers);
    } catch (error) {
        throw new Error(error);
    }
});

// Get A User

const getUser = asyncHandler(async (req, res) => {
    console.log(req.params);
    const { id } = req.params;
    try {
        const getUser = await User.findById(id);
        res.json({
            getUser,
        });
    } catch (error) {
        throw new  Error(error);
    }
});

// Delete A User

const deleteUser = asyncHandler(async (req, res) => {
    console.log(req.params);
    const { id } = req.params;
    try {
        const deleteUser = await User.findByIdAndDelete(id);
        res.json({
            deleteUser,
        });
    } catch (error) {
        throw new  Error(error);
    }
});

module.exports = { createUser, loginUserCtrl, getallUser, getUser, deleteUser, updateUser };