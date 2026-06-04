import React from "react";

export function Card({ title, children }) {
  return (
    <section className="art-card">
      {title ? <h3>{title}</h3> : null}
      {children}
    </section>
  );
}

export function Slider(props) {
  return <input type="range" className="art-slider" {...props} />;
}

export function useTheme() {
  const [theme, setTheme] = React.useState(window.__theme || "light");
  React.useEffect(() => {
    const on = (e) => setTheme(e.detail);
    window.addEventListener("themechange", on);
    return () => window.removeEventListener("themechange", on);
  }, []);
  return theme;
}
