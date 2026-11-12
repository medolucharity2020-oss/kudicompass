# Kudi Compass: Study & Defence Guide

Read this with `script.js` open next to it. Do the "Your turn" tasks. You can only defend what you have typed and tested yourself.

---

## 1. How it is built (the order I used)

1. **HTML** (`index.html`): boxes for inputs, buttons, and empty places where results will appear. Each important element has an `id` so JavaScript can find it.
2. **JavaScript** (`script.js`): one maths function, one function that reads the boxes and shows results, and button listeners.
3. **localStorage**: after a calculation, save the inputs. When the page opens, put them back.
4. **CSS** (`style.css`): last. Colours live in `:root` so one change re-themes everything.
5. **Deploy**: it is only static files, so Netlify Drop, GitHub Pages or Vercel can host it with no setup.

Why this order? Make it **work**, then make it **pretty**. A pretty page with wrong maths is worse than the reverse.

---

## 2. Terms you must be able to explain

| Term | Plain meaning |
|---|---|
| **Principal** | The amount you borrow (or the part of a payment that reduces what you owe). |
| **Interest** | The price of borrowing, charged as a percentage. |
| **Rate per year** | How banks usually quote it (27% per year). |
| **Rate per month** | Yearly rate divided by 12 (27% / 12 = 2.25%). |
| **Tenor / term** | How long you take to repay, in months. |
| **Instalment / monthly repayment** | The fixed amount you pay every month. |
| **Reducing balance** | Interest is charged only on what you still owe, so it shrinks each month. |
| **Flat rate** | Interest is charged on the full original amount every month, even after you have repaid some. Costs far more. |
| **Amortisation / repayment schedule** | The month-by-month table of how each payment splits into interest and principal. |
| **Balance** | What you still owe after a payment. |
| **Management / processing fee** | A one-off charge for arranging the loan, often taken before you receive the cash. |
| **Credit life insurance** | Insurance that clears the loan if the borrower dies; the borrower pays for it. |
| **True cost of borrowing** | Interest plus all fees. |
| **localStorage** | A small storage space in the browser that keeps text on that device after the page closes. |

---

## 3. The loan calculation, solved by hand

**Easy example:** borrow **₦100,000** at **12% per year** for **3 months**.

**Step 1: monthly rate.** 12% / 12 = 1% per month = **0.01** as a decimal.
(To turn a percentage into a decimal, divide by 100.)

**Step 2: the formula.**

```
payment = (amount x r) / (1 - (1 + r)^-n)
```
- `r` = monthly rate as a decimal (0.01)
- `n` = number of months (3)

**Step 3: solve.**
- (1 + r) = 1.01
- 1.01 raised to the power of -3 = 1 / (1.01 x 1.01 x 1.01) = 1 / 1.030301 = **0.970590**
- 1 - 0.970590 = **0.029410**
- Top of the formula: 100,000 x 0.01 = **1,000**
- Payment = 1,000 / 0.029410 = **₦34,002** per month

**Step 4: totals.**
- Total repayment = 34,002 x 3 = **₦102,007** (102,006.63 before rounding)
- Total interest = 102,007 - 100,000 = **₦2,007**

**Step 5: check it with the schedule (this proves the formula).**

| Month | Interest (balance x 1%) | Principal (34,002 - interest) | Balance left |
|---|---|---|---|
| 1 | 1,000 | 33,002 | 66,998 |
| 2 | 670 | 33,332 | 33,666 |
| 3 | 337 | 33,666 | 0 |

The balance reaching **0** at month 3 shows the payment is right. Interest total: 1,000 + 670 + 337 = 2,007. It matches Step 4.

**Why the formula works (the idea).** Each month you owe interest on the balance, then your payment cuts the balance. The formula finds the one fixed payment that brings the balance exactly to zero after `n` months.

**Same loan at flat rate:** 100,000 x 1% x 3 = **₦3,000** interest, versus ₦2,007 reducing. Flat is 49% more expensive here, and the gap grows with longer loans.

**Real example you can demo (Zenith, 27% per year):** ₦1,000,000, 12 months.
- Monthly rate = 27 / 12 = 2.25% = 0.0225
- Payment = ₦96,017; total = ₦1,152,209; interest = ₦152,209
- Flat would be 1,000,000 x 0.0225 x 12 = ₦270,000 interest.
- Month 1 interest = 1,000,000 x 0.0225 = ₦22,500, principal = 96,017 - 22,500 = ₦73,517 (the first rows of the schedule in the app).

**Fees example (Access Bank One Mama, 20% + 1% + 1%):** ₦500,000, 12 months.
- Payment ₦46,317; total ₦555,807; interest ₦55,807
- Fees = 500,000 x (1% + 1%) = **₦10,000**
- Cash received = 500,000 - 10,000 = **₦490,000** (but you repay as if you got ₦500,000)
- True cost = 55,807 + 10,000 = **₦65,807**

---

## 4. Showing hidden fees (how and why)

Fees hide in two ways: they are **small percentages** people ignore, and they are **taken upfront**, so you receive less than you repay.

How the app shows them:
- Optional boxes for management fee and insurance (%).
- A highlighted box showing **fees taken upfront**, **cash you actually receive**, and **true cost of borrowing**.

Other fees you could add as extra inputs: late-payment penalty, early-repayment charge, account maintenance, SMS alert charges, stamp duty. Same pattern: a new input, one line of maths, one more line in the fee box.

**Assumption to state if asked:** I treat fees as one-off and deducted upfront. Some lenders add them to the loan or charge them monthly, so the real offer letter decides.

---

## 5. Savings calculation, solved by hand

Save **₦20,000 per month for 6 months**, with **₦100 monthly charges**.
- You put in: 20,000 x 6 = **₦120,000**
- Charges: 100 x 6 = **₦600**
- Total yours: 120,000 - 600 = **₦119,400**

This version has **no interest**. That is a deliberate simplification: many Nigerian savings accounts pay very little, and I did not have a sourced rate. To add interest later, the savings formula is `deposit x ((1 + i)^n - 1) / i`, where `i` is the monthly rate as a decimal.

---

## 6. Code walkthrough (function by function)

**`el(id)`**: shortcut for `document.getElementById(id)`. Saves typing.

**`naira(n)`**: `Math.round(n)` removes decimals, `.toLocaleString("en-NG")` adds commas, and `"₦" +` puts the symbol in front.

**`loanMaths(amount, monthlyRate, months)`**: a *pure function*: numbers in, numbers out, it touches nothing on the page. That makes it easy to test. It has an `if` for a 0% rate, because the formula would divide by zero (1 - 1 = 0).

**`buildSchedule(...)`**: a `for` loop from month 1 to `months`. Each loop: interest = balance x rate, principal = payment - interest, balance = balance - principal. It puts each row in an array. `Math.max(balance, 0)` stops tiny rounding errors showing as negative.

**`calculateLoan()`**: the "controller":
1. Read the boxes with `.value`. `Number()` turns the text into a number (an empty box becomes 0).
2. Validate. If invalid, show an error and `return` (stop).
3. Convert the yearly rate to monthly.
4. Call `loanMaths`, show results with `.textContent`.
5. Work out fees; show or hide the fee box using the `hidden` attribute.
6. Build the table: loop through rows, join strings, set `innerHTML`.
7. Save to localStorage.

**`calculateSavings()`**: same pattern, simpler maths.

**`addEventListener("click", function)`**: "when this button is clicked, run this function".

**`saveToStorage` / `loadFromStorage`**:
- `JSON.stringify(object)` turns an object into text (localStorage only stores text).
- `JSON.parse(text)` turns it back.
- `try/catch` stops the whole app crashing if the browser blocks storage.

---

## 7. Questions you may be asked (with answers)

1. **Why reducing balance, not flat?** Fairer: you pay interest only on what you still owe. The same quoted rate costs far less than flat (₦2,007 vs ₦3,000 in the small example).
2. **How do you convert 27% a year to a monthly rate?** Divide by 12, then by 100 for a decimal: 0.0225. This is a simple (nominal) conversion, not compounding.
3. **What does the formula do?** Finds the fixed payment that reduces the balance to exactly zero by the last month.
4. **What if the rate is 0%?** The formula divides by zero, so I use amount / months instead.
5. **Why is the first month's interest the highest?** The balance is highest then. Each payment lowers the balance, so interest falls and principal rises.
6. **Does your total interest equal the sum of the schedule's interest column?** Yes, apart from rounding of a few naira. That is my cross-check.
7. **Why do you round?** Display only. Calculations use full precision, so rounding errors do not build up.
8. **Where does your example rate come from?** Zenith MSME at 27% a year, and Access One Mama at 20% + 1% + 1%, both reported in Nairametrics / National Daily coverage of June 2026 lending rates. Rates change; I tell the user to confirm with the bank.
9. **Are the fees accurate?** They follow the published figures, but I assume they are one-off and deducted upfront. The real offer letter decides.
10. **What happens if someone misses a month?** Typically a late fee or penalty interest, a record at credit bureaus, recovery from salary or other accounts, and guarantors or collateral being pursued. My app does not model penalties, because they differ by lender.
11. **How does localStorage work, and is it safe?** It stores text in the user's browser on that device. It is not sent anywhere, but anyone using that browser can see it, and clearing browser data deletes it. So never store sensitive details.
12. **What if localStorage is blocked?** try/catch: the calculator still works, it just does not remember.
13. **Why is the savings result so simple?** No interest, because I had no sourced rate and wanted honesty about what is known. It can be extended with the compound formula.
14. **Why `type="number"` and `inputmode="numeric"`?** Number inputs reject letters and bring up a number pad on phones.
15. **How is it mobile-friendly?** The viewport meta tag, a flexible `max-width` layout, 16px input text (stops iPhone zoom), a two-column grid that fits narrow screens, and a table that scrolls sideways.
16. **How would you deploy it?** It is static (no server). Drag the folder to Netlify Drop, or push to GitHub and enable Pages.
17. **What are the limitations?** Estimates only; assumes fixed rate, equal monthly payments, and no penalties; the savings side ignores interest; yearly-to-monthly conversion is simple.
18. **What would you add next?** Late-payment penalty input, savings interest, a chart, and an installable (PWA) version.

---

## 8. Your turn (do these; they make the code yours)

1. **Predict first, then check:** ₦200,000 at 24% per year for 2 months. Work it out by hand (monthly rate 2% = 0.02), then use the app. Do they match?
2. In `script.js`, change `"₦"` to `"NGN "` and see what changes. Change it back.
3. Change `--gold` in `style.css` to another colour. Which parts of the page change?
4. Add a "Late fee (₦)" input to the HTML, read it in `calculateLoan`, and add it to the true cost.
5. In `buildSchedule`, remove `Math.max(balance, 0)`. Look at the last row for a loan with awkward numbers. Why did I add it?
6. Explain, out loud and without looking, what happens from the moment you click Calculate until numbers appear. If you can do this, you can defend the project.

---

## 9. Interest method used: REDUCING BALANCE (and why)

**Chosen:** reducing balance. **Not used:** flat.

Reasons:
1. **Fairer.** You pay interest only on what you still owe. Flat charges interest on the full original amount even after you have repaid part of it.
2. **Cheaper for the same quoted rate.** ₦1,000,000 at 27% a year for 12 months: ₦152,209 interest reducing, ₦270,000 flat (₦117,791 more).
3. **Matches how Nigerian banks quote yearly rates**, and my sources (Zenith 27%, Access 20%) are yearly rates.
4. **Transparent.** The schedule shows every naira of interest and principal. A flat rate hides how little the loan really costs per month of use.

Honest limit: some lenders, especially loan apps, quote flat monthly rates. A "5% a month flat" loan is about 60% a year in simple terms and much higher in true cost, so always ask which method is used.

---

## 10. My own feature: Pocket check

**What:** the user enters their monthly income (optional). The app shows what percentage of it the loan repayment takes, with a colour bar and advice.

**Maths:** `percent = payment / income x 100`. Example: payment ₦96,017, income ₦300,000: 96,017 / 300,000 = 0.32 = **32%**, so "tight".

**Thresholds:** under 30% comfortable, 30% to 40% tight, over 40% risky.

**Be ready to say:** 30% is a common rule of thumb for debt repayments, not a law or a bank rule. I chose it to make the calculator answer the real question: "Can I afford this?", not just "What is the payment?"

**Where in the code:** the `pocketCheck(payment, income)` function in `script.js`, called inside `calculateLoan()`. It uses `if / else if / else` to pick a level, and the level becomes a CSS class (`good`, `tight`, `risky`) that sets the colour.

**Extra questions to practise:**
- Why is income optional? Not everyone wants to enter it, and the calculator works without it.
- What if income is 0 or empty? The `if (income > 0)` check hides the box, so there is no division by zero.
- How would you improve it? Add other monthly debts, or let the user choose their own limit.

---

## 11. Deploying with GitHub Pages (free)

1. Create a GitHub account at github.com and click **New repository**. Name it `kudi-compass`, set it to **Public**, and click **Create repository**.
2. Click **uploading an existing file**. Drag in `index.html`, `style.css` and `script.js`. (GUIDE.md is optional.) Click **Commit changes**.
   - `index.html` must be directly in the repository, not inside another folder.
3. Go to **Settings > Pages**.
4. Under **Build and deployment**, set Source to **Deploy from a branch**, Branch to **main**, folder **/ (root)**, and click **Save**.
5. Wait 1 to 2 minutes and refresh. The link appears at the top, in the form `https://YOUR-USERNAME.github.io/kudi-compass/`.
6. To update later: open the file in GitHub, click the pencil icon, edit, and commit. The site refreshes by itself.

Why GitHub Pages works here: the project is just static files. There is no server code, so GitHub only has to hand the files to the browser.

Note: the page loads at its own link, so `localStorage` belongs to that address. Numbers saved while testing on your computer will not appear on the live site.
