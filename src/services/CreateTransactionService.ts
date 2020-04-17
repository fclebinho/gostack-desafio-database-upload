import { getCustomRepository, getRepository } from 'typeorm';

import AppError from '../errors/AppError';
import TransactionsRepository from '../repositories/TransactionsRepository';
import Transaction from '../models/Transaction';
import Category from '../models/Category';

interface TransactionRequest {
  title: string;
  value: number;
  type: 'income' | 'outcome' | undefined;
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: TransactionRequest): Promise<Transaction> {
    const repository = getCustomRepository(TransactionsRepository);
    const balance = await repository.getBalance();

    if (type === 'outcome' && balance.total < value) {
      throw new AppError('Not authorized', 400);
    }

    const repositoryCategory = getRepository(Category);
    let existsCategory = await repositoryCategory.findOne({
      where: { title: category },
    });

    if (!existsCategory) {
      existsCategory = repositoryCategory.create({ title: category });
      await repositoryCategory.save(existsCategory);
    }

    const transaction = repository.create({
      title,
      value,
      type,
      category: existsCategory,
    });

    await repository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
