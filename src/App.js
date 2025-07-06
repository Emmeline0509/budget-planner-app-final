import React, { useState, useEffect } from "react";
import { format, endOfMonth, differenceInDays } from "date-fns";

export default function App() {
  const [balance, setBalance] = useState(0);
  const [extraIncome, setExtraIncome] = useState(0);
  const [selectedExpenses, setSelectedExpenses] = useState([]);
  const [customExpenses, setCustomExpenses] = useState([]);
  const [fixedExpenses, setFixedExpenses] = useState([]);
  const [currentDate, setCurrentDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [newExpenseName, setNewExpenseName] = useState("");
  const [newExpenseAmount, setNewExpenseAmount] = useState("");
  const [newFixedName, setNewFixedName] = useState("");
  const [newFixedAmount, setNewFixedAmount] = useState("");

  useEffect(() => {
    const customStored = localStorage.getItem("customExpenses");
    const fixedStored = localStorage.getItem("fixedExpenses");
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
  }, []);

  useEffect(() => {
    localStorage.setItem("customExpenses", JSON.stringify(customExpenses));
  }, [customExpenses]);

  useEffect(() => {
    localStorage.setItem("fixedExpenses", JSON.stringify(fixedExpenses));
  }, [fixedExpenses]);

  const allExpenses = [...fixedExpenses, ...customExpenses];

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

  const handleDeleteExpense = (name) => {
    setCustomExpenses((prev) => prev.filter((e) => e.name !== name));
    setSelectedExpenses((prev) => prev.filter((e) => e !== name));
  };

  const handleDeleteFixed = (name) => {
    setFixedExpenses((prev) => prev.filter((e) => e.name !== name));
    setSelectedExpenses((prev) => prev.filter((e) => e !== name));
  };

  const selectedTotal = selectedExpenses.reduce((sum, name) => {
    const exp = allExpenses.find((e) => e.name === name);
    return sum + (exp ? exp.amount : 0);
  }, 0);

  const totalAvailable = balance + extraIncome;
  const remaining = totalAvailable - selectedTotal;
  const today = new Date(currentDate);
  const end = endOfMonth(today);
  const daysLeft = Math.max(differenceInDays(end, today) + 1, 0);

  const fullWeeks = Math.floor(daysLeft / 7);
  const extraDays = daysLeft % 7;
  const weeklyBudget = fullWeeks > 0 ? (remaining / daysLeft) * 7 : 0;
  const extraBudget = fullWeeks > 0 ? (remaining / daysLeft) * extraDays : remaining;

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif", maxWidth: "600px", margin: "auto" }}>
      <h1>Budget Planner</h1>

      <label>Bedrag op rekening:</label>
      <input type="number" value={balance} onChange={(e) => setBalance(Number(e.target.value))} /><br/>

      <label>Extra inkomen (optioneel):</label>
      <input type="number" value={extraIncome} onChange={(e) => setExtraIncome(Number(e.target.value))} /><br/>

      <label>Datum:</label>
      <input type="date" value={currentDate} onChange={(e) => setCurrentDate(e.target.value)} /><br/>

      <h2>Uitgaven</h2>
      {allExpenses.map((exp) => (
        <div key={exp.name}>
          <input
            type="checkbox"
            checked={selectedExpenses.includes(exp.name)}
            onChange={() => handleCheckboxChange(exp.name)}
          />
          {exp.name} (€{exp.amount})
          {customExpenses.some((e) => e.name === exp.name) && (
            <button onClick={() => handleDeleteExpense(exp.name)}>Verwijder</button>
          )}
          {fixedExpenses.some((e) => e.name === exp.name) && (
            <button onClick={() => handleDeleteFixed(exp.name)}>Verwijder vast</button>
          )}
        </div>
      ))}

      <h3>Nieuwe maandelijkse uitgave toevoegen</h3>
      <input type="text" placeholder="Naam" value={newExpenseName} onChange={(e) => setNewExpenseName(e.target.value)} />
      <input type="number" placeholder="Bedrag" value={newExpenseAmount} onChange={(e) => setNewExpenseAmount(e.target.value)} />
      <button onClick={handleAddExpense}>Toevoegen</button>

      <h3>Nieuwe vaste kost toevoegen</h3>
      <input type="text" placeholder="Naam" value={newFixedName} onChange={(e) => setNewFixedName(e.target.value)} />
      <input type="number" placeholder="Bedrag" value={newFixedAmount} onChange={(e) => setNewFixedAmount(e.target.value)} />
      <button onClick={handleAddFixed}>Toevoegen</button>

      <hr/>
      <p><strong>Totaal beschikbaar:</strong> €{totalAvailable}</p>
      <p><strong>Totaal geselecteerde uitgaven:</strong> €{selectedTotal}</p>
      <p><strong>Overschot:</strong> €{remaining}</p>
      <p><strong>Dagen resterend in maand:</strong> {daysLeft}</p>
      <p><strong>Wekelijks budget:</strong> €{weeklyBudget.toFixed(2)}</p>
      {extraDays > 0 && <p><strong>Extra {extraDays} dagen budget:</strong> €{extraBudget.toFixed(2)}</p>}
    </div>
  );
}
