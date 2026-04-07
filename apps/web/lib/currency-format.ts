const DEFAULT_LOCALE = 'en-GB';
const PREFERRED_CURRENCY_SYMBOLS: Partial<Record<string, string>> = {
  EUR: '€',
  GBP: '£',
  USD: '$',
};

type CurrencyFormatOptions = {
  maximumFractionDigits?: number;
  minimumFractionDigits?: number;
  notation?: 'standard' | 'compact';
};

export function formatCurrencyValue(
  value: number,
  currency: string,
  options: CurrencyFormatOptions = {},
) {
  const normalizedCurrency = currency.toUpperCase();
  const {
    maximumFractionDigits = 0,
    minimumFractionDigits,
    notation = 'standard',
  } = options;

  const formatter = new Intl.NumberFormat(DEFAULT_LOCALE, {
    style: 'currency',
    currency: normalizedCurrency,
    currencyDisplay: 'narrowSymbol',
    notation,
    maximumFractionDigits,
    minimumFractionDigits,
  });
  const preferredSymbol = PREFERRED_CURRENCY_SYMBOLS[normalizedCurrency];

  if (!preferredSymbol) {
    return formatter.format(value);
  }

  return formatter
    .formatToParts(value)
    .map((part) => (part.type === 'currency' ? preferredSymbol : part.value))
    .join('');
}
