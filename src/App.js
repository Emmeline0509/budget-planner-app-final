import React, { useState, useEffect } from "react";
import { Card, CardContent } from "./components/ui/card";
import { Input } from "./components/ui/input";
import { Button } from "./components/ui/button";
import { Checkbox } from "./components/ui/checkbox";
import { Label } from "./components/ui/label";
import { format, endOfMonth, differenceInDays } from "date-fns";

export default function BudgetPlanner() {
  const [balance, setBalance] = useState(0);
  const [extraIncome, setExtraIncome] = useState(0);
  const [fixedIncomes, setFixedIncomes] = useState([]);
  const [selectedExpenses, setSelectedExpenses] = useState([]);
  const [customExpenses, setCustomExpenses] = useState([]);
  const [fixedExpenses, setFixedExpenses] = useState([]);
  const [currentDate, setCurrentDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [newExpenseName, setNewExpenseName] = useState("");
  const [newExpenseAmount, setNewExpenseAmount] = useState("");
  const [newFixedName, setNewFixedName] = useState("");
  const [newFixedAmount, setNewFixedAmount] = useState("");
  const [newFixedIncomeName, setNewFixedIncomeName] = useState("");
  const [newFixedIncomeAmount, setNewFixedIncomeAmount] = useState("");

  useEffect(() => {
    const customStored = localStorage.getItem("customExpenses");
    const fixedStored = localStorage.getItem("fixedExpenses");
    const incomeStored = localStorage.getItem("fixedIncomes");
    if (customStored) {
      try {
        setCustomExpenses(JSON.parse(customStored));
      } catch (e) {
        console.error("Fout bij laden van customExpenses:", e);
      }
    }
    if (fixedStored) {
      try {
        setFixedExpenses(JSON.parse(fixedStored));
      } catch (e) {
        console.error("Fout bij laden van fixedExpenses:", e);
      }
    }
    if (incomeStored) {
      try {
        setFixedIncomes(JSON.parse(incomeStored));
      } catch (e) {
        console.error("Fout bij laden van fixedIncomes:", e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("customExpenses", JSON.stringify(customExpenses));
  }, [customExpenses]);

  useEffect(() => {
    localStorage.setItem("fixedExpenses", JSON.stringify(fixedExpenses));
  }, [fixedExpenses]);

  useEffect(() => {
    localStorage.setItem("fixedIncomes", JSON.stringify(fixedIncomes));
  }, [fixedIncomes]);

  const allExpenses = [...fixedExpenses, ...customExpenses];
  const totalFixedIncome = fixedIncomes.reduce((sum, inc) => sum + inc.amount, 0);

  const handleCheckboxChange = (name) => {
    setSelectedExpenses((prev) =>
      prev.includes(name) ? prev.filter((e) => e !== name) : [...prev, name]
    );
  };

  const handleAddExpense = () => {
    if (!newExpenseName || isNaN(parseFloat(newExpenseAmount))) return;
    const newEntry = { name: newExpenseName, amount: parseFloat(newExpenseAmount) };
    setCustomExpenses((prev) => [...prev, newEntry]);
    setNewExpenseName("");
    setNewExpenseAmount("");
  };

  const handleAddFixed = () => {
    if (!newFixedName || isNaN(parseFloat(newFixedAmount))) return;
    const newEntry = { name: newFixedName, amount: parseFloat(newFixedAmount) };
    setFixedExpenses((prev) => [...prev, newEntry]);
    setNewFixedName("");
    setNewFixedAmount("");
  };

  const handleAddFixedIncome = () => {
    if (!newFixedIncomeName || isNaN(parseFloat(newFixedIncomeAmount))) return;
    const newEntry = { name: newFixedIncomeName, amount: parseFloat(newFixedIncomeAmount) };
    setFixedIncomes((prev) => [...prev, newEntry]);
    setNewFixedIncomeName("");
    setNewFixedIncomeAmount("");
  };

  const handleDeleteExpense = (name) => {
    setCustomExpenses((prev) => prev.filter((e) => e.name !== name));
    setSelectedExpenses((prev) => prev.filter((e) => e !== name));
  };

  const handleDeleteFixed = (name) => {
    setFixedExpenses((prev) => prev.filter((e) => e.name !== name));
    setSelectedExpenses((prev) => prev.filter((e) => e !== name));
  };

  const handleDeleteFixedIncome = (name) => {
    setFixedIncomes((prev) => prev.filter((e) => e.name !== name));
  };

  const selectedTotal = selectedExpenses.reduce((sum, name) => {
    const exp = allExpenses.find((e) => e.name === name);
    return sum + (exp ? exp.amount : 0);
  }, 0);

  const totalAvailable = balance + extraIncome + totalFixedIncome;
  const remaining = totalAvailable - selectedTotal;
  const today = new Date(currentDate);
  const end = endOfMonth(today);
  const daysLeft = Math.max(differenceInDays(end, today) + 1, 0);

  const fullWeeks = Math.floor(daysLeft / 7);
  const extraDays = daysLeft % 7;
  const weeklyBudget = fullWeeks > 0 ? (remaining / daysLeft) * 7 : 0;
  const extraBudget = fullWeeks > 0 ? (remaining / daysLeft) * extraDays : remaining;

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Budget Planner</h1>
      <Card>
        <CardContent className="space-y-4 pt-6">
          <div>
            <Label>Bedrag op rekening</Label>
            <Input type="number" value={balance} onChange={(e) => setBalance(Number(e.target.value))} />
          </div>

          <div>
            <Label>Extra inkomen (optioneel)</Label>
            <Input type="number" value={extraIncome} onChange={(e) => setExtraIncome(Number(e.target.value))} />
          </div>

          <div>
            <Label>Datum</Label>
            <Input type="date" value={currentDate} onChange={(e) => setCurrentDate(e.target.value)} />
          </div>

          <div>
            <Label>Vaste inkomens</Label>
            <div className="grid gap-2">
              {fixedIncomes.map((inc) => (
                <div key={inc.name} className="flex items-center gap-2">
                  <span>{inc.name} (€{inc.amount})</span>
                  <Button size="sm" variant="outline" onClick={() => handleDeleteFixedIncome(inc.name)}>Verwijder</Button>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4">
            <Label>Nieuwe vaste inkomen toevoegen</Label>
            <div className="flex gap-2 items-center mt-2">
              <Input type="text" placeholder="Naam" value={newFixedIncomeName} onChange={(e) => setNewFixedIncomeName(e.target.value)} />
              <Input type="number" placeholder="Bedrag" value={newFixedIncomeAmount} onChange={(e) => setNewFixedIncomeAmount(e.target.value)} />
              <Button onClick={handleAddFixedIncome}>Toevoegen</Button>
            </div>
          </div>

          <div>
            <Label>Uitgaven</Label>
            <div className="grid gap-2">
              {allExpenses.map((exp) => (
                <div key={exp.name} className="flex items-center gap-2">
                  <Checkbox id={exp.name} checked={selectedExpenses.includes(exp.name)} onCheckedChange={() => handleCheckboxChange(exp.name)} />
                  <Label htmlFor={exp.name}>{exp.name} (€{exp.amount})</Label>
                  {customExpenses.some((e) => e.name === exp.name) && (
                    <Button size="sm" variant="destructive" onClick={() => handleDeleteExpense(exp.name)}>Verwijder</Button>
                  )}
                  {fixedExpenses.some((e) => e.name === exp.name) && (
                    <Button size="sm" variant="outline" onClick={() => handleDeleteFixed(exp.name)}>Verwijder vast</Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4">
            <Label>Nieuwe maandelijkse uitgave toevoegen</Label>
            <div className="flex gap-2 items-center mt-2">
              <Input type="text" placeholder="Naam" value={newExpenseName} onChange={(e) => setNewExpenseName(e.target.value)} />
              <Input type="number" placeholder="Bedrag" value={newExpenseAmount} onChange={(e) => setNewExpenseAmount(e.target.value)} />
              <Button onClick={handleAddExpense}>Toevoegen</Button>
            </div>
          </div>

          <div className="mt-4">
            <Label>Nieuwe vaste kost toevoegen</Label>
            <div className="flex gap-2 items-center mt-2">
              <Input type="text" placeholder="Naam" value={newFixedName} onChange={(e) => setNewFixedName(e.target.value)} />
              <Input type="number" placeholder="Bedrag" value={newFixedAmount} onChange={(e) => setNewFixedAmount(e.target.value)} />
              <Button onClick={handleAddFixed}>Toevoegen</Button>
            </div>
          </div>

          <div className="mt-4 space-y-2">
            <p><strong>Totaal beschikbaar (rekening + extra + vaste inkomens):</strong> €{totalAvailable}</p>
            <p><strong>Totaal uitgaven:</strong> €{selectedTotal}</p>
            <p><strong>Overschot:</strong> €{remaining}</p>
            <p><strong>Dagen resterend in maand:</strong> {daysLeft} dagen</p>
            <p><strong>Wekelijks budget:</strong> €{weeklyBudget.toFixed(2)}</p>
            {extraDays > 0 && <p><strong>Extra {extraDays} dagen budget:</strong> €{extraBudget.toFixed(2)}</p>}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
