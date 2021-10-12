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

  movementsDates: [
    '2021-09-04T17:01:17.194Z',
    '2021-08-02T23:36:17.929Z',
    '2021-07-05T10:51:36.790Z',
    '2021-10-02T14:11:59.604Z',
    '2021-10-03T10:17:24.185Z',
    '2021-10-04T09:15:04.904Z',
    '2021-10-05T07:42:02.383Z',
    '2021-10-06T21:31:17.178Z',
  ],
  currency: 'BDT',
  locale: 'bn-BN', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2021-11-04T09:15:04.904Z',
    '2021-09-04T17:01:17.194Z',
    '2021-08-02T23:36:17.929Z',
    '2021-07-05T10:51:36.790Z',
    '2021-10-02T14:11:59.604Z',
    '2021-10-03T10:17:24.185Z',
    '2021-10-05T07:42:02.383Z',
    '2021-10-06T21:31:17.178Z',
  ],
  currency: 'SAR',
  locale: 'ar-SA',
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,

  movementsDates: [
    '2021-09-04T17:01:17.194Z',
    '2021-08-02T23:36:17.929Z',
    '2021-07-05T10:51:36.790Z',
    '2021-10-02T14:11:59.604Z',
    '2021-10-03T10:17:24.185Z',
    '2021-10-04T09:15:04.904Z',
    '2021-10-05T07:42:02.383Z',
    '2021-10-06T21:31:17.178Z',
  ],
  currency: 'INR',
  locale: 'hi-IN',
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,

  movementsDates: [
    '2021-07-05T10:51:36.790Z',
    '2021-08-02T23:36:17.929Z',
    '2021-10-06T21:31:17.178Z',
    '2021-10-05T07:42:02.383Z',
    '2021-10-03T10:17:24.185Z',
  ],
  currency: 'USD',
  locale: 'en-US',
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
////////////////////////-------->        <-------/////////////////////////////
////////////////////////--------Function-------/////////////////////////////
////////////////////////--------Function-------/////////////////////////////
////////////////////////-------->        <-------/////////////////////////////

// Formate Date 
const formatDate = (acc, date) => {
  const calcDaysPass = (date1, date2) => {
    return Math.round(Math.abs((date2 - date1) / (1000 * 60 * 60 * 24)));
  };
  const daysPass = calcDaysPass(new Date(), date);
  if (daysPass === 0) return 'Today';
  if (daysPass === 1) return 'Yesterday';
  if (daysPass <= 7) return `${daysPass} Days ago`;
  return new Intl.DateTimeFormat(acc.locale).format()
}
// formatCurrency//
const formatCur = function (value, locale, currency) {
  const formarMov = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(Math.abs(value));
  return formarMov;
};
// display Movments 
const displayMovments = function (acc, sort = false) {
  containerMovements.innerHTML = '';
  const movs = sort ? acc.movements.slice().sort((a, b) => a - b) : acc.movements;
  movs.forEach(function (mov, ind) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const date = new Date(acc.movementsDates[ind]);
    const displayDate = formatDate(acc, date);
    const formatMov = formatCur(mov, acc.locale, acc.currency);
    const html = `
    <div class="movements__row">
    <div class="movements__type movements__type--${type}">${ind + 1} ${type}</div>
    <div class="movements__date">${displayDate}</div>
    <div class="movements__value">${formatMov}</div>
    </div>
    `;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

// Display Balance 
const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${formatCur(acc.balance, acc.locale, acc.currency)}`;
};
// Display Summary 
const calcDisplaySummary = function (acc) {
  const incomes = acc.movements.filter(mov => mov > 0).reduce((acc, mov) => acc + mov, 0)
  labelSumIn.textContent = `${formatCur(incomes, acc.locale, acc.currency)}`;
  const out = acc.movements.filter(arr => arr < 0).reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${formatCur(out, acc.locale, acc.currency)}`;
  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter(deposit => deposit >= 1)
    .reduce((acc, int, i, arr) => acc + int, 0);
  labelSumInterest.textContent = `${formatCur(interest, acc.locale, acc.currency)}`;
};
// Update UI 
const updateUi = function (acc) {
  // Display Summary
  calcDisplaySummary(acc);
  // display balance 
  calcDisplayBalance(acc);
  // Display Movments     
  displayMovments(acc);
};
// User name Create 
const createUserNames = function (acc) {
  acc.forEach(function (accs) {
    accs.name = accs.owner.toLowerCase().split(' ').map(word => word[0]).join('');
  });
};
createUserNames(accounts);
// Corrent Account
let corretAccount, timer;
const StartTimerLogOut = function () {
  const trick = () => {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(Math.trunc(time % 60)).padStart(2, 0);
    // IN each call, print the remaining time to UI
    labelTimer.textContent = `${min}:${sec}`;
    // when 0 seconds, trop timer and log out user 
    if (time === 0) {
      clearInterval(timer);
      containerApp.style.opacity = 0;
      labelWelcome.textContent = `Log in to get started`;
    };
    // decrede 1s
    time--;
  };
  // set the time //
  let time = 120;

  // call the timer every seconds
  trick();
  const timer = setInterval(trick, 1000);
  return timer;
};
btnLogin.addEventListener('click', function (e) {
  e.preventDefault();
  corretAccount = accounts.find(acc => acc.name === inputLoginUsername.value);
  if (corretAccount?.pin === Number(inputLoginPin.value)) {
    // Display UI and Massage 
    labelWelcome.textContent = `Welcome💖 ${corretAccount.owner.split(' ')[0]}`;
    containerApp.style.opacity = 1;
    // Crate Date and Time
    const now = new Date();
    const option = {
      hour: 'numeric',
      minute: 'numeric',
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
      // weekday: 'long',
    };
    labelDate.textContent = new Intl.DateTimeFormat(corretAccount.locale, option).format(now);
    // clear input fields
    inputLoginPin.value = inputLoginUsername.value = '';
    inputLoginPin.blur();
    // logOut Timer
    if (timer) clearInterval(timer);
    timer = StartTimerLogOut();
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
    corretAccount.movementsDates.push(new Date().toISOString());
    receiverAcc.movementsDates.push(new Date().toISOString());
    // reset Timer
    clearInterval(timer);
    timer = StartTimerLogOut();
    // updateUI
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
    inputLoanAmount.value = '';
    setTimeout(() => {
      corretAccount.movements.push(amount);
      corretAccount.movementsDates.push(new Date().toISOString());
      updateUi(corretAccount);
      // reset Timer
      clearInterval(timer);
      timer = StartTimerLogOut();
    }, 2000);
  };
});
let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovments(corretAccount, !sorted);
  sorted = !sorted;
});

