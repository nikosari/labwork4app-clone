import { useEffect, useState } from "react";
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
  IonItem, IonInput, IonButton, IonText, IonSpinner, IonCard,
  IonCardHeader, IonCardTitle, IonCardContent, IonLabel
} from "@ionic/react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebaseConfig";
import { Link, useHistory } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      history.replace("/app/flip");
    }
  }, [user, history]);

  const login = async () => {
    if (loading) return;
    const e = email.trim();
    const p = pw.trim();

    if (!e || !p) return setErr("Please fill in all fields");
    if (!/^\S+@\S+\.\S+$/.test(e)) return setErr("Invalid email address");

    setErr("");
    setLoading(true);
    try {
      const cred = await signInWithEmailAndPassword(auth, e, p);
      console.log("[Login] success uid=", cred.user.uid);
      history.replace("/app/flip");
    } catch (er: any) {
      console.error("[Login] error:", er);
      const map: Record<string, string> = {
        "auth/invalid-email": "Invalid email address",
        "auth/user-not-found": "No account found with this email",
        "auth/wrong-password": "Incorrect password",
        "auth/too-many-requests": "Too many attempts, try later",
        "auth/network-request-failed": "Network error",
      };
      setErr(map[er.code] || `Login failed: ${er.code || er.message}`);
    } finally {
      setLoading(false);
    }
  };

  const onKeyDown = (ev: React.KeyboardEvent) => {
    if (ev.key === "Enter") login();
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Welcome</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Sign In</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <IonItem>
              <IonLabel position="floating">Email</IonLabel>
              <IonInput
                type="email"
                value={email}
                onKeyDown={onKeyDown}
                onIonChange={(e) => setEmail(e.detail.value ?? "")}
              />
            </IonItem>

            <IonItem>
              <IonLabel position="floating">Password</IonLabel>
              <IonInput
                type="password"
                value={pw}
                onKeyDown={onKeyDown}
                onIonChange={(e) => setPw(e.detail.value ?? "")}
              />
            </IonItem>

            {err && (
              <IonText color="danger">
                <p className="ion-no-margin">{err}</p>
              </IonText>
            )}

            <IonButton expand="block" onClick={login} disabled={loading}>
              {loading ? <IonSpinner name="crescent" /> : "Sign In"}
            </IonButton>

            <div className="ion-text-center ion-margin-top">
              <p>
                No account yet?{" "}
                <Link to="/register">Create Account</Link>
              </p>
            </div>
          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  );
}
