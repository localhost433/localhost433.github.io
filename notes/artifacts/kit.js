/* AUTO-GENERATED from kit.jsx by `npm run build:artifacts` — do not edit. */
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
import React from "react";
function cn(...a) {
  return a.filter(Boolean).join(" ");
}
export function Button({
  variant = "default",
  size = "default",
  className,
  ...props
}) {
  return /*#__PURE__*/React.createElement("button", _extends({
    className: cn("ui-btn", "ui-btn--" + variant, "ui-btn--size-" + size, className)
  }, props));
}
export function Card({
  title,
  className,
  children,
  ...props
}) {
  if (title != null) {
    return /*#__PURE__*/React.createElement("div", _extends({
      className: cn("ui-card", className)
    }, props), /*#__PURE__*/React.createElement("div", {
      className: "ui-card__header"
    }, /*#__PURE__*/React.createElement("h3", {
      className: "ui-card__title"
    }, title)), /*#__PURE__*/React.createElement("div", {
      className: "ui-card__content"
    }, children));
  }
  return /*#__PURE__*/React.createElement("div", _extends({
    className: cn("ui-card", className)
  }, props), children);
}
export function CardHeader({
  className,
  ...props
}) {
  return /*#__PURE__*/React.createElement("div", _extends({
    className: cn("ui-card__header", className)
  }, props));
}
export function CardTitle({
  className,
  ...props
}) {
  return /*#__PURE__*/React.createElement("h3", _extends({
    className: cn("ui-card__title", className)
  }, props));
}
export function CardDescription({
  className,
  ...props
}) {
  return /*#__PURE__*/React.createElement("p", _extends({
    className: cn("ui-card__description", className)
  }, props));
}
export function CardContent({
  className,
  ...props
}) {
  return /*#__PURE__*/React.createElement("div", _extends({
    className: cn("ui-card__content", className)
  }, props));
}
export function CardFooter({
  className,
  ...props
}) {
  return /*#__PURE__*/React.createElement("div", _extends({
    className: cn("ui-card__footer", className)
  }, props));
}
export function Badge({
  variant = "default",
  className,
  ...props
}) {
  return /*#__PURE__*/React.createElement("span", _extends({
    className: cn("ui-badge", "ui-badge--" + variant, className)
  }, props));
}
export function Input({
  className,
  ...props
}) {
  return /*#__PURE__*/React.createElement("input", _extends({
    className: cn("ui-input", className)
  }, props));
}
export function Label({
  className,
  ...props
}) {
  return /*#__PURE__*/React.createElement("label", _extends({
    className: cn("ui-label", className)
  }, props));
}
export function Slider({
  className,
  ...props
}) {
  return /*#__PURE__*/React.createElement("input", _extends({
    type: "range",
    className: cn("ui-slider", className)
  }, props));
}
export function Switch({
  checked,
  onCheckedChange,
  className,
  ...props
}) {
  return /*#__PURE__*/React.createElement("button", _extends({
    type: "button",
    role: "switch",
    "aria-checked": !!checked,
    "data-state": checked ? "checked" : "unchecked",
    className: cn("ui-switch", className),
    onClick: () => onCheckedChange && onCheckedChange(!checked)
  }, props), /*#__PURE__*/React.createElement("span", {
    className: "ui-switch__thumb"
  }));
}
export function useTheme() {
  const [theme, setTheme] = React.useState(window.__theme || "light");
  React.useEffect(() => {
    const on = e => setTheme(e.detail);
    window.addEventListener("themechange", on);
    return () => window.removeEventListener("themechange", on);
  }, []);
  return theme;
}
const CHART_COLORS_LIGHT = ["#6d28d9", "#2563eb", "#059669", "#d97706", "#dc2626"];
const CHART_COLORS_DARK = ["#a78bfa", "#60a5fa", "#34d399", "#fbbf24", "#f87171"];
export function useChartTheme() {
  const dark = useTheme() === "dark";
  const colors = dark ? CHART_COLORS_DARK : CHART_COLORS_LIGHT;
  return {
    colors,
    line: colors[0],
    grid: dark ? "#2c2f33" : "#e5e7eb",
    axis: dark ? "#9aa0a6" : "#6b7280",
    tooltip: {
      background: dark ? "#15171a" : "#ffffff",
      border: "1px solid " + (dark ? "#2c2f33" : "#e5e7eb"),
      borderRadius: 8,
      fontSize: 12
    }
  };
}
export function Field({
  label,
  htmlFor,
  className,
  children,
  ...props
}) {
  return /*#__PURE__*/React.createElement("div", _extends({
    className: cn("ui-field", className)
  }, props), label != null ? /*#__PURE__*/React.createElement(Label, {
    htmlFor: htmlFor
  }, label) : null, children);
}
export function Stat({
  label,
  value,
  className,
  ...props
}) {
  return /*#__PURE__*/React.createElement("div", _extends({
    className: cn("ui-stat", className)
  }, props), label != null ? /*#__PURE__*/React.createElement("div", {
    className: "ui-stat__label"
  }, label) : null, /*#__PURE__*/React.createElement("div", {
    className: "ui-stat__value"
  }, value));
}
export function ButtonGroup({
  className,
  ...props
}) {
  return /*#__PURE__*/React.createElement("div", _extends({
    role: "group",
    className: cn("ui-btn-group", className)
  }, props));
}
export function Stepper({
  value,
  onChange,
  step = 1,
  min,
  max,
  className,
  ...props
}) {
  const clamp = n => min != null && n < min ? min : max != null && n > max ? max : n;
  return /*#__PURE__*/React.createElement("div", _extends({
    className: cn("ui-row", className)
  }, props), /*#__PURE__*/React.createElement(Button, {
    variant: "outline",
    size: "icon",
    "aria-label": "Decrease",
    disabled: min != null && value <= min,
    onClick: () => onChange(clamp(value - step))
  }, "\u2212"), /*#__PURE__*/React.createElement("span", {
    className: "ui-stat__value",
    style: {
      minWidth: "3ch",
      textAlign: "center"
    }
  }, value), /*#__PURE__*/React.createElement(Button, {
    variant: "outline",
    size: "icon",
    "aria-label": "Increase",
    disabled: max != null && value >= max,
    onClick: () => onChange(clamp(value + step))
  }, "+"));
}