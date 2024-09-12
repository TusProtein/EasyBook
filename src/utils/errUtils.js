const createErr = (message, status) => {
    const err = new Error(message);
    err.status = status;
    return err;
};

export default createErr;
