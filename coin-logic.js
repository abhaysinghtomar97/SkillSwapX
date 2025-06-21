// Coin Logic: Earning and Spending SkillCoins

// Firebase Initialization
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, doc, getDoc, setDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";


const firebaseConfig = {
  apiKey: "AIzaSyBVjWbRv4mFpS3JzkvoZcaUduhlHnKUX4E",
  authDomain: "collegue-c8d48.firebaseapp.com",
  projectId: "collegue-c8d48",
  storageBucket: "collegue-c8d48.firebasestorage.app",
  messagingSenderId: "701506337347",
  appId: "1:701506337347:web:340cf197f27c97bab232f6",
  measurementId: "G-GX3784PQ93"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Get user's SkillCoins
async function getSkillCoins(uid) {
  const userRef = doc(db, "users", uid);
  const userSnap = await getDoc(userRef);
  if (userSnap.exists()) {
    return userSnap.data().skillCoins || 0;
  } else {
    await setDoc(userRef, { skillCoins: 0 });
    return 0;
  }
}

// Earn coins (e.g. after uploading a course)
async function earnCoins(uid, amount = 10) {
  const userRef = doc(db, "users", uid);
  const current = await getSkillCoins(uid);
  await updateDoc(userRef, { skillCoins: current + amount });
}

// Spend coins (e.g. to watch a premium course)
async function spendCoins(uid, amount = 5) {
  const current = await getSkillCoins(uid);
  if (current >= amount) {
    const userRef = doc(db, "users", uid);
    await updateDoc(userRef, { skillCoins: current - amount });
    return true;
  } else {
    alert("Not enough SkillCoins!");
    return false;
  }
}

// Usage Example
onAuthStateChanged(auth, async (user) => {
  if (user) {
    const coins = await getSkillCoins(user.uid);
    console.log("Your coins:", coins);

    // Update wallet balance if element exists
    const balanceEl = document.getElementById("coin-balance");
    if (balanceEl) {
      balanceEl.textContent = coins;
    }
  } else {
    window.location.href = "auth.html";
  }
});


export { auth, getSkillCoins, earnCoins, spendCoins };

