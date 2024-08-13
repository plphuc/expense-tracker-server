import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import ApiError from '../utils/apiError.js';
import Transaction from '../models/transaction.model.js';

const userResolver = {
    Mutation: {
        signUp: async (_, { input }, context) => {
            try {
                const { username, name, password, gender } = input;

                if (!username || !name || !password || !gender) {
                    throw new ApiError(400, `All fields are required`);
                }
                const existingUser = await User.findOne({ username });
                if (existingUser) {
                    throw new ApiError(400, 'User already exists');
                }
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(password, salt);
                const profilePic = `https://avatar.iran.liara.run/public/${
                    gender === 'male' ? 'boy' : 'girl'
                }?username=${username}`;

                const newUser = new User({
                    username,
                    name,
                    password: hashedPassword,
                    gender,
                    profilePicture: profilePic
                });

                await newUser.save();
                await context.login(newUser);

                return newUser;
            } catch (error) {
                console.error('Error in sign up: ', error);
                throw new Error(error.message || 'Internal server error');
            }
        },

        login: async (_, { input }, context) => {
            try {
                const { username, password } = input;
                if (!username || !password) {
                    throw new Error('All fields are required');
                }
                const { user } = await context.authenticate('graphql-local', {
                    username,
                    password
                });

                await context.login(user);
                return user;
            } catch (error) {
                console.error('Error in log in: ', error);
                throw new Error(error.message || 'Internal server error');
            }
        },

        logout: async (_, __, context) => {
            try {
                await context.logout();
                context.req.session.destroy((error) => {
                    if (error) throw error;
                });
                context.res.clearCookie('connect.sid');
                return { message: 'Logged out successfully' };
            } catch (error) {
                console.error('Error in log out: ', error);
                throw new Error(error.message || 'Internal server error');
            }
        }
    },
    Query: {
        hello: () => "Hello world from Daisy's app",
        authUser: async (_, __, context) => {
            try {
                const user = await context.getUser();
                return user;
            } catch (error) {
                console.error('Error in authUser: ', error);
                throw new Error('Internal server error');
            }
        },
        user: async (_, { userId }) => {
            try {
                const user = await User.findById(userId);
                return user;
            } catch (error) {
                console.error('Error in user query: ', error);
                throw new Error(error.message || 'Error getting user');
            }
        }
    },
    User: {
        transactions: async (parent) => {
            try {
                const transactions = await Transaction.find({
                    userId: parent._id
                });
                return transactions;
            } catch (error) {
                console.log('Error in user.transaction resolver: ', error);
                throw new Error(error.message || 'Internal server error');
            }
        }
    }
};

export default userResolver;
