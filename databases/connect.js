import mongoose from 'mongoose';

const connect = async () => {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/Easy-Book');
        console.log('Connected successfully');
    } catch (error) {
        console.log('Connected failed');
    }
};

export default { connect };
