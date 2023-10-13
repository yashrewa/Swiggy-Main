"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const admin_1 = __importDefault(require("./routes/admin"));
const user_1 = __importDefault(require("./routes/user"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use('/admin', admin_1.default);
app.use('/user', user_1.default);
mongoose_1.default.connect(`mongodb+srv://yashrewa00:21Savage@cluster0.fngj58u.mongodb.net/swiggy?retryWrites=true&w=majority`);
// mongoose.connect(`${process.env.MONGODB_CONNECT_URI}`)
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
