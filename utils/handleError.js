const errorHandler = (err, req, res, next) => {
    const { message, statusCode, stack } = err;    
    const response = {
        code: statusCode,
        message,
        stack: stack
    };

    res.status(statusCode).send(response);
};

export { errorHandler };
 