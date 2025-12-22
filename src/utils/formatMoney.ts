export function formatMoney(
  amount: number | string,
  currency: string = "GHS",
): string {
  if (typeof amount === "string") {
    amount = parseFloat(amount);
    if (isNaN(amount)) return "Invalid amount";
  }

  let symbol = "";
  switch (currency.toUpperCase()) {
    case "GHS":
      symbol = "₵";
      break;
    case "USD":
      symbol = "$";
      break;
    case "EUR":
      symbol = "€";
      break;
    case "GBP":
      symbol = "£";
      break;
    default:
      symbol = currency + " ";
  }

  const formatted = Math.abs(amount).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return `${symbol}${formatted}`;
}
