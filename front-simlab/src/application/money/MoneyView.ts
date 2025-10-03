export class MoneyView {
    private constructor(
        public amount: number
    ) {
        this.amount = amount
    }

    static toViewModel(value: number): MoneyView {
        return new MoneyView(value)
    }

    formatToIDR(): string {
        const absAmount = Math.abs(this.amount);
        const formatted = `Rp${absAmount.toLocaleString('id-ID', { minimumFractionDigits: 0 })}`;
        return this.amount < 0 ? `- ${formatted}` : formatted;
    }
}