// test-vulnerable-code.js
// 🚨 This file contains intentional vulnerabilities for CodeDiff AI testing

// ============ FINANCIAL VULNERABILITIES ============

// 1. RACE CONDITION - Double Spending Risk
let balance = 1000; // Global balance - DANGEROUS!

async function processPayment(userId, amount) {
  // ⚠️ CRITICAL: Race condition - no locking mechanism
  const user = await getUser(userId);
  user.balance += amount; // Direct mutation without transaction
  await saveUser(user);
  
  // Simulated delay increases race condition probability
  await new Promise(resolve => setTimeout(resolve, Math.random() * 100));
}

// 2. FLOATING POINT CURRENCY ERROR
function calculateTotal(price, quantity, taxRate) {
  // ⚠️ HIGH: Using float for money calculations
  return price * quantity * (1 + taxRate); // Returns floating point!
}

// 3. DIRECT SQL INJECTION
async function getUserByEmail(email) {
  const query = `SELECT * FROM users WHERE email = '${email}'`;
  // ⚠️ CRITICAL: Direct string interpolation - SQL Injection!
  return await database.query(query);
}

// ============ SECURITY VULNERABILITIES ============

// 4. HARDCODED API KEYS
const STRIPE_SECRET_KEY = 'sk_test_1234567890abcdefghijklmnop';
const AWS_ACCESS_KEY = 'AKIATESTKEYEXAMPLE123';
const AWS_SECRET_KEY = 'testsecretkeyexample1234567890abcdefghij';

// 5. UNENCRYPTED PII IN LOGS
function logUserActivity(user, action) {
  console.log(`User ${user.email} (Phone: ${user.phone}) performed: ${action}`);
  // ⚠️ MEDIUM: PII exposed in logs
  console.log(`Credit Card ends with: ${user.cardLast4}`);
}

// ============ COMPLIANCE VIOLATIONS ============

// 6. PCI-DSS VIOLATION - Storing CVV
function processCreditCard(cardData) {
  const paymentData = {
    number: cardData.number,
    expiry: cardData.expiry,
    cvv: cardData.cvv, // ⚠️ CRITICAL: Never store CVV!
    name: cardData.name
  };
  
  // Simulate storing in database
  saveToDatabase('payments', paymentData);
  
  // Also log it (DOUBLE VIOLATION)
  console.log(`Processing card ${cardData.number} with CVV: ${cardData.cvv}`);
}

// 7. GDPR VIOLATION - No consent for data processing
function collectUserData(userId) {
  const userData = {
    id: userId,
    location: getUserLocation(), // Tracking without consent
    deviceInfo: getDeviceInfo(), // Collecting PII
    browsingHistory: getHistory() // No opt-out mechanism
  };
  
  // Share with third parties without consent
  shareWithAdProviders(userData);
  shareWithAnalytics(userData);
}

// ============ BAD PRACTICES ============

// 8. SYNC FUNCTION IN ASYNC CONTEXT
function validatePayment(payment) {
  // ⚠️ Blocking the event loop
  const isValid = heavyCryptoValidation(payment.signature);
  return isValid;
}

// 9. NO ERROR HANDLING
function transferMoney(from, to, amount) {
  // ⚠️ No try-catch, no validation
  from.balance -= amount;
  to.balance += amount;
  
  if (from.balance < 0) {
    // Negative balance allowed!
  }
}

// 10. INSECURE RANDOMNESS
function generateTransactionId() {
  return Math.random().toString(36).substring(2); // ⚠️ Not cryptographically secure
}

// ============ HELPER FUNCTIONS (Don't analyze these) ============

async function getUser(id) {
  return { id, balance: 1000 };
}

async function saveUser(user) {
  // Mock save function
}

async function saveToDatabase(table, data) {
  // Mock database save
}

function getUserLocation() {
  return 'New York, USA';
}

function getDeviceInfo() {
  return 'iPhone 15, iOS 17';
}

function getHistory() {
  return ['page1', 'page2', 'page3'];
}

function shareWithAdProviders(data) {
  // Mock ad sharing
}

function shareWithAnalytics(data) {
  // Mock analytics sharing
}

function heavyCryptoValidation(signature) {
  // Mock crypto validation
  return true;
}

// ============ EXPORTS FOR TESTING ============
module.exports = {
  processPayment,
  calculateTotal,
  getUserByEmail,
  processCreditCard,
  collectUserData,
  validatePayment,
  transferMoney,
  generateTransactionId,
  balance,
  STRIPE_SECRET_KEY
};