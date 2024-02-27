$(document).ready(function () {
  const expenses = [];
  let pieChartInstance = null;
  let lineChartInstance = null;

  function updateExpensesList() {
    const expenseList = $("#expense-list");
    expenseList.empty();
    expenses.forEach((item, index) => {
      const listItem = $("<li></li>").html(
        `${item.expense}: $${item.amount} (${item.date} at ${item.time}) <button class="delete-button">Delete</button>`
      );
      listItem.find(".delete-button").on("click", function () {
        deleteExpense(index);
      });
      expenseList.append(listItem);
    });
  }

  function updateTotal() {
    const totalExpenses = $("#total-expenses");
    const total = expenses.reduce((acc, item) => acc + item.amount, 0);
    totalExpenses.text(`Total: $${total}`);
  }

  function updatePieChart() {
    if (pieChartInstance) {
      pieChartInstance.destroy();
    }

    const pieChartCanvas = $("#pieChart")[0].getContext("2d");
    const labels = expenses.map((item) => item.expense);
    const uniqueLabels = [...new Set(labels)];
    const data = uniqueLabels.map((label) => {
      const totalAmount = expenses
        .filter((item) => item.expense === label)
        .reduce((acc, item) => acc + item.amount, 0);
      return totalAmount;
    });

    pieChartInstance = new Chart(pieChartCanvas, {
      type: "pie",
      data: {
        labels: uniqueLabels,
        datasets: [
          {
            data: data,
            backgroundColor: [
              "#e74c3c",
              "#3498db",
              "#2ecc71",
              "#9b59b6",
              "#e67e22",
              "#fd79a8",
            ],
          },
        ],
      },
    });
  }

  function updateLineChart() {
    if (lineChartInstance) {
      lineChartInstance.destroy();
    }

    const lineChartCanvas = $("#lineChart")[0].getContext("2d");
    const dates = expenses.map((item) => item.date);
    const amounts = expenses.map((item) => item.amount);

    lineChartInstance = new Chart(lineChartCanvas, {
      type: "line",
      data: {
        labels: dates,
        datasets: [
          {
            label: "Expenses over Time",
            data: amounts,
            borderColor: "#3498db",
            fill: false,
          },
        ],
      },
    });
  }

  function deleteExpense(index) {
    expenses.splice(index, 1);
    updateExpensesList();
    updateTotal();
    updatePieChart();
    updateLineChart();
  }

  $("#expense-form").submit(function (e) {
    e.preventDefault();

    const expenseInput = $("#expense");
    const amountInput = $("#amount");
    const dateInput = $("#date");
    const timeInput = $("#time");

    const expense = expenseInput.val();
    const amount = parseFloat(amountInput.val());
    const date = dateInput.val();
    const time = timeInput.val();

    if (expense.trim() === "" || isNaN(amount) || amount <= 0) {
      alert("Please enter a valid expense and amount.");
    } else {
      expenses.push({ expense, amount, date, time });
      updateExpensesList();
      updateTotal();
      updatePieChart();
      updateLineChart();
      expenseInput.val("");
      amountInput.val("");
      dateInput.val("");
      timeInput.val("");
    }
  });
});
