const errHandler = (err, req, res, next) => {
    return res.status(err.status || 500).json({ error: err.message });
};

export default errHandler;
