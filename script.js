let expenses = JSON.parse(localStorage.getItem("expenses")) || [];

const expenseDateInput = document.getElementById("expenseDate");
const today = new Date().toISOString().split("T")[0];
expenseDateInput.value = today;

function saveExpenses() {
  localStorage.setItem("expenses", JSON.stringify(expenses));

  document.getElementById("expenseName").value = "";
  document.getElementById("expenseAmount").value = "";

  const expenseDateInput = document.getElementById("expenseDate");

  const today = new Date().toISOString().split("T")[0];
  expenseDateInput.value = today;
}

function addExpense() {
  const date = document.getElementById("expenseDate").value;
  const name = document.getElementById("expenseName").value;
  const amount = document.getElementById("expenseAmount").value;
  const person = document.getElementById("expensePerson").value;

  const expense = {
    date: date,
    name: name,
    amount: amount,
    person: person,
  };

  expenses.push(expense);

  const jsonData = JSON.stringify(expenses);
  console.log(jsonData);

  saveExpenses();
  displayExpenses();
}

function deleteExpense(index) {
  expenses.splice(index, 1);
  saveExpenses();
  updateTotal();
  displayExpenses();
}

function updateTotal() {
  const totalA = document.getElementById("totalA");
  const totalI = document.getElementById("totalI");

  if (!totalA || !totalI) {
    console.error("Element totalA or totalI not found");
    return;
  }

  const totalPerPerson = {
    A: 0,
    I: 0,
  };

  expenses.forEach((expense) => {
    totalPerPerson[expense.person] += parseFloat(expense.amount);
  });

  if (totalPerPerson["A"]) {
    totalA.textContent = totalPerPerson["A"].toLocaleString("id-ID", {
      style: "currency",
      currency: "IDR",
    });
  } else {
    totalA.textContent = "Rp 0.00";
  }

  if (totalPerPerson["I"]) {
    totalI.textContent = totalPerPerson["I"].toLocaleString("id-ID", {
      style: "currency",
      currency: "IDR",
    });
  } else {
    totalI.textContent = "Rp 0.00";
  }
}

function displayExpenses(expensesToDisplay = expenses) {
  const tableBody = document.getElementById("expenseTableBody");
  const totalA = document.getElementById("totalA");
  const totalI = document.getElementById("totalI");

  tableBody.innerHTML = "";

  const totalPerPerson = {};

  expensesToDisplay.forEach((expense, index) => {
    const formattedAmount = parseFloat(expense.amount).toLocaleString("id-ID", {
      style: "currency",
      currency: "IDR",
    });
    const row = `<tr>
                    <td>${expense.date}</td>
                    <td>${expense.name}</td>
                    <td>${formattedAmount}</td>
                    <td>${expense.person}</td>
                    <td>
                      <button type="button" class="btn btn-danger" onclick="deleteExpense(${index})">Hapus</button>
                    </td>
                  </tr>`;
    tableBody.innerHTML += row;

    totalPerPerson[expense.person] =
      (totalPerPerson[expense.person] || 0) + parseFloat(expense.amount);
  });

  if (totalPerPerson["A"]) {
    totalA.textContent = totalPerPerson["A"].toLocaleString("id-ID", {
      style: "currency",
      currency: "IDR",
    });
  }

  if (totalPerPerson["I"]) {
    totalI.textContent = totalPerPerson["I"].toLocaleString("id-ID", {
      style: "currency",
      currency: "IDR",
    });
  }
}

function searchExpenses() {
  const searchTerm = document.getElementById("searchInput").value.toLowerCase();
  const filteredExpenses = expenses.filter((expense) =>
    expense.person.toLowerCase().includes(searchTerm)
  );
  displayExpenses(filteredExpenses);
}

function filterExpenses() {
  const selectedDate = document.getElementById("dateFilter").value;
  const filteredExpenses = expenses.filter(
    (expense) => expense.date === selectedDate
  );
  displayExpenses(filteredExpenses);
}

function resetFilters() {
  document.getElementById("searchInput").value = "";
  document.getElementById("dateFilter").value = "";
  displayExpenses();
}

displayExpenses();
