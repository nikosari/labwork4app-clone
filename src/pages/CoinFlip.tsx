import { useState, useRef, useEffect } from "react";
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
  IonButton, IonButtons
} from "@ionic/react";
import { useLocation, useHistory } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebaseConfig";

export default function CoinFlip() {
  const [isFlipping, setIsFlipping] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [finalAngle, setFinalAngle] = useState(0);
  const [headsCount, setHeadsCount] = useState<number>(0);
  const [tailsCount, setTailsCount] = useState<number>(0);
  const coinRef = useRef<HTMLDivElement | null>(null);
  const location = useLocation();
  const history = useHistory();
  const [pageClass, setPageClass] = useState("");

  useEffect(() => {
    const dir = ((location && (location.state as unknown)) as { direction?: string } | undefined)?.direction;
    if (dir === "forward") setPageClass("enter-from-right");
    else if (dir === "back") setPageClass("enter-from-left");
    else setPageClass("");
    if (dir) {
      const t = setTimeout(() => setPageClass(""), 350);
      return () => clearTimeout(t);
    }
  }, [location]);

  useEffect(() => {
    try {
      const h = parseInt(localStorage.getItem("coin_heads") || "0", 10);
      const t = parseInt(localStorage.getItem("coin_tails") || "0", 10);
      if (!isNaN(h)) setHeadsCount(h);
      if (!isNaN(t)) setTailsCount(t);
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("coin_heads", String(headsCount));
      localStorage.setItem("coin_tails", String(tailsCount));
    } catch {}
  }, [headsCount, tailsCount]);

  const resetCounts = () => {
    try {
      setHeadsCount(0);
      setTailsCount(0);
      localStorage.setItem("coin_heads", "0");
      localStorage.setItem("coin_tails", "0");
      localStorage.setItem("coin_results", "[]");
    } catch {}
  };

  const flipCoin = () => {
    if (isFlipping) return;
    setIsFlipping(true);
    const newResult = Math.random() < 0.5 ? "HEADS" : "TAILS";
    setResult(null);
    if (coinRef.current) {
      coinRef.current.classList.remove("settled");
      coinRef.current.classList.add("spinning");
    }
    setTimeout(() => {
      setResult(newResult);
      setFinalAngle(newResult === "HEADS" ? 0 : 180);
      if (newResult === "HEADS") setHeadsCount((c) => c + 1);
      else setTailsCount((c) => c + 1);
      try {
        const results = JSON.parse(localStorage.getItem("coin_results") || "[]");
        results.push({ result: newResult, timestamp: new Date().toISOString() });
        localStorage.setItem("coin_results", JSON.stringify(results));
      } catch {}
      setIsFlipping(false);
      if (coinRef.current) {
        coinRef.current.classList.remove("spinning");
        coinRef.current.classList.add("settled");
      }
    }, 1000);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } finally {
      history.replace("/login");
    }
  };

  return (
    <IonPage className={pageClass}>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Coin Flip</IonTitle>
          <IonButtons slot="end">
            <IonButton color="medium" onClick={handleLogout}>
              Logout
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <div
          style={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            perspective: 800,
          }}
        >
          <div
            style={{
              height: 260,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 16,
            }}
          >
            <div
              ref={coinRef}
              className={isFlipping ? "coin spinning" : "coin settled"}
              style={{
                width: 200,
                height: 200,
                position: "relative",
                transformStyle: "preserve-3d",
                transition: "transform 200ms ease-out",
                transform: `rotateY(${finalAngle}deg)`,
                willChange: "transform",
              }}
            >
              <div
                className="face front"
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backfaceVisibility: "hidden",
                  transform: "rotateY(0deg)",
                }}
              >
                <div
                  style={{
                    width: 180,
                    height: 180,
                    borderRadius: "50%",
                    background: "radial-gradient(circle at 30% 30%, #ffd54f, #ffb300)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 800,
                    color: "#5a3300",
                    fontSize: 28,
                    boxShadow: "0 6px 10px rgba(0,0,0,0.18)",
                  }}
                >
                  HEADS
                </div>
              </div>
              <div
                className="face back"
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backfaceVisibility: "hidden",
                  transform: "rotateY(180deg)",
                }}
              >
                <div
                  style={{
                    width: 180,
                    height: 180,
                    borderRadius: "50%",
                    background: "radial-gradient(circle at 30% 30%, #e0e0e0, #9e9e9e)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 800,
                    color: "#222",
                    fontSize: 28,
                    boxShadow: "0 6px 10px rgba(0,0,0,0.18)",
                  }}
                >
                  TAILS
                </div>
              </div>
            </div>
          </div>

          <div style={{ minHeight: 36, marginBottom: 12 }}>
            <h2
              style={{
                margin: 0,
                visibility: !isFlipping && result ? "visible" : "hidden",
              }}
            >
              {result || ""}
            </h2>
          </div>

          <div style={{ width: "100%", maxWidth: "300px" }}>
            <IonButton expand="block" onClick={flipCoin} disabled={isFlipping}>
              {isFlipping ? "Flipping..." : "Flip Coin"}
            </IonButton>
            <IonButton expand="block" fill="clear" onClick={resetCounts}>
              Reset
            </IonButton>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: 12,
              }}
            >
              <div style={{ textAlign: "center", flex: 1, marginRight: 8 }}>
                <div style={{ fontSize: 14, color: "#666" }}>HEADS</div>
                <div style={{ fontSize: 20, fontWeight: 700 }}>{headsCount}</div>
              </div>
              <div style={{ textAlign: "center", flex: 1, marginLeft: 8 }}>
                <div style={{ fontSize: 14, color: "#666" }}>TAILS</div>
                <div style={{ fontSize: 20, fontWeight: 700 }}>{tailsCount}</div>
              </div>
            </div>
          </div>
        </div>

        <style>{`
          @keyframes flip { 0% { transform: rotateY(0); } 100% { transform: rotateY(720deg); } }
          .coin { transform-style: preserve-3d; }
          .coin .face { backface-visibility: hidden; }
          .coin.spinning { animation: spin 1s linear; }
          @keyframes spin { from { transform: rotateY(0); } to { transform: rotateY(720deg); } }
          .coin .face > div { pointer-events: none; }
          .enter-from-right { animation: enterFromRight 300ms ease both; }
          .enter-from-left { animation: enterFromLeft 300ms ease both; }
          @keyframes enterFromRight { from { transform: translateX(100%); opacity: 0 } to { transform: translateX(0); opacity: 1 } }
          @keyframes enterFromLeft { from { transform: translateX(-100%); opacity: 0 } to { transform: translateX(0); opacity: 1 } }
        `}</style>
      </IonContent>
    </IonPage>
  );
}
