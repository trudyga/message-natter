module.exports = class IncompleteDateError extends Error {
    constructor(props) {
        super(`Incomplete data, need ${props.map(i => `[${i}]`)}`);
        Error.captureStackTrace(this, IncompleteDateError);
    }
};