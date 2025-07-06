import React, { useState, useEffect } from "react";
import { format, endOfMonth, differenceInDays } from "date-fns";

export default function App() {
  const [balance, setBalance] = useState(0);
  const [extraIncome, setExtraIncome] = useState(0);
  const [selectedExpenses, setSelectedExpenses] = useState([]);
  const [selectedIncomes, setSelectedIncomes] = useState([]);
  const [customExpenses, setCustomExpenses] = useState([]);
  const [fixedIncomes, setFixedIncomes] = useState([]);
  const [currentDate, setCurrentDate] = useState(format(new Date(), "yyyy-MM-dd"));

  const [newExpenseName, setNewExpenseName] = useState("");
  const [newExpenseAmount, setNewExpenseAmount] = useState("");
  const [newFixedIncomeName, setNewFixedIncomeName] = useState("");
  const [newFixedIncomeAmount, setNewFixedIncomeAmount] = useState("");

  useEffect(() => {
    const ce = localStorage.getItem("customExpenses");
    const fi = localStorage.getItem("fixedIncomes");
    if (ce) setCustomExpenses(JSON.parse(ce));
    if (fi) setFixedIncomes(JSON.parse(fi));
  }, []);

  useEffect(() => {
    localStorage.setItem("customExpenses", JSON.stringify(customExpenses));
    localStorage.setItem("fixedIncomes", JSON.stringify(fixedIncomes));
  }, [customExpenses, fixedIncomes]);

  const allExpenses = customExpenses;

  const handleCheckboxExpense = (name) => {
    setSelectedExpenses((prev) =>
      prev.includes(name) ? prev.filter((e) => e !== name) : [...prev, name]
    );
  };

  const handleCheckboxIncome = (name) => {
    setSelectedIncomes((prev) =>
      prev.includes(name) ? prev.filter((e) => e !== name) : [...prev, name]
    );
  };

  const handleAddCustomExpense = () => {
    if (!newExpenseName || isNaN(newExpenseAmount)) return;
    setCustomExpenses([
      ...customExpenses,
      { name: newExpenseName, amount: parseFloat(newExpenseAmount) },
    ]);
    setNewExpenseName("");
    setNewExpenseAmount("");
  };

  const handleAddFixedIncome = () => {
    if (!newFixedIncomeName || isNaN(newFixedIncomeAmount)) return;
    setFixedIncomes([
      ...fixedIncomes,
      { name: newFixedIncomeName, amount: parseFloat(newFixedIncomeAmount) },
    ]);
    setNewFixedIncomeName("");
    setNewFixedIncomeAmount("");
  };

  const totalExpenses = selectedExpenses.reduce((sum, name) => {
    const found = allExpenses.find((e) => e.name === name);
    return sum + (found?.amount || 0);
  }, 0);

  const totalIncomes = selectedIncomes.reduce((sum, name) => {
    const found = fixedIncomes.find((i) => i.name === name);
    return sum + (found?.amount || 0);
  }, 0);

  const totalAvailable = balance + extraIncome + totalIncomes;
  const remaining = totalAvailable - totalExpenses;

  const today = new Date(currentDate);
  const end = endOfMonth(today);
  const daysLeft = Math.max(1, differenceInDays(end, today) + 1);
  const weeklyBudget = ((remaining / daysLeft) * 7).toFixed(2);
  const extraDays = daysLeft % 7;
  const extraBudget = ((remaining / daysLeft) * extraDays).toFixed(2);

  const handleDeleteExpense = (expense) => {
    setCustomExpenses(customExpenses.filter((c) => c.name !== expense.name));
  };

  return (
    <div style={{ maxWidth: "600px", margin: "auto", padding: "2rem", fontFamily: "Arial" }}>
      <h1>Budget Planner</h1>

      <label>Bedrag op rekening:</label><br />
      <input type="number" value={balance} onChange={(e) => setBalance(Number(e.target.value))} /><br /><br />

      <label>Extra inkomen:</label><br />
      <input type="number" value={extraIncome} onChange={(e) => setExtraIncome(Number(e.target.value))} /><br /><br />

      <label>Datum:</label><br />
      <input type="date" value={currentDate} onChange={(e) => setCurrentDate(e.target.value)} /><br /><br />

      <h2>Vaste inkomens</h2>
      {fixedIncomes.map((i) => (
        <div key={i.name}>
          <input type="checkbox" checked={selectedIncomes.includes(i.name)} onChange={() => handleCheckboxIncome(i.name)} />
          {i.name} (€{i.amount}) <button onClick={() => setFixedIncomes(fixedIncomes.filter(f => f.name !== i.name))}>Verwijder</button>
        </div>
      ))}
      <input type="text" placeholder="Naam" value={newFixedIncomeName} onChange={(e) => setNewFixedIncomeName(e.target.value)} />
      <input type="number" placeholder="Bedrag" value={newFixedIncomeAmount} onChange={(e) => setNewFixedIncomeAmount(e.target.value)} />
      <button onClick={handleAddFixedIncome}>Toevoegen</button>

      <h2>Uitgaven</h2>
      {allExpenses.map((e) => (
        <div key={e.name}>
          <input type="checkbox" checked={selectedExpenses.includes(e.name)} onChange={() => handleCheckboxExpense(e.name)} />
          {e.name} (€{e.amount}) <button onClick={() => handleDeleteExpense(e)}>Verwijder</button>
        </div>
      ))}

      <h3>Nieuwe uitgave toevoegen</h3>
      <input type="text" placeholder="Naam" value={newExpenseName} onChange={(e) => setNewExpenseName(e.target.value)} />
      <input type="number" placeholder="Bedrag" value={newExpenseAmount} onChange={(e) => setNewExpenseAmount(e.target.value)} />
      <button onClick={handleAddCustomExpense}>Toevoegen</button>

      <hr />
      <p><strong>Totaal beschikbaar:</strong> €{totalAvailable}</p>
      <p><strong>Totale uitgaven:</strong> €{totalExpenses}</p>
      <p><strong>Overschot:</strong> €{remaining}</p>
      <p><strong>Dagen resterend in maand:</strong> {daysLeft}</p>
      <p><strong>Wekelijks budget:</strong> €{weeklyBudget}</p>
      {extraDays > 0 && <p><strong>Extra {extraDays} dagen budget:</strong> €{extraBudget}</p>}
    </div>
  );
}
