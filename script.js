// ==========================================================
// Kudi Compass: Loan & Savings Calculator
// Section 1: Helpers & Storage
// Section 2: Navigation & Tabs
// Section 3: Loan Logic
// Section 4: Savings Logic
// Section 5: Buttons & Keyboard Shortcuts
// Section 6: Initialization
// ==========================================================

// ---------- 1. HELPERS & STORAGE ----------

// Shortcut: el("loanAmount") finds element with id="loanAmount"
function el(id) {
  return document.getElementById(id);
}

// Show a number as formatted Naira with no decimals: 96017.4 -> "₦96,017"
function naira(n) {
  return "₦" + Math.round(n).toLocaleString("en-NG");
}

function saveToStorage(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    // Graceful fallback if storage is restricted
  }
}

function loadFromStorage(key) {
  try {
    return JSON.parse(localStorage.getItem(key));
  } catch (e) {
    return null;
  }
}

// Helper to smooth scroll to results on small screens
function scrollToResult(elem) {
  if (!elem) return;
  const rect = elem.getBoundingClientRect();
  if (rect.top > window.innerHeight * 0.75) {
    elem.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }
}

// ---------- 2. NAVIGATION & TABS ----------

const tabLoanBtn = el("tabBtnLoan");
const tabSavingsBtn = el("tabBtnSavings");
const panelLoan = el("panelLoan");
const panelSavings = el("panelSavings");

function switchTab(target) {
  if (target === "loan") {
    tabLoanBtn.classList.add("active");
    tabLoanBtn.setAttribute("aria-selected", "true");
    tabLoanBtn.setAttribute("tabindex", "0");

    tabSavingsBtn.classList.remove("active");
    tabSavingsBtn.setAttribute("aria-selected", "false");
    tabSavingsBtn.setAttribute("tabindex", "-1");

    panelLoan.classList.add("active");
    panelLoan.hidden = false;

    panelSavings.classList.remove("active");
    panelSavings.hidden = true;
  } else {
    tabSavingsBtn.classList.add("active");
    tabSavingsBtn.setAttribute("aria-selected", "true");
    tabSavingsBtn.setAttribute("tabindex", "0");

    tabLoanBtn.classList.remove("active");
    tabLoanBtn.setAttribute("aria-selected", "false");
    tabLoanBtn.setAttribute("tabindex", "-1");

    panelSavings.classList.add("active");
    panelSavings.hidden = false;

    panelLoan.classList.remove("active");
    panelLoan.hidden = true;
  }

  saveToStorage("kudiActiveTab", target);
}

if (tabLoanBtn && tabSavingsBtn) {
  tabLoanBtn.addEventListener("click", () => switchTab("loan"));
  tabSavingsBtn.addEventListener("click", () => switchTab("savings"));

  // Keyboard navigation for accessible tabs (Left/Right arrows)
  [tabLoanBtn, tabSavingsBtn].forEach((btn) => {
    btn.addEventListener("keydown", (e) => {
      if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
        e.preventDefault();
        const next = btn === tabLoanBtn ? "savings" : "loan";
        switchTab(next);
        (next === "savings" ? tabSavingsBtn : tabLoanBtn).focus();
      }
    });
  });
}

// ---------- 3. LOAN LOGIC ----------

function getInterestMethod() {
  const select = el("interestMethod");
  return select ? select.value : "reducing";
}

// Pure math function:
// monthlyRate is a decimal: 27% a year = 0.27 / 12 = 0.0225 a month
function loanMaths(amount, monthlyRate, months, method = "reducing") {
  if (method === "flat") {
    const interest = amount * monthlyRate * months;
    const total = amount + interest;
    const payment = total / months;
    return { payment, total, interest };
  }

  let payment;
  if (monthlyRate === 0) {
    payment = amount / months; // no interest: just split evenly
  } else {
    // Amortisation formula
    payment = (amount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -months));
  }
  const total = payment * months;      // total repayment
  const interest = total - amount;     // total interest paid
  return { payment, total, interest };
}

// Pocket check: evaluate repayment against income (30% rule of thumb)
function pocketCheck(payment, income) {
  const percent = Math.round((payment / income) * 100);
  let level, badge, advice;
  if (percent <= 30) {
    level = "good";
    badge = "Comfortable";
    advice = "Comfortable. Stays within the recommended 30% debt-to-income benchmark.";
  } else if (percent <= 40) {
    level = "tight";
    badge = "Tight";
    advice = "Tight. Consider a longer repayment tenure or a slightly smaller loan.";
  } else {
    level = "risky";
    badge = "Risky";
    advice = "Risky. This repayment consumes a heavy portion of your monthly income.";
  }
  return {
    percent,
    level,
    badge,
    message: `This loan takes ${percent}% of your monthly income. ${advice}`
  };
}

// Builds one row for every month
function buildSchedule(amount, monthlyRate, months, payment, method = "reducing") {
  const rows = [];
  let balance = amount;

  if (method === "flat") {
    const monthlyInterest = amount * monthlyRate;
    const monthlyPrincipal = amount / months;

    for (let month = 1; month <= months; month++) {
      balance = balance - monthlyPrincipal;
      rows.push({
        month,
        interest: monthlyInterest,
        principal: monthlyPrincipal,
        balance: Math.max(balance, 0)
      });
    }
    return rows;
  }

  for (let month = 1; month <= months; month++) {
    const interest = balance * monthlyRate;
    const principal = payment - interest;
    balance = balance - principal;
    rows.push({
      month,
      interest,
      principal,
      balance: Math.max(balance, 0) // avoid showing -0 from float rounding
    });
  }
  return rows;
}

function calculateLoan() {
  const amount = Number(el("loanAmount").value);
  const yearlyRate = Number(el("loanRate").value);
  const months = Number(el("loanMonths").value);
  const mgmtPct = Number(el("feeMgmt").value);
  const insurancePct = Number(el("feeInsurance").value);
  const income = Number(el("income").value);
  const method = getInterestMethod();

  // Validation
  if (amount <= 0 || months <= 0 || el("loanRate").value === "" || yearlyRate < 0) {
    el("loanError").textContent = "Please fill in a valid loan amount, interest rate, and months.";
    el("loanResult").hidden = true;
    return;
  }
  el("loanError").textContent = "";

  const monthlyRate = yearlyRate / 100 / 12;
  const result = loanMaths(amount, monthlyRate, months, method);

  const methodBadge = el("loanMethodBadge");
  if (methodBadge) {
    methodBadge.textContent = method === "flat" ? "Flat Rate" : "Reducing Balance";
  }

  // Main results
  el("outMonthly").textContent = naira(result.payment);
  el("outTotal").textContent = naira(result.total);
  el("outInterest").textContent = naira(result.interest);

  // Upfront hidden fees
  const fees = amount * ((mgmtPct + insurancePct) / 100);
  if (fees > 0) {
    el("outFees").textContent = naira(fees);
    el("outReceive").textContent = naira(amount - fees);
    el("outTrueCost").textContent = naira(result.interest + fees);
    el("feeBox").hidden = false;
  } else {
    el("feeBox").hidden = true;
  }

  // Pocket check
  if (income > 0) {
    const check = pocketCheck(result.payment, income);
    el("pocketText").textContent = check.message;
    el("pocketFill").style.width = Math.min(check.percent, 100) + "%";
    el("pocketBox").className = "pocket-card " + check.level;
    const pocketBadge = el("pocketBadge");
    if (pocketBadge) {
      pocketBadge.textContent = check.badge;
    }
    el("pocketBox").hidden = false;
  } else {
    el("pocketBox").hidden = true;
  }

  // Repayment schedule table
  const rows = buildSchedule(amount, monthlyRate, months, result.payment, method);
  let html = "";
  rows.forEach(function (row) {
    html += `<tr>
      <td>Month ${row.month}</td>
      <td>${naira(row.interest)}</td>
      <td>${naira(row.principal)}</td>
      <td>${naira(row.balance)}</td>
    </tr>`;
  });
  el("scheduleBody").innerHTML = html;

  el("loanResult").hidden = false;
  scrollToResult(el("loanResult"));

  saveToStorage("kudiLoan", {
    amount, yearlyRate, months,
    mgmtPct, insurancePct, income, method
  });
}

// ---------- 4. SAVINGS ----------

function calculateSavings() {
  const amount = Number(el("saveAmount").value);
  const months = Number(el("saveMonths").value);
  const charge = Number(el("saveCharge").value);

  if (amount <= 0 || months <= 0) {
    el("saveError").textContent = "Please fill in a valid monthly deposit and duration.";
    el("saveResult").hidden = true;
    return;
  }
  el("saveError").textContent = "";

  const paidIn = amount * months;
  const charges = charge * months;
  const total = paidIn - charges;

  el("saveLabel").textContent = `Total savings (${months} mos)`;
  el("outSaved").textContent = naira(total);
  el("outPaidIn").textContent = naira(paidIn);
  el("outCharges").textContent = naira(charges);
  el("saveResult").hidden = false;
  scrollToResult(el("saveResult"));

  saveToStorage("kudiSavings", { amount, months, charge });
}

// ---------- 5. BUTTONS & KEYBOARD SHORTCUTS ----------

if (el("loanBtn")) el("loanBtn").addEventListener("click", calculateLoan);
if (el("saveBtn")) el("saveBtn").addEventListener("click", calculateSavings);

// Recalculate automatically when switching interest method if results are already shown
if (el("interestMethod")) {
  el("interestMethod").addEventListener("change", () => {
    if (!el("loanResult").hidden) {
      calculateLoan();
    }
  });
}

// Enable 'Enter' key submission inside inputs
["loanAmount", "loanRate", "loanMonths", "feeMgmt", "feeInsurance", "income"].forEach(id => {
  const input = el(id);
  if (input) {
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") calculateLoan();
    });
  }
});

["saveAmount", "saveMonths", "saveCharge"].forEach(id => {
  const input = el(id);
  if (input) {
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") calculateSavings();
    });
  }
});

// ---------- 6. INITIALIZATION ----------

// Restore saved data on page load
window.addEventListener("DOMContentLoaded", () => {
  const savedTab = loadFromStorage("kudiActiveTab");
  if (savedTab === "savings") {
    switchTab("savings");
  }

  const savedLoan = loadFromStorage("kudiLoan");
  if (savedLoan) {
    el("loanAmount").value = savedLoan.amount || "";
    el("loanRate").value = savedLoan.yearlyRate || "";
    el("loanMonths").value = savedLoan.months || "";
    el("feeMgmt").value = savedLoan.mgmtPct || "";
    el("feeInsurance").value = savedLoan.insurancePct || "";
    el("income").value = savedLoan.income || "";
    if (savedLoan.method && el("interestMethod")) {
      el("interestMethod").value = savedLoan.method;
    }
    if (savedLoan.amount && savedLoan.yearlyRate && savedLoan.months) {
      calculateLoan();
    }
  }

  const savedSavings = loadFromStorage("kudiSavings");
  if (savedSavings) {
    el("saveAmount").value = savedSavings.amount || "";
    el("saveMonths").value = savedSavings.months || "";
    el("saveCharge").value = savedSavings.charge || "";
    if (savedSavings.amount && savedSavings.months) {
      calculateSavings();
    }
  }
});
