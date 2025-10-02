// Firebase-Konfiguration hier einfügen
const firebaseConfig = {
  apiKey: "AIzaSyBpC57i4QmDzjCN45Ymqw7-8bt60rG5tBc",
  authDomain: "holzlager-fad7a.firebaseapp.com",
  projectId: "holzlager-fad7a",
  storageBucket: "holzlager-fad7a.firebasestorage.app",
  messagingSenderId: "674347361367",
  appId: "1:674347361367:web:995577c811ea31d7f3ef12"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

const form = document.getElementById("holzForm");
const liste = document.getElementById("eintraegeListe");
const verarbeitung = document.getElementById("verarbeitung");
const stuecklaengeLabel = document.getElementById("stuecklaengeLabel");

verarbeitung.addEventListener("change", () => {
  stuecklaengeLabel.style.display = verarbeitung.value === "BigBag" ? "block" : "none";
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const eintrag = {
    holzart: document.getElementById("holzart").value,
    verarbeitung: verarbeitung.value,
    stuecklaenge: verarbeitung.value === "BigBag" ? document.getElementById("stuecklaenge").value : null,
    menge: parseInt(document.getElementById("menge").value),
    eingelagert_am: document.getElementById("eingelagertAm").value
  };
  await db.collection("holzlager").add(eintrag);
  form.reset();
  stuecklaengeLabel.style.display = "none";
  ladeEintraege();
});

async function ladeEintraege() {
  liste.innerHTML = "";
  const snapshot = await db.collection("holzlager").orderBy("eingelagert_am", "desc").get();
  snapshot.forEach(doc => {
    const d = doc.data();
    const li = document.createElement("li");
    li.textContent = `${d.holzart} – ${d.verarbeitung}${d.stuecklaenge ? " (" + d.stuecklaenge + ")" : ""} – ${d.menge} Stück – Eingelagert am ${d.eingelagert_am}`;
    liste.appendChild(li);
  });
}

window.onload = ladeEintraege;
