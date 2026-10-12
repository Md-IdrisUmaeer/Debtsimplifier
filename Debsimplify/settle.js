// net balance
function netBalance(expenses) {
    const balances = {};
    for (const expense of expenses) {
        if (!(balances[expense.paidBy])) {
            balances[expense.paidBy] = 0;
        }
        balances[expense.paidBy] += Math.round(expense.amount * 100);
        let splitsum = 0;
        for (const split of expense.splits) {
            if (!(balances[split.user])) {
                balances[split.user] = 0;
            }
            balances[split.user] -= Math.round(split.amount * 100);
            splitsum += Math.round(split.amount * 100);
        };
        if (splitsum !== Math.round((expense.amount * 100))) throw new Error("Split Does not add up to expense");

    };
    return balances;
}

// settle debts
function settle(balances) {
    const settlement = [];
    const debtors = (Object.entries(balances).filter(([key, value]) => value < 0)).sort((a, b) => a[1] - b[1]);
    const creditors = (Object.entries(balances).filter(([key, value]) => value > 0)).sort((a, b) => b[1] - a[1]);
    let i = 0;
    let j = 0;
    while (i < creditors.length && j < debtors.length) {
        let owe = creditors[i][1];
        while (owe > 0) {
            let own = -debtors[j][1];
            let amount = Math.min(owe, own);
            const obj = { from: debtors[j][0], to: creditors[i][0], amount: amount / 100 };
            settlement.push(obj);
            owe -= amount;
            creditors[i][1] -= amount;
            if (own <= amount) {
                j++;
            }
            else {
                debtors[j][1] += amount;
            }
            if (owe === 0) {
                i++;
            }
        }
    }
    return settlement;
}
module.exports = { netBalance, settle }