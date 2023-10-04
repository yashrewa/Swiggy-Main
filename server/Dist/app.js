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
app.use((0, cors_1.default)({
    origin: 'https://swiggy-clone-j5gz.onrender.com'
}));
app.use(express_1.default.json());
app.use('/admin', admin_1.default);
app.use('/user', user_1.default);
// mongoose.connect(`mongodb+srv://yashrewa00:21Savage@cluster0.3z81dfx.mongodb.net/Swiggy?retryWrites=true&w=majority`)
mongoose_1.default.connect(`${process.env.MONGODB_CONNECT_URI}`);
const PORT = process.env.PORT;
app.listen(PORT);
