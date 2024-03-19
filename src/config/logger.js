// import winston from 'winston'

// const logger = winston.createLogger({
//     transports: [
//         new winston.transports.Console({ level: "http" }),
//         new winston.transports.File({ filename: '../files/errors.log', level: 'error' })
//     ]
// })

// //middleware
// export const addLogger = (req, res, next) => {
//     req.logger = logger

//     req.logger.warn(`${req.method} on ${req.url} - at ${new Date().toLocaleDateString()} - ${new Date().toLocaleTimeString()}`)
//     req.logger.http(`${req.method} on ${req.url} - at ${new Date().toLocaleDateString()} - ${new Date().toLocaleTimeString()}`)
//     req.logger.error(`${req.method} on ${req.url} - at ${new Date().toLocaleDateString()} - ${new Date().toLocaleTimeString()}`)
//     req.logger.debug(`${req.method} on ${req.url} - at ${new Date().toLocaleDateString()} - ${new Date().toLocaleTimeString()}`)

//     next();
// }