import { createTool } from '@mastra/core/tools';
import { z } from 'zod';

interface ExchangeRateResponse {
  result: string;
  base_code: string;
  rates: Record<string, number>;
}

export const currencyTool = createTool({
  id: 'convert-currency',
  description: 'Convert an amount from one currency to another using current exchange rates',
  inputSchema: z.object({
    amount: z.number().describe('The amount to convert'),
    from: z.string().length(3).describe('Source currency code, e.g. USD'),
    to: z.string().length(3).describe('Target currency code, e.g. EUR'),
  }),
  outputSchema: z.object({
    amount: z.number(),
    from: z.string(),
    to: z.string(),
    rate: z.number(),
    converted: z.number(),
  }),
  execute: async (inputData) => {
    return await convertCurrency(inputData.amount, inputData.from, inputData.to);
  },
});

const convertCurrency = async (amount: number, from: string, to: string) => {
  const fromCode = from.toUpperCase();
  const toCode = to.toUpperCase();

  const url = `https://open.er-api.com/v6/latest/${encodeURIComponent(fromCode)}`;
  const response = await fetch(url);
  const data = (await response.json()) as ExchangeRateResponse;

  if (data.result !== 'success') {
    throw new Error(`Could not fetch exchange rates for '${fromCode}'`);
  }

  const rate = data.rates[toCode];
  if (rate === undefined) {
    throw new Error(`Unknown target currency '${toCode}'`);
  }

  return {
    amount,
    from: fromCode,
    to: toCode,
    rate,
    converted: Math.round(amount * rate * 100) / 100,
  };
};
