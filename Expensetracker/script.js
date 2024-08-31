let expenses = [];
let totalAmount = 0;
let editIndex = null; // Track the index of the expense being edited

const categorySelect = document.getElementById('category_select');
const amountInput = document.getElementById('amount_input');
const infoInput = document.getElementById('info');
const dateInput = document.getElementById('date_input');
const addBtn = document.getElementById('add_btn');
const expenseTableBody = document.getElementById('expense-table-body');
const totalAmountCell = document.getElementById('total-amount');

addBtn.addEventListener('click', function(event) {
    event.preventDefault(); // Prevent the form from submitting

    const category = categorySelect.value;
    const amount = Number(amountInput.value);
    const info = infoInput.value;
    const date = dateInput.value;

    if (category === '' || isNaN(amount) || amount <= 0 || info === '' || date === '') {
        alert('Please fill in all fields with valid values.');
        return;
    }

    if (editIndex !== null) {
        // Update the existing expense
        const expense = expenses[editIndex];
        expense.category = category;
        expense.amount = amount;
        expense.info = info;
        expense.date = date;

        updateExpenseRow(editIndex, expense);
        editIndex = null; // Reset the editIndex
    } else {
        // Add a new expense
        const expense = { category, amount, info, date };
        expenses.push(expense);

        if (category === 'Income') {
            totalAmount += amount;
        } else if (category === 'Expense') {
            totalAmount -= amount;
        }

        totalAmountCell.textContent = totalAmount.toFixed(2);

        const newRow = expenseTableBody.insertRow();
        insertExpenseRow(newRow, expense);
    }

    resetForm();
});

function insertExpenseRow(row, expense) {
    const categoryCell = row.insertCell();
    const amountCell = row.insertCell();
    const infoCell = row.insertCell();
    const dateCell = row.insertCell();
    const actionsCell = row.insertCell();

    categoryCell.textContent = expense.category;
    amountCell.textContent = expense.amount.toFixed(2);
    infoCell.textContent = expense.info;
    dateCell.textContent = expense.date;

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.classList.add('delete-btn');
    deleteBtn.addEventListener('click', function() {
        deleteExpense(row, expense);
    });

    const editBtn = document.createElement('button');
    editBtn.textContent = 'Edit';
    editBtn.classList.add('edit-btn');
    editBtn.addEventListener('click', function() {
        editExpense(row, expense);
    });

    actionsCell.appendChild(editBtn);
    actionsCell.appendChild(deleteBtn);
}

function deleteExpense(row, expense) {
    const index = expenses.indexOf(expense);
    if (index > -1) {
        expenses.splice(index, 1);
    }

    if (expense.category === 'Income') {
        totalAmount -= expense.amount;
    } else if (expense.category === 'Expense') {
        totalAmount += expense.amount;
    }

    totalAmountCell.textContent = totalAmount.toFixed(2);
    row.remove();
}

function editExpense(row, expense) {
    // Pre-fill the form with the expense data
    categorySelect.value = expense.category;
    amountInput.value = expense.amount;
    infoInput.value = expense.info;
    dateInput.value = expense.date;

    // Set the editIndex to the current expense
    editIndex = expenses.indexOf(expense);
}

function updateExpenseRow(index, expense) {
    const row = expenseTableBody.rows[index];
    row.cells[0].textContent = expense.category;
    row.cells[1].textContent = expense.amount.toFixed(2);
    row.cells[2].textContent = expense.info;
    row.cells[3].textContent = expense.date;

    // Update the total amount
    totalAmount = expenses.reduce((total, exp) => {
        return exp.category === 'Income' ? total + exp.amount : total - exp.amount;
    }, 0);

    totalAmountCell.textContent = totalAmount.toFixed(2);
}

function resetForm() {
    categorySelect.value = '';
    amountInput.value = '';
    infoInput.value = '';
    dateInput.value = '';
}