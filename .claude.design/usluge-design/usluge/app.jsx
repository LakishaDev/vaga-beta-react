// Root mount + scroll progress + global keyframes
const rootEl = document.getElementById("root");

function App() {
  return (
    <main>
      <Hero/>
      <ZigExplainer/>
      <Services/>
      <Klase/>
      <MKOSection/>
      <Proces/>
      <CTA/>
      <style>{`
        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(212,181,116,0.6); }
          70% { box-shadow: 0 0 0 14px rgba(212,181,116,0); }
          100% { box-shadow: 0 0 0 0 rgba(212,181,116,0); }
        }
        a:hover { color: var(--champagne); }
        button:focus-visible, a:focus-visible { outline: 1px solid var(--champagne); outline-offset: 4px; border-radius: 4px; }
        @media (max-width: 900px) {
          main > * { padding-left: 22px !important; padding-right: 22px !important; }
        }
      `}</style>
    </main>
  );
}

ReactDOM.createRoot(rootEl).render(<App/>);
