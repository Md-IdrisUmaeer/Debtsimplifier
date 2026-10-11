const { netBalance, settle } = require("./settle");

describe("settle", () => {
    test("3 people, 2 expenses: needs 2 payments", () => {
        const expenses = [
            { paidBy: "A", amount: 300, splits: [{ user: "A", amount: 100 }, { user: "B", amount: 100 }, { user: "C", amount: 100 }] },
            { paidBy: "B", amount: 90, splits: [{ user: "A", amount: 45 }, { user: "C", amount: 45 }] },
        ];
        const result = settle(netBalance(expenses));
        expect(result).toEqual([
            { from: "C", to: "A", amount: 145 },
            { from: "B", to: "A", amount: 10 },
        ]);
    });
    test("paise payment", () => {
        const expenses = [
            { paidBy: "A", amount: 0.29, splits: [{ user: "B", amount: 0.29 }] },
        ];
        const result = settle(netBalance(expenses));
        expect(result).toEqual([
            { from: "B", to: "A", amount: 0.29 },
        ]);
    });
    test("multiple splits", () => {
        const expenses = [
            { paidBy: "A", amount: 3, splits: [{ user: "B", amount: 1 }, { user: "D", amount: 2 }] },
            { paidBy: "C", amount: 4, splits: [{ user: "B", amount: 4 }] },
        ];
        const result = settle(netBalance(expenses));
        expect(result).toEqual([
            { from: "B", to: "C", amount: 4 },
            { from: "B", to: "A", amount: 1 },
            { from: "D", to: "A", amount: 2 },
        ]);
    });
    test("decimal payments", () => {
        const expenses = [
            { paidBy: "A", amount: 0.1, splits: [{ user: "B", amount: 0.1 }] },
            { paidBy: "A", amount: 0.2, splits: [{ user: "C", amount: 0.2 }] },
        ];
        const result = settle(netBalance(expenses));
        expect(result).toEqual([
            { from: "C", to: "A", amount: 0.2 },
            { from: "B", to: "A", amount: 0.1 },
        ]);
    });
    test("100/3 case", () => {
        const expenses = [
            { paidBy: "A", amount: 100, splits: [{ user: "A", amount: 33.33 }, { user: "B", amount: 33.33 }, { user: "C", amount: 33.34 }] },
        ];
        const result = settle(netBalance(expenses));
        expect(result).toEqual([
            { from: "C", to: "A", amount: 33.34 },
            { from: "B", to: "A", amount: 33.33 },
        ]);
    });
    test("No expense", () => {
        const expenses = [];
        const result = settle(netBalance(expenses));
        expect(result).toEqual([]);
    });
    test("Settled", () => {
        const expenses = [
            { paidBy: "A", amount: 100, splits: [{ user: "A", amount: 100 }] }
        ];
        const result = settle(netBalance(expenses));
        expect(result).toEqual([]);
    })
});
describe("netBalance", () => {
    test("3 people, 2 expenses: needs 2 payments", () => {
        const expenses = [
            { paidBy: "A", amount: 300, splits: [{ user: "A", amount: 100 }, { user: "B", amount: 100 }, { user: "C", amount: 100 }] },
            { paidBy: "B", amount: 90, splits: [{ user: "A", amount: 45 }, { user: "C", amount: 45 }] },
        ];
        const result = netBalance(expenses);
        expect(result).toEqual({ A: 15500, B: -1000, C: -14500 });
    });
    test("300 split", () => {
        const expenses = [
            { paidBy: "A", amount: 300, splits: [{ user: "A", amount: 100 }, { user: "B", amount: 100 }, { user: "C", amount: 100 }] },
        ];
        expect(() => netBalance(expenses)).not.toThrow("Split Does not add up to expense");
    });
    test("Insufficient split", () => {
        const expenses = [
            { paidBy: "A", amount: 100, splits: [{ user: "B", amount: 60 }] },
        ];
        expect(() => netBalance(expenses)).toThrow("Split Does not add up to expense");
    });
    test("More split than expense", () => {
        const expenses = [
            { paidBy: "A", amount: 100, splits: [{ user: "C", amount: 120 }] },
        ];
        expect(() => netBalance(expenses)).toThrow("Split Does not add up to expense");
    });
    test("Proper Decimal Split", () => {
        const expenses = [
            { paidBy: "A", amount: 100, splits: [{ user: "A", amount: 33.33 }, { user: "B", amount: 33.33 }, { user: "C", amount: 33.34 }] },
        ];
        expect(() => netBalance(expenses)).not.toThrow("Split Does not add up to expense");
    });
});
