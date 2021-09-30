'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP
// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

// display Movments 
const displayMovments = function (movements, sort = false) {
  containerMovements.innerHTML = '';
  const mov = sort ? movements.slice().sort((a, b) => a - b) : movements;
  mov.forEach(function (mov, ind) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const html = `
    <div class="movements__row">
    <div class="movements__type movements__type--${type}">${ind + 1} ${type}</div>
    <div class="movements__value">${mov}Tk</div>
    </div>
    `;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

// Display Balance 
const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${acc.balance}Tk`;
};
// Display Summary 
const calcDisplaySummary = function (acc) {
  const incomes = acc.movements.filter(mov => mov > 0).reduce((acc, mov) => acc + mov, 0)
  labelSumIn.textContent = `${incomes}Tk`;
  const out = acc.movements.filter(arr => arr < 0).reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(out)}Tk`;
  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter(deposit => deposit >= 1)
    .reduce((acc, int, i, arr) => acc + int, 0);
  labelSumInterest.textContent = `${interest}Tk`;
};
// Update UI 
const updateUi = function (acc) {
  // Display Summary
  calcDisplaySummary(acc);
  // display balance 
  calcDisplayBalance(acc);
  // Display Movments     
  displayMovments(acc.movements);
};
// User name Create 
const createUserNames = function (acc) {
  acc.forEach(function (accs) {
    accs.name = accs.owner.toLowerCase().split(' ').map(word => word[0]).join('');
  });
};
createUserNames(accounts);
// Corrent Account
let corretAccount;
btnLogin.addEventListener('click', function (e) {
  e.preventDefault();
  corretAccount = accounts.find(acc => acc.name === inputLoginUsername.value);
  if (corretAccount?.pin === Number(inputLoginPin.value)) {
    // Display UI and Massage 
    containerApp.style.opacity = '1';
    labelWelcome.textContent = `Welcome💖 ${corretAccount.owner.split(' ')[0]}`;
    // clear input fields
    inputLoginPin.value = inputLoginUsername.value = '';
    inputLoginPin.blur();
    // update UI
    updateUi(corretAccount);
  } else {
    alert(`${inputLoginUsername.value} 😈 Wrong User!`);
  }
});
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(acc => acc.name === inputTransferTo.value);
  // input fields clean
  inputTransferTo.value = inputTransferAmount.value = '';
  // transfer Amount 
  if (amount > 0 && corretAccount.balance >= amount && receiverAcc && receiverAcc?.name !== corretAccount.name) {
    corretAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);
    updateUi(corretAccount);
  } else {
    alert(`${inputLoginUsername.value} 😈 Wrong User!`);
  };
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  if (inputCloseUsername.value === corretAccount.name && Number(inputClosePin.value) === corretAccount.pin) {
    // delete account index 
    const index = accounts.findIndex(acc => acc.name === corretAccount.name);
    // delete account 
    accounts.splice(index, 1);
    containerApp.style.opacity = 0;
  } else {
    alert(`${inputLoginUsername.value} 😈 Wrong User!`);
  };
  // input fields clean
  inputCloseUsername.value = inputClosePin.value = '';
});
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputLoanAmount.value);
  if (amount > 0 && corretAccount.movements.some(mov => mov >= amount * 0.1)) {
    corretAccount.movements.push(amount);
    updateUi(corretAccount);
    inputLoanAmount.value = '';
  };
});
let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovments(corretAccount.movements, !sorted);
  sorted = !sorted;
});

////////////////-Finish-//////////////