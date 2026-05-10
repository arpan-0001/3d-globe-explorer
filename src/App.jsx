import React, { useState } from "react";
import MainMenu from "./components/MainMenu";
import GlobeView from "./views/GlobeView";

const App = () => {
  const [view, setView] = useState(null);
  const [level, setLevel] = useState(null);

  if (view === "globe") return <GlobeView onBack={() => setView(null)} />;
  
  return <MainMenu onSelect={setView} />;
};

export default App;
