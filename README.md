# Kudi Compass

A loan and savings calculator in Naira, built with plain HTML, CSS and JavaScript. No installs, no frameworks.

## What it does

**Loan**
- Enter amount, yearly interest rate and months.
- Shows monthly repayment, total repayment and total interest.
- Month-by-month repayment schedule (interest, principal, balance).
- Optional hidden fees (management fee, insurance): shows fees taken upfront, the cash you really receive, and the true cost of borrowing.
- **Pocket check** (my own feature): enter your monthly income and see what percentage the repayment takes: comfortable (under 30%), tight (30% to 40%), risky (over 40%).
- Interest method: **reducing balance** (reasons are written on the page and in GUIDE.md).

**Savings**
- Enter a monthly contribution and number of months.
- Shows the total after those months, what you put in, and optional bank charges.

**Saved on your device:** your last inputs are kept with localStorage and come back when you reopen the page.

## Files

| File | Job |
|---|---|
| `index.html` | The structure: what is on the page |
| `style.css` | The look: colours are at the top in `:root` |
| `script.js` | The behaviour: maths, results, localStorage |
| `README.md` | This file |
| `BUILD-STEPS.md` | Build it from an empty folder, stage by stage |
| `GUIDE.md` | Study sheet: terms, worked calculations, code walkthrough, defence questions |

## Run it

Double-click `index.html`. Keep all three code files in the same folder.
Better: open the folder in VS Code and use the **Live Server** extension, which refreshes as you edit.

## Deploy on GitHub Pages (free)

1. Sign in at github.com and create a **public** repository named `kudi-compass`.
2. Click **uploading an existing file**, drag in `index.html`, `style.css` and `script.js`, then **Commit changes**. `index.html` must be directly in the repository, not inside a folder.
3. Go to **Settings > Pages**. Under Build and deployment choose **Deploy from a branch**, branch **main**, folder **/ (root)**, then **Save**.
4. After 1 to 2 minutes your site is live at `https://YOUR-USERNAME.github.io/kudi-compass/`.
5. To update later, open a file on GitHub, click the pencil icon, edit, and commit.

Note: localStorage belongs to each web address, so numbers saved on your computer will not appear on the live site.

## Real Nigerian examples used

- **Zenith Bank MSME loan:** 27% per year, for loans of ₦500,000 to ₦2 million. Reported in Nairametrics' June 2026 comparison of Nigerian bank lending rates.
- **Access Bank One Mama Loan:** 20% interest, plus a 1% management fee and a 1% credit life and job loss insurance charge. Reported by National Daily, June 2026. The app assumes the fees are one-off and taken from the loan upfront.

Rates change. Always confirm with the bank before borrowing.

## Why reducing balance, not flat

- It is fairer: you pay interest only on what you still owe.
- It costs less for the same quoted rate: ₦1,000,000 at 27% for 12 months is ₦152,209 interest reducing, but ₦270,000 flat.
- Yearly bank rates are normally quoted this way, and the schedule shows where every naira goes.

## What happens if someone misses a payment?

This depends on the lender and the loan agreement. Commonly: a late fee or penalty interest, a negative record at credit bureaus, recovery from the borrower's salary or accounts, and guarantors or collateral being pursued. The app does not model penalties because they differ by lender.

## Limits (be honest about these)

- Estimates only. Real offers may include extra fees.
- Assumes a fixed rate and equal monthly payments.
- Yearly to monthly rate conversion is simple (divide by 12).
- Savings has no interest, because no sourced savings rate was used.
- Pocket check counts only this loan, and its 30% line is a rule of thumb, not a law.

## Ideas for next steps

- Late-payment penalty input
- Savings interest (formula is in GUIDE.md)
- A chart of principal vs interest
- Make it installable on phones (PWA)
