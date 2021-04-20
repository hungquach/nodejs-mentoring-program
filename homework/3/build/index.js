"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const user_route_1 = __importDefault(require("./user-route"));
const app = express_1.default();
const port = 3000;
// ---------------------------------- 
// Application properties
// ----------------------------------
app.set('appName', 'Hung Quach\'s homework 2');
// ----------------------------------
// Application settings
// ----------------------------------
///app.set('case sentitive routing', true)
//app.set('strict routing', true)
//app.set('x-powered-by', false)
// ----------------------------------
// Application level middileware
// ----------------------------------
app.use(express_1.default.json());
app.use(cookie_parser_1.default());
app.use((req, res, next) => {
    console.log(`Timestamp ${Date.now()} - ${req.method} ${req.originalUrl}`);
    console.log('Cookies: ', req.cookies);
    next();
});
// ----------------------------------
// Route
// ----------------------------------
app.use(user_route_1.default);
app.get('/test', (req, res) => {
    console.log('hello');
    res.json('hello');
});
// ----------------------------------
// Error-handling middleware
// ----------------------------------
app.use((req, res, next) => {
    throw new Error('Error!');
});
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Internal server error');
    next(err);
});
app.listen(port, () => console.log(`Server is listening on port ${port}!`));
