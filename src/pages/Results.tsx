import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
  IonButton, IonList, IonItem, IonLabel
} from "@ionic/react";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { useIonViewWillEnter } from '@ionic/react';

interface FlipResult {
  result: string;
  timestamp: string;
}

export default function Results() {
  const location = useLocation();
  const [pageClass, setPageClass] = useState("");
  const [results, setResults] = useState<FlipResult[]>([]);

  useIonViewWillEnter(() => {
    try {
      const storedResults = JSON.parse(localStorage.getItem('coin_results') || '[]');
      setResults(storedResults.reverse());
    } catch {
      // ignore
    }
  });

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

  return (
  <IonPage className={pageClass}>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Results</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonList>
          {results.length === 0 ? (
            <IonItem>
              <IonLabel>No results yet</IonLabel>
            </IonItem>
          ) : (
            results.map((result, index) => (
              <IonItem key={index}>
                <IonLabel>
                  <h2>{result.result}</h2>
                  <p>{new Date(result.timestamp).toLocaleString()}</p>
                </IonLabel>
              </IonItem>
            ))
          )}
        </IonList>
        <IonButton expand="block" color="danger" onClick={() => {
          localStorage.setItem('coin_results', '[]');
          localStorage.setItem('coin_heads', '0');
          localStorage.setItem('coin_tails', '0');
          setResults([]);
        }}>
          Reset All Results
        </IonButton>
      </IonContent>
    </IonPage>
  );
}