import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const totalIncome = await (
      await this.find({ where: { type: 'income' } })
    ).reduce(
      (totalValue, currentTransaction) => totalValue + currentTransaction.value,
      0,
    );

    const totalOutcome = await (
      await this.find({ where: { type: 'outcome' } })
    ).reduce(
      (totalValue, currentTransaction) => totalValue + currentTransaction.value,
      0,
    );

    const balance: Balance = {
      income: totalIncome,
      outcome: totalOutcome,
      total: totalIncome - totalOutcome,
    };

    return balance;
  }
}

export default TransactionsRepository;
