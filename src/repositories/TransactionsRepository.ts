import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

class TransactionsRepository {
  private transactions: Transaction[];

  constructor() {
    this.transactions = [];
  }

  public all(): Transaction[] {
    return this.transactions;
  }

  public getBalance(): Balance {
    const income = this.transactions
      .filter(transaction => transaction.type === 'income')
      .reduce(
        // eslint-disable-next-line no-return-assign, no-param-reassign
        (total, transaction) => (total += transaction.value),
        0,
      );
    const outcome = this.transactions
      .filter(transaction => transaction.type === 'outcome')
      .reduce(
        // eslint-disable-next-line no-return-assign, no-param-reassign
        (total, transaction) => (total += transaction.value),
        0,
      );
    const total = income - outcome;

    const balance = {
      income,
      outcome,
      total,
    };

    return balance;
  }

  public validBalance({
    value,
    type,
  }: Pick<Transaction, 'value' | 'type'>): boolean {
    const balance = this.getBalance();

    if (type === 'income' || balance.total >= value) {
      return true;
    }
    return false;
  }

  public create({ title, value, type }: Omit<Transaction, 'id'>): Transaction {
    const transaction = new Transaction({ title, value, type });

    this.transactions.push(transaction);

    return transaction;
  }
}

export default TransactionsRepository;
