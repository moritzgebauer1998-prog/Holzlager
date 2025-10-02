// Firebase-Konfiguration hier einfügen
const firebaseConfig = {
  apiKey: "DEINE_API_KEY",
  authDomain: "DEIN_PROJEKT.firebaseapp.com",
  projectId: "DEIN_PROJEKT",
  storageBucket: "DEIN_PROJEKT.appspot.com",
  messagingSenderId: "DEINE_SENDER_ID",
  appId: "DEINE_APP_ID"
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
