import React, { useState, useEffect } from "react";
import { format, endOfMonth, differenceInDays } from "date-fns";

export default function App() {
  const [balance, setBalance] = useState(0);
  const [extraIncome, setExtraIncome] = useState(0);
  const [selectedExpenses, setSelectedExpenses] = useState([]);
  const [selectedIncomes, setSelectedIncomes] = useState([]);
  const [customExpenses, setCustomExpenses] = useState([]);
  const [fixedExpenses, setFixedExpenses] = useState([]);
  const [fixedIncomes, setFixedIncomes] = useState([]);
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

    if (customStored) setCustomExpenses(JSON.parse(customStored));
    if (fixedStored) setFixedExpenses(JSON.parse(fixedStored));
    if (incomeStored) setFixedIncomes(JSON.parse(incomeStored));
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

  const handleCheckboxChange = (name) => {
    setSelectedExpenses((prev) =>
      prev.includes(name) ? prev.filter((e) => e !== name) : [...prev, name]
    );
  };

  const handleIncomeCheckboxChange = (name) => {
    setSelectedIncomes((prev) =>
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
    setFixedExpe
