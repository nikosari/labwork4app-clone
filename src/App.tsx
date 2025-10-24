import {
  IonApp,
  setupIonicReact,
  IonTabs,
  IonTabBar,
  IonTabButton,
  IonIcon,
  IonLabel,
  IonSpinner,
  IonRouterOutlet,
} from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { Redirect, Route } from "react-router-dom";

import CoinFlip from "./pages/CoinFlip";
import Results from "./pages/Results";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { refreshOutline, listOutline } from "ionicons/icons";

import "@ionic/react/css/core.css";
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";
import "./theme/variables.css";

setupIonicReact();

function TabsLayout() {
  return (
    <IonTabs>
      <IonRouterOutlet>
        <Route exact path="/app/flip" component={CoinFlip} />
        <Route exact path="/app/results" component={Results} />
        <Route exact path="/app">
          <Redirect to="/app/flip" />
        </Route>
      </IonRouterOutlet>

      <IonTabBar slot="bottom">
        <IonTabButton tab="flip" href="/app/flip">
          <IonIcon icon={refreshOutline} />
          <IonLabel>Flip</IonLabel>
        </IonTabButton>
        <IonTabButton tab="results" href="/app/results">
          <IonIcon icon={listOutline} />
          <IonLabel>Results</IonLabel>
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  );
}

function Routes() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="ion-text-center ion-padding">
        <IonSpinner />
      </div>
    );
  }

  if (!user) {
    return (
      <IonRouterOutlet>
        <Route exact path="/login" component={Login} />
        <Route exact path="/register" component={Register} />
        <Route exact path="/">
          <Redirect to="/login" />
        </Route>
        {/* 404 → login */}
        <Route>
          <Redirect to="/login" />
        </Route>
      </IonRouterOutlet>
    );
  }

  return (
    <IonRouterOutlet>
      <Route path="/app" render={() => <TabsLayout />} />
      <Route exact path="/">
        <Redirect to="/app/flip" />
      </Route>
      {/* 404 → app/flip */}
      <Route>
        <Redirect to="/app/flip" />
      </Route>
    </IonRouterOutlet>
  );
}

export default function App() {
  return (
    <IonApp>
      <IonReactRouter>
        <AuthProvider>
          <Routes />
        </AuthProvider>
      </IonReactRouter>
    </IonApp>
  );
}
