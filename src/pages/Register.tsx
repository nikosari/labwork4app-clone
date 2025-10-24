import { useState } from "react";
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
  IonInput, IonItem, IonButton, IonText, IonSpinner,
  IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonLabel
} from "@ionic/react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebaseConfig";
import { Link } from "react-router-dom";

export default function Register() {
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [pwConfirm, setPwConfirm] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const register = async () => {
    const e = email.trim();
    const p = pw.trim();
    const c = pwConfirm.trim();

    if (!e || !p || !c) return setErr("Please fill in all fields");
    if (!/^\S+@\S+\.\S+$/.test(e)) return setErr("Invalid email address");
    if (p.length < 6) return setErr("Password must be at least 6 characters");
    if (p !== c) return setErr("Passwords don't match");

    setErr("");
    setLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, e, p);
    } catch (e: any) {
      const map: Record<string,string> = {
        "auth/email-already-in-use": "Email already in use",
        "auth/invalid-email": "Invalid email address",
        "auth/weak-password": "Password is too weak",
        "auth/network-request-failed": "Network error, try again",
        "auth/too-many-requests": "Too many attempts, try later"
      };
      setErr(map[e.code] || `Registration failed: ${e.code || e.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (ev: React.KeyboardEvent) => {
    if (ev.key === "Enter") register();
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Create Account</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Sign Up</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <div className="ion-margin-bottom">
              <IonItem>
                <IonLabel position="floating">Email</IonLabel>
                <IonInput
                  type="email"
                  value={email}
                  onKeyDown={handleKeyDown}
                  onIonChange={(e) => setEmail(e.detail.value ?? "")}
                />
              </IonItem>

              <IonItem>
                <IonLabel position="floating">Password</IonLabel>
                <IonInput
                  type="password"
                  value={pw}
                  onKeyDown={handleKeyDown}
                  onIonChange={(e) => setPw(e.detail.value ?? "")}
                />
              </IonItem>

              <IonItem>
                <IonLabel position="floating">Confirm Password</IonLabel>
                <IonInput
                  type="password"
                  value={pwConfirm}
                  onKeyDown={handleKeyDown}
                  onIonChange={(e) => setPwConfirm(e.detail.value ?? "")}
                />
              </IonItem>
            </div>

            {err && (
              <IonText color="danger">
                <p className="ion-no-margin">{err}</p>
              </IonText>
            )}

            <IonButton expand="block" onClick={register} disabled={loading}>
              {loading ? <IonSpinner name="crescent" /> : "Create Account"}
            </IonButton>

            <div className="ion-text-center ion-margin-top">
              <p>Already have an account? <Link to="/login">Sign In</Link></p>
            </div>
          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  );
}
