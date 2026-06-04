import React from "react";

function cn(...a) { return a.filter(Boolean).join(" "); }

export function Button({ variant = "default", size = "default", className, ...props }) {
  return <button className={cn("ui-btn", "ui-btn--" + variant, "ui-btn--size-" + size, className)} {...props} />;
}

export function Card({ title, className, children, ...props }) {
  if (title != null) {
    return (
      <div className={cn("ui-card", className)} {...props}>
        <div className="ui-card__header"><h3 className="ui-card__title">{title}</h3></div>
        <div className="ui-card__content">{children}</div>
      </div>
    );
  }
  return <div className={cn("ui-card", className)} {...props}>{children}</div>;
}
export function CardHeader({ className, ...props }) { return <div className={cn("ui-card__header", className)} {...props} />; }
export function CardTitle({ className, ...props }) { return <h3 className={cn("ui-card__title", className)} {...props} />; }
export function CardDescription({ className, ...props }) { return <p className={cn("ui-card__description", className)} {...props} />; }
export function CardContent({ className, ...props }) { return <div className={cn("ui-card__content", className)} {...props} />; }
export function CardFooter({ className, ...props }) { return <div className={cn("ui-card__footer", className)} {...props} />; }

export function Badge({ variant = "default", className, ...props }) {
  return <span className={cn("ui-badge", "ui-badge--" + variant, className)} {...props} />;
}

export function Input({ className, ...props }) {
  return <input className={cn("ui-input", className)} {...props} />;
}

export function Label({ className, ...props }) {
  return <label className={cn("ui-label", className)} {...props} />;
}

export function Slider({ className, ...props }) {
  return <input type="range" className={cn("ui-slider", className)} {...props} />;
}

export function Switch({ checked, onCheckedChange, className, ...props }) {
  return (
    <button type="button" role="switch" aria-checked={!!checked}
      data-state={checked ? "checked" : "unchecked"}
      className={cn("ui-switch", className)}
      onClick={() => onCheckedChange && onCheckedChange(!checked)} {...props}>
      <span className="ui-switch__thumb" />
    </button>
  );
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
