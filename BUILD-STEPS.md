# Build Kudi Compass from an empty folder

Do this in order. After every stage, **open the page and test** before moving on. The finished code is in `index.html`, `style.css` and `script.js`: use it to check your own typing, but type each stage yourself. That is how you will be able to defend it.

---

## Stage 0: Set up (10 minutes)

1. Install **VS Code** (code.visualstudio.com).
2. Create a folder called `kudi-compass`.
3. Inside it create three empty files: `index.html`, `style.css`, `script.js`.
4. In VS Code, install the **Live Server** extension. Right-click `index.html` and choose **Open with Live Server**.

**Checkpoint:** a blank page opens in the browser.

---

## Stage 1: The page skeleton (HTML)

In `index.html` type the basic structure:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Kudi Compass</title>
  <link rel="stylesheet" href="style.css" />
</head>
<body>
  <header><h1>Kudi Compass</h1></header>
  <main></main>
  <script src="script.js"></script>
</body>
</html>
```

Why each part: `viewport` makes it fit phones; `link` connects the CSS; `script` connects the JavaScript (at the bottom so the page exists before the code runs).

**Checkpoint:** the heading shows.

---

## Stage 2: The loan form (HTML)

Inside `<main>` add a card with three labelled inputs and a button:

```html
<section class="card">
  <h2>Loan</h2>
  <label for="loanAmount">Loan amount (₦)</label>
  <input id="loanAmount" type="number" inputmode="numeric" />
  <label for="loanRate">Interest rate per year (%)</label>
  <input id="loanRate" type="number" inputmode="numeric" />
  <label for="loanMonths">Repayment period (months)</label>
  <input id="loanMonths" type="number" inputmode="numeric" />
  <button id="loanBtn">Calculate</button>
  <p id="outMonthly"></p>
</section>
```

Key idea: every element JavaScript needs has an `id`. `for` on a label matches the input's `id`, so tapping the label focuses the box.

**Checkpoint:** you can type in the boxes. The button does nothing yet.

---

## Stage 3: The loan maths (JavaScript), tested first

Before connecting to the page, write only the maths in `script.js`:

```js
function loanMaths(amount, monthlyRate, months) {
  const payment = (amount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -months));
  const total = payment * months;
  return { payment: payment, total: total, interest: total - amount };
}
console.log(loanMaths(100000, 0.01, 3));
```

Open the browser console (F12, Console tab). You should see a payment of about **34002**, total about **102007**, interest about **2007**. That matches the hand calculation in `GUIDE.md`.

Then add the 0% case (`if (monthlyRate === 0) payment = amount / months`) and remove the `console.log`.

**Checkpoint:** correct numbers in the console. Never connect broken maths to the page.

---

## Stage 4: Connect the button

```js
function el(id) { return document.getElementById(id); }
function naira(n) { return "₦" + Math.round(n).toLocaleString("en-NG"); }

function calculateLoan() {
  const amount = Number(el("loanAmount").value);
  const yearlyRate = Number(el("loanRate").value);
  const months = Number(el("loanMonths").value);
  const monthlyRate = yearlyRate / 100 / 12;
  const result = loanMaths(amount, monthlyRate, months);
  el("outMonthly").textContent = naira(result.payment);
}
el("loanBtn").addEventListener("click", calculateLoan);
```

Add `outTotal` and `outInterest` the same way. Add validation: if amount or months is not above 0, show an error message and `return`.

**Checkpoint:** 100000, 12, 3 gives ₦34,002.

---

## Stage 5: The repayment schedule

Add a `buildSchedule` function with a `for` loop (see `script.js`). In HTML add a `<table>` with `<tbody id="scheduleBody">`. In `calculateLoan`, loop through the rows, build a string of `<tr>` rows, and set `innerHTML`.

**Checkpoint:** for 100000 / 12 / 3 the balance ends at ₦0 and interest rows read 1,000 / 670 / 337.

---

## Stage 6: Hidden fees

Add two optional inputs (management %, insurance %). In JavaScript:

```js
const fees = amount * (mgmtPct + insurancePct) / 100;
```

Show fees, cash received (amount minus fees), and true cost (interest plus fees) in a box that appears only when fees is above 0 (use the `hidden` attribute).

**Checkpoint:** 500000, 20%, 12 months, 1% and 1% gives fees ₦10,000 and true cost about ₦65,807.

---

## Stage 7: Savings calculator

A second card with monthly amount, months and optional monthly charge. Maths:
- put in = amount x months
- charges = charge x months
- total = put in minus charges

**Checkpoint:** 20000 x 6 months with 100 charges gives ₦119,400.

---

## Stage 8: Your own feature, Pocket check

Add the `income` input and the `pocketCheck(payment, income)` function. It works out `Math.round(payment / income * 100)` and uses `if / else if / else` to pick comfortable, tight or risky. The level becomes a CSS class that sets the colour.

**Checkpoint:** payment 96,017 with income 300,000 shows 32% and "tight".

---

## Stage 9: localStorage

Add `saveToStorage` and `loadFromStorage` (with `try/catch`). Call `saveToStorage` at the end of each calculate function. At the bottom of the script, load the saved object and put its values back in the boxes.

**Checkpoint:** calculate, refresh the page: your numbers are still in the boxes.
Look at it in the browser: F12 > Application tab > Local Storage.

---

## Stage 10: Make it look like yours (CSS)

Style last, in this order:
1. Colour variables in `:root` (`--green`, `--gold`, `--cream`).
2. `* { box-sizing: border-box; }` and the body font.
3. The header, then cards (`max-width: 520px`, centred, rounded, soft shadow).
4. Inputs at `font-size: 16px` (stops phone zoom), buttons, results.
5. The schedule table inside a scrolling wrapper (`overflow-x: auto`).
6. Test on a phone: in the browser press F12 and click the phone icon.

Make it yours: change the colours, the font of the headings, and the name.

**Checkpoint:** it looks clean at phone width with no sideways scrolling (except inside the table).

---

## Stage 11: Final test list

- [ ] 100000, 12%, 3 months gives ₦34,002 / ₦102,007 / ₦2,007
- [ ] 1000000, 27%, 12 gives ₦96,017 / ₦1,152,209 / ₦152,209
- [ ] 0% rate works (no NaN or Infinity)
- [ ] Empty boxes show an error, not NaN
- [ ] Schedule ends at ₦0
- [ ] Fees box appears only with fees
- [ ] Pocket box appears only with income
- [ ] Refresh keeps your numbers
- [ ] Looks right on a phone

---

## Stage 12: Deploy with GitHub Pages

Follow the steps in `README.md`. Open the live link on your phone and test again.

---

## Stage 13: Prepare to defend it

Read `GUIDE.md` fully, then:
1. Explain the loan formula out loud using the ₦100,000 / 3 month example.
2. Explain why reducing balance, with the ₦152,209 vs ₦270,000 comparison.
3. Walk through what happens from clicking Calculate to seeing the numbers.
4. Explain the 30% and 40% lines, and say they are a rule of thumb.
5. Answer the 18 questions in section 7 of `GUIDE.md` without looking.
6. Change one thing live (a colour, a label, a threshold) and explain it.

If you get stuck at any stage: re-read the checkpoint, use `console.log` to print values, and compare with the finished files.
