import mongoose, {Schema} from "mongoose";

const blogsSchema = new Schema({
    blogName: {type: String, required: true},
    blogImage: {type: String, default: "https://i.ibb.co/fdqgHhPV/no-img.png"},
    blogCreator: {type: Schema.Types.ObjectId, ref: "User", required: true},
    description: {type: String, required: true},
    tags: {type: [String], required: true},
    content: {type: String, required: true},
    blogLikes: {type: Number, default: 0},
    blogViews: {type: Number, default: 0},
  }, {timestamps: true});

const Blogs = mongoose.models.Blogs || mongoose.model("Blogs", blogsSchema);

export default Blogs;