import { createContext, useContext, useReducer, useEffect } from "react";
import { loadState, saveState } from "../utils/storage";
import { seedData } from "../data/seed";
// Initial State
function getInitialState() {
  const saved = loadState();
  return saved || seedData; // use localStorage or fall back to seed
}
// Reducer
function bankReducer(state, action) {
  switch (action.type) {
    case "CREATE_ACCOUNT": {
      const newAccount = {
        id: `ACC${String(state.accounts.length + 1).padStart(3, "0")}`,
        memberNumber: `MBR-${String(state.accounts.length + 1).padStart(
          3,
          "0",
        )}`,
        balance: 0,
        status: "active",
        createdAt: new Date().toISOString(),
        ...action.payload,
      };
      return { ...state, accounts: [...state.accounts, newAccount] };
    }
    case "DEPOSIT": {
      const { accountId, amount, description } = action.payload;
      const txn = {
        id: `TXN${Date.now()}`,
        accountId,
        type: "deposit",
        amount,
        description,
        date: new Date().toISOString(),
        balanceAfter: 0, // will be calculated below
      };
      const updatedAccounts = state.accounts.map((acc) => {
        if (acc.id !== accountId) return acc;
        const newBalance = acc.balance + amount;
        txn.balanceAfter = newBalance;
        return { ...acc, balance: newBalance, status: "active" };
      });
      return {
        ...state,
        accounts: updatedAccounts,
        transactions: [txn, ...state.transactions],
      };
    }
    case "WITHDRAW": {
      const { accountId, amount, description } = action.payload;
      const account = state.accounts.find((a) => a.id === accountId);
      if (!account || account.balance < amount) return state; // guard
      const txn = {
        id: `TXN${Date.now()}`,
        accountId,
        type: "withdrawal",
        amount,
        description,
        date: new Date().toISOString(),
        balanceAfter: account.balance - amount,
      };
      const updatedAccounts = state.accounts.map((acc) =>
        acc.id === accountId ? { ...acc, balance: acc.balance - amount } : acc,
      );
      return {
        ...state,
        accounts: updatedAccounts,
        transactions: [txn, ...state.transactions],
      };
    }

    case "TRANSFER": {
      const { fromId, toId, amount, description } = action.payload;
      const from = state.accounts.find((a) => a.id === fromId);
      const to = state.accounts.find((a) => a.id === toId);
      if (!from || !to || from.balance < amount) return state;
      const txn = {
        id: `TXN${Date.now()}`,
        accountId: fromId,
        type: "transfer",
        amount,
        description: description || `Transfer to ${to.memberName}`,
        date: new Date().toISOString(),
        balanceAfter: from.balance - amount,
        toAccountId: toId,
      };
      const updatedAccounts = state.accounts.map((acc) => {
        if (acc.id === fromId) return { ...acc, balance: acc.balance - amount };
        if (acc.id === toId) return { ...acc, balance: acc.balance + amount };
        return acc;
      });
      return {
        ...state,
        accounts: updatedAccounts,
        transactions: [txn, ...state.transactions],
      };
    }
    case "RESET_DATA":
      return seedData;
    default:
      throw new Error(`Unknown action: ${action.type}`);
  }
}
// Context & Provider
const BankContext = createContext(null);
export function BankProvider({ children }) {
  const [state, dispatch] = useReducer(bankReducer, null, getInitialState);
  // Auto-save to localStorage every time state changes
  useEffect(() => {
    saveState(state);
  }, [state]);
  // Convenience functions
  const createAccount = (payload) =>
    dispatch({ type: "CREATE_ACCOUNT", payload });
  const deposit = (payload) => dispatch({ type: "DEPOSIT", payload });
  const withdraw = (payload) => dispatch({ type: "WITHDRAW", payload });
  const transfer = (payload) => dispatch({ type: "TRANSFER", payload });
  const resetData = () => dispatch({ type: "RESET_DATA" });
  // Derived statistics
  const totalBalance = state.accounts.reduce((sum, a) => sum + a.balance, 0);
  const activeAccounts = state.accounts.filter(
    (a) => a.status === "active",
  ).length;
  const totalDeposits = state.transactions
    .filter((t) => t.type === "deposit")
    .reduce((s, t) => s + t.amount, 0);
  const totalWithdrawals = state.transactions
    .filter((t) => t.type === "withdrawal")
    .reduce((s, t) => s + t.amount, 0);
  return (
    <BankContext.Provider
      value={{
        accounts: state.accounts,
        transactions: state.transactions,
        createAccount,
        deposit,
        withdraw,
        transfer,
        resetData,
        totalBalance,
        activeAccounts,
        totalDeposits,
        totalWithdrawals,
      }}
    >
      {children}
    </BankContext.Provider>
  );
}

export function useBank() {
  const ctx = useContext(BankContext);
  if (!ctx) throw new Error("useBank must be used inside <BankProvider>");
  return ctx;
}
