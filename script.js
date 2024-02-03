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
  const status = document.getElementById("expenseStatus").value;

  const expense = {
    date: date,
    name: name,
    amount: amount,
    status: status,
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
  const total = document.getElementById("total");

  if (!total) {
    console.error("Element or total not found");
    return;
  }

  let totalAmount = 0;

  expenses.forEach((expense) => {
    totalAmount += parseFloat(expense.amount);
  });

  total.textContent = totalAmount.toLocaleString("id-ID", {
    style: "currency",
    currency: "IDR",
  });
}

function updateExpense(index) {
  const expenseToUpdate = expenses[index];

  document.getElementById("updateExpenseDate").value = expenseToUpdate.date;
  document.getElementById("updateExpenseName").value = expenseToUpdate.name;
  document.getElementById("updateExpenseAmount").value = expenseToUpdate.amount;
  document.getElementById("updateExpenseStatus").value = expenseToUpdate.status;

  const updateExpenseModal = new bootstrap.Modal(
    document.getElementById("updateExpenseModal")
  );
  updateExpenseModal.show();

  window.confirmUpdateExpense = function () {
    const updatedName = document.getElementById("updateExpenseName").value;
    const updatedAmount = document.getElementById("updateExpenseAmount").value;
    const updatedStatus = document.getElementById("updateExpenseStatus").value;

    if (updatedName && updatedAmount && updatedStatus) {
      const updatedExpense = {
        date: expenseToUpdate.date,
        name: updatedName,
        amount: updatedAmount,
        status: updatedStatus,
      };

      expenses[index] = updatedExpense;

      saveExpenses();
      updateTotal();
      displayExpenses();
      updateExpenseModal.hide();
    } else {
      alert("Pembaruan dibatalkan. Pastikan Anda mengisi semua informasi.");
    }
  };
}

function displayExpenses(expensesToDisplay = expenses) {
  const tableBody = document.getElementById("expenseTableBody");
  const total = document.getElementById("total");

  tableBody.innerHTML = "";

  let totalAmount = 0;

  expensesToDisplay.forEach((expense, index) => {
    const formattedAmount = parseFloat(expense.amount).toLocaleString("id-ID", {
      style: "currency",
      currency: "IDR",
    });

    const row = `<tr>
                    <td>${expense.date}</td>
                    <td>${expense.name}</td>
                    <td>${formattedAmount}</td>
                    <td><span class="btn btn-warning text-white">${expense.status}</span></td>
                    <td>
                      <button type="button" class="btn btn-info text-white" onclick="updateExpense(${index})">Update</button>
                      <button type="button" class="btn btn-danger" onclick="deleteExpense(${index})">Hapus</button>
                    </td>
                  </tr>`;

    tableBody.innerHTML += row;
    totalAmount += parseFloat(expense.amount);
  });

  total.textContent = totalAmount.toLocaleString("id-ID", {
    style: "currency",
    currency: "IDR",
  });
}

function searchExpenses() {
  const searchTerm = document.getElementById("searchInput").value.toLowerCase();
  const filteredExpenses = expenses.filter((expense) =>
    expense.name.toLowerCase().includes(searchTerm)
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
