import Transaction from '../models/transaction.model';

const transactionResolver = {
    Query: {
        transactions: async (_, _, context) => {
            try {
                if (!context.getUser()) throw new Error('Unauthorized');
                const userId = await context.getUser()._id;
                const transactions = await Transaction.find({ userId });
                return transactions;
            } catch (error) {
                console.error('Error getting transactions: ', error);
                throw new Error('Error getting transactions');
            }
        },
        transaction: async (_, { transactionId }, context) => {
            try {
                const transaction = await Transaction.findById(transactionId);
                return transaction;
            } catch (error) {
                console.error('Error getting transaction: ', error);
                throw new Error('Error getting transaction');
            }
        }
    },
    Mutation: {
        createTransaction: async (_, { input }, context) => {
            try {
                const newTransaction = new Transaction({
                    ...input,
                    userId: context.getUser()._id
                });
                await newTransaction.save();
                return newTransaction;
            } catch (error) {
                console.error('Error creating transaction: ', error);
                throw new Error('Error creating transaction');
            }
        },
        updateTransaction: async (_, { input }, context) => {
            try {
                const updatedTransaction = await Transaction.findByIdAndUpdate(
                    input.transactionId,
                    input,
                    { new: true } // return new object, false will return the old one
                );
                return updatedTransaction;
            } catch (error) {
                console.error('Error updating transaction: ', error);
                throw new Error('Error updating transaction');
            }
        },
        deleteTransaction: async (_, { input }, context) => {
            try {
                const deletedTransaction = await Transaction.findByIdAndUpdate(
                    input.transactionId
                );
                return deletedTransaction;
            } catch (error) {
                console.error('Error deleting transaction: ', error);
                throw new Error('Error deleting transaction');
            }
        }
    }
};

export default transactionResolver;
