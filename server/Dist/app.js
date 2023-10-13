"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const fs_1 = __importDefault(require("fs"));
const http_1 = __importDefault(require("http"));
const https_1 = __importDefault(require("https"));
const cors_1 = __importDefault(require("cors"));
const admin_1 = __importDefault(require("./routes/admin"));
const user_1 = __importDefault(require("./routes/user"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: 'https://swiggy-main-3acb0bt4v-yashs-projects-dfb34b1e.vercel.app/'
}));
app.use(express_1.default.json());
app.use('/admin', admin_1.default);
app.use('/user', user_1.default);
let options = {
    key: fs_1.default.readFileSync('./newcerts/ubereats.key'),
    cert: fs_1.default.readFileSync('./newcerts/ubereats.crt')
};
console.log(options);
mongoose_1.default.connect(`mongodb+srv://yashrewa00:21Savage@cluster0.3z81dfx.mongodb.net/Swiggy?retryWrites=true&w=majority`);
// mongoose.connect(`${process.env.MONGODB_CONNECT_URI}`)
http_1.default.createServer(app).listen(80);
https_1.default.createServer(options, app).listen(443);
