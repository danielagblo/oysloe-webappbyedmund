export function formatCount(n: number | string | null | undefined): string {
  if (n == null || isNaN(Number(n))) return "0";

  n = Number(n);

  if (n < 20) return n.toString();

  if (n < 100) return n.toString() + "+";

  if (n < 200) {
    const rounded = Math.floor(n / 10) * 10;
    return `${rounded}+`;
  }

  if (n < 1000) {
    const rounded = Math.round(n / 50) * 50;
    return `${rounded}+`;
  }

  const units = [
    { value: 1e9, suffix: "B" },
    { value: 1e6, suffix: "M" },
    { value: 1e3, suffix: "K" },
  ];

  for (let u of units) {
    if (n >= u.value) {
      let formatted = (n / u.value).toFixed(1);
      formatted = formatted.replace(/\.0$/, "");
      return `${formatted}${u.suffix}`;
    }
  }

  return n.toString();
}
