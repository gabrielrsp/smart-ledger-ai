import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Wallet } from "lucide-react";
import { Transaction } from "@/lib/validations/transaction";

export function SummaryCards ({ data }: { data: Transaction[] }) {
  const totals = useMemo(() => {
    return data.reduce(
      (acc, curr) => {
        const amount = Math.abs(curr.amount);
        if (curr.amount > 0) acc.income += amount;
        else acc.expense += amount;
        return acc;
      },
      { income: 0, expense: 0 }
    );
  }, [data]);

  const balance = totals.income - totals.expense;

  const cards = [
    {
      title: "Incomes",
      value: totals.income,
      icon: TrendingUp,
      color: "text-emerald-600",
    },
    {
      title: "Expenses",
      value: totals.expense,
      icon: TrendingDown,
      color: "text-rose-600",
    },
    {
      title: "Net Balance",
      value: balance,
      icon: Wallet,
      color: balance >= 0 ? "text-emerald-600" : "text-rose-600",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-3 w-full max-w-4xl animate-in fade-in slide-in-from-bottom-4 duration-500">
      {cards.map((card, index) => (
        <Card key={index} className="border-zinc-100 shadow-sm overflow-hidden relative">
          <div className={`absolute top-0 left-0 w-1 h-full ${card.color.replace('text', 'bg')}`} />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-zinc-500">
              {card.title}
            </CardTitle>
            <card.icon className={`h-4 w-4 ${card.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-zinc-900">
              {new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
              }).format(card.value)}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}