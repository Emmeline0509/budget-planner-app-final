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
      prev.includes(name) ? prev.filter
