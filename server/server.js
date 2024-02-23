"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var mongoose_1 = require("mongoose");
var cors_1 = require("cors");
var admin_1 = require("./routes/admin");
var user_1 = require("./routes/user");
var app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use('/admin', admin_1.default);
app.use('/user', user_1.default);
mongoose_1.default.connect("mongodb+srv://yashrewa00:21Savage@cluster0.fngj58u.mongodb.net/swiggy?retryWrites=true&w=majority");
// mongoose.connect(`${process.env.MONGODB_CONNECT_URI}`)
var port = process.env.PORT || 3000;
app.listen(port, function () {
    console.log("Server is running on port ".concat(port));
});
