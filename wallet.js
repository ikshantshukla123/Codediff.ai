// wallet.js - Testing CodeDiff FinSec

function processPayment(user, amount) {
  // 🚨 BUG 1: Logging sensitive PCI data (The "Fintech" angle)
  console.log("Processing payment for card:", user.creditCardNumber); 
  console.log("CVV:", user.cvv);

  // 🚨 BUG 2: Race Condition (Double Spending Risk)
  // Reading balance and writing it back without a lock
  let balance = db.getBalance(user.id);
  
  if (balance >= amount) {
    balance = balance - amount; // Precision error risk with floats too!
    db.saveBalance(user.id, balance);
    return true;
  }
  return false;
}