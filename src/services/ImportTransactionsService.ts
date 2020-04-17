import csvtojson from 'csvtojson';
import path from 'path';
import fs from 'fs';

import CreateTransactionService from './CreateTransactionService';
import uploadConfig from '../config/upload';
import Transaction from '../models/Transaction';

class ImportTransactionsService {
  async execute(file_name: string): Promise<Transaction[]> {
    const createService = new CreateTransactionService();
    const fullFileName = path.join(uploadConfig.directory, file_name);

    const data = await csvtojson().fromFile(fullFileName);

    const transactions: Transaction[] = [];

    for (const element of data) {
      transactions.push(await createService.execute(element));
    }

    await fs.promises.unlink(fullFileName);
    return transactions;
  }
}

export default ImportTransactionsService;
