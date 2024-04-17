const Blog = require("../models/blogModel");
const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongodbId");

// CREATE BLOG
const createBlog = asyncHandler(async (req, res) => {
    try {
        const newBlog = await Blog.create(req.body);
        res.json(newBlog);
    } catch (error) {
        throw new Error(error);
    }
});

// UPDATE BLOG
const updateBlog = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const updateBlog = await Blog.findByIdAndUpdate(id, req.body, {
            new: true,
        });
        res.json(updateBlog);
    } catch (error) {
        throw new Error(error);
    }
});

// GET A BLOG
const getBlog = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const getBlog = await Blog.findById(id)
            .populate("likes")
            .populate("dislikes");
        const updateViews =  await Blog.findByIdAndUpdate(
            id,
            {
                $inc: { numViews: 1 },
            },
            { new: true }
        );
        res.json(getBlog);
    } catch (error) {
        throw new Error(error);
    }
});

// GET ALL BLOGS
const getAllBlogs = asyncHandler(async (req, res) => {
    try {
        const getBlogs = await Blog.find();
        res.json(getBlogs);
    } catch (error) {
        throw new Error(error);
    }
});

// DELETE A BLOG
const deleteBlog = asyncHandler(async (req,res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const deleteBlog = await Blog.findByIdAndDelete(id);
        res.json(deleteBlog);
    } catch (error) {
        throw new Error(error);
    }
});

// LIKE A BLOG
const likeBlog = asyncHandler(async (req, res) => {
    const { blogId } = req.body;
    validateMongoDbId(blogId);

    // TÌM BLOG MÀ BẠN YÊU THÍCH
    const blog = await Blog.findById(blogId);
    // TÌM NGƯỜI DÙNG ĐĂNG NHẬP
    const loginUserId = req?.user?._id;
    // TÌM NGƯỜI NGƯỜI THÍCH BLOG
    const isLiked = blog?.isLiked;
    // TÌM NGƯỜI DÙNG KHÔNG THÍCH BLOG
    const alreadyDisliked = blog?.dislikes?.find(
        (userId => userId?.toString() === loginUserId?.toString())
    );
    if (alreadyDisliked) {
        const blog = await Blog.findByIdAndUpdate(
            blogId, 
            {
                $pull: { dislikes: loginUserId },
                isDisliked: false,
            },
            { new: true }
        );
        res.json(blog);
    }
    if (isLiked){
        const blog = await Blog.findByIdAndUpdate(
            blogId, 
            {
                $pull: { likes: loginUserId },
                isLiked: false,
            },
            { new: true }
        );
        res.json(blog);
    } else {
        const blog = await Blog.findByIdAndUpdate(
            blogId, 
            {
                $push: { likes: loginUserId },
                isLiked: true,
            },
            { new: true }
        );
        res.json(blog);
    }
});

// DISLIKE A BLOG
const dislikeBlog = asyncHandler(async (req, res) => {
    const { blogId } = req.body;
    validateMongoDbId(blogId);

    // TÌM BLOG MÀ BẠN YÊU THÍCH
    const blog = await Blog.findById(blogId);
    // TÌM NGƯỜI DÙNG ĐĂNG NHẬP
    const loginUserId = req?.user?._id;
    // TÌM NGƯỜI NGƯỜI THÍCH BLOG
    const isDisLiked = blog?.isDisliked;    
    // TÌM NGƯỜI DÙNG KHÔNG THÍCH BLOG
    const alreadyLiked = blog?.likes?.find(
        (userId => userId?.toString() === loginUserId?.toString())
    );
    if (alreadyLiked) {
        const blog = await Blog.findByIdAndUpdate(
            blogId, 
            {
                $pull: { likes: loginUserId },
                isLiked: false,
            },
            { new: true }
        );
        res.json(blog);
    }
    if (isDisLiked){
        const blog = await Blog.findByIdAndUpdate(
            blogId, 
            {
                $pull: { dislikes: loginUserId },
                isDisliked: false,
            },
            { new: true }
        );
        res.json(blog);
    } else {
        const blog = await Blog.findByIdAndUpdate(
            blogId, 
            {
                $push: { dislikes: loginUserId },
                isDisliked: true,
            },
            { new: true }
        );
        res.json(blog);
    }
});


module.exports = { 
    createBlog, 
    updateBlog, 
    getBlog, 
    getAllBlogs, 
    deleteBlog,
    likeBlog,
    dislikeBlog,
};
