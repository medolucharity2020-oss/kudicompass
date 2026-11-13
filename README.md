# Kudi Compass

A loan and savings calculator in Naira (`₦`), built with plain HTML, CSS, and JavaScript. No installs, no frameworks.

## What it does

- **Tabbed Interface**: Switch between the **Loan Calculator** and **Savings Planner** tabs (supports click, arrow-key navigation, and remembers your active tab).

**Loan Calculator**
- Enter loan amount, yearly interest rate (`% p.a.`), and repayment period (months).
- **Interest Calculation Method**: Choose between **Reducing Balance** (interest calculated on the remaining balance) or **Flat Rate** (interest calculated on the original loan amount). Switching methods updates visible results automatically.
- Shows estimated monthly payment, total repayment, and total interest cost.
- Month-by-month amortisation schedule (interest paid, principal paid, remaining balance).
- **Hidden bank fees (optional)**: Expandable section for upfront management fee (`%`) and insurance charge (`%`), showing deducted fees, cash actually received, and true cost of borrowing.
- **Pocket Check™ (optional)**: Enter your monthly income to see what percentage the repayment takes against a 30% debt-to-income benchmark:
  - **Comfortable**: `≤ 30%`
  - **Tight**: `31% – 40%`
  - **Risky**: `> 40%`

**Savings Planner**
- Enter a monthly deposit target, duration in months, and optional monthly bank/SMS charge (`₦`).
- Shows net accumulated savings, total cash deposited, and total account charges deducted.

**Saved on your device**
- Your active tab, last loan inputs (including selected interest method), and savings inputs are stored in `localStorage` and restored when you reopen the page.

## Files

| File | Job |
|---|---|
| `index.html` | Page structure, tabs, forms, and result views |
| `style.css` | Theme tokens in `:root`, typography (`Plus Jakarta Sans`), and responsive layout |
| `script.js` | Tab navigation, loan/savings maths, schedule builder, and `localStorage` |
| `README.md` | Project overview and usage |
| `BUILD-STEPS.md` | Stage-by-stage build notes |
| `GUIDE.md` | Study sheet: terms, worked calculations, code walkthrough |

## Run it

Double-click `index.html` (keep `index.html`, `style.css`, and `script.js` in the same folder), or open the folder in VS Code and use the **Live Server** extension.

## Deploy on GitHub Pages (free)

1. Sign in at github.com and create a **public** repository named `kudi-compass`.
2. Upload `index.html`, `style.css`, and `script.js` to the root of the repository and commit changes.
3. Go to **Settings > Pages**, choose **Deploy from a branch** (`main`, `/ (root)`), and save.
4. Your site will be live at `https://YOUR-USERNAME.github.io/kudi-compass/`.

Note: `localStorage` is scoped to each origin, so data saved locally will not carry over to the hosted URL.

## Limits

- Estimates are for planning purposes only; real lender offers may include additional fees or penalties.
- Assumes a fixed interest rate and equal monthly payments.
- Yearly-to-monthly rate conversion divides the annual rate by 12.
- Savings planner projects contributions minus recurring charges without compound interest.
- Pocket Check™ evaluates only the single loan entered, using 30% as a general rule of thumb.

## Ideas for next steps

- Late-payment penalty input
- Compound interest option for savings
- Chart comparing principal vs interest
- Progressive Web App (PWA) support for offline mobile installation
