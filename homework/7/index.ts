import express from 'express';
import cookieParser from 'cookie-parser';
import { initDatabase, seed } from './dal/database';
import { user, group } from './routers';
import { logger, passport, dotenv } from './config';
import cors from 'cors';

const app = express()
const port = 3000;

(async () => {
    await initDatabase();
    await seed();
})();

// ---------------------------------- 
// Application properties
// ----------------------------------
app.set('appName', 'Hung Quach\'s homework 6')

// ----------------------------------
// Application settings
// ----------------------------------
app.set('case sentitive routing', true)
app.set('strict routing', true)
app.set('x-powered-by', false)

// ----------------------------------
// Application level middileware
// ----------------------------------
app.use(cors());
app.use(passport.initialize());
app.use(express.json())
app.use(cookieParser())

const getDurationInMilliseconds = (start) => {
    const NS_PER_SEC = 1e9
    const NS_TO_MS = 1e6
    const diff = process.hrtime(start)

    return (diff[0] * NS_PER_SEC + diff[1]) / NS_TO_MS
}

app.use((req, res, next) => {
    logger.info(`${req.method} ${req.originalUrl} [STARTED]`);
    const start = process.hrtime()

    logger.info('Request query: ' + JSON.stringify(req.query));
    logger.info('Request params: ' + JSON.stringify(req.params));
    logger.info('Request body: ' + JSON.stringify(req.body));
    logger.info('Cookies: ' + JSON.stringify(req.cookies));

    res.on('finish', () => {
        const durationInMilliseconds = getDurationInMilliseconds(start)
        console.log(`${req.method} ${req.originalUrl} [FINISHED] ${durationInMilliseconds.toLocaleString()} ms`)
    })

    res.on('close', () => {
        const durationInMilliseconds = getDurationInMilliseconds(start)
        console.log(`${req.method} ${req.originalUrl} [CLOSED] ${durationInMilliseconds.toLocaleString()} ms`)
    })

    next()
})

// ----------------------------------
// Route
// ----------------------------------
app.use(group, user);

// ----------------------------------
// Error-handling middleware
//----------------------------------

app.use((err, req, res, next) => {
    logger.error(err.stack)
    res.status(500).send('Internal server error')
    next(err)
})

process.on('unhandledRejection', (reason, promise) => {
    logger.error('Unhandled Rejection at: ' + promise + ' reason: ' + reason);
});

process.on('uncaughtException', (error) => {
    logger.error('Caught unhandle exception: ' + error);
});

app.listen(port, () => console.log(`Server is listening on port ${port}!`));
