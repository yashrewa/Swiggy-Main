"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Authenticate = exports.secretKey = void 0;
exports.secretKey = "RIPUBEREATS";
var jsonwebtoken_1 = require("jsonwebtoken");
var Authenticate = function (req, res, next) {
    var _a;
    if (!req.headers.authorization) { // return res.status(403).json({message: "please login top again"})
        return console.log("error");
    }
    // console.log(req.headers.authorization)
    var token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
    if (token !== undefined && token !== null) {
        jsonwebtoken_1.default.verify(token, exports.secretKey, function (err, data) {
            if (data) {
                req.headers["email"] = data.email;
                next();
            }
            if (err || !data || typeof (data) === "string") {
                return res.status(401).json({ message: "please login xyz again", error: err });
            }
        });
    }
};
exports.Authenticate = Authenticate;
