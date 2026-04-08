"use client";

import { useEffect, useState } from "react";

type MortgageRateResponse = {
  date: string | null;
  rate: number | null;
  label: string;
  source: string;
};

type MortgageCalculationResponse = {
  monthly_payment: {
    total: number;
    mortgage: number;
    property_tax: number;
    hoa: number;
    annual_home_ins: number;
  };
  annual_payment: {
    total: number;
    mortgage: number;
    property_tax: number;
    hoa: number;
    home_insurance: number;
  };
  total_interest_paid: number;
};

type FormState = {
  homeValue: string;
  downpayment: string;
  interestRate: string;
  durationYears: string;
  monthlyHoa: string;
  annualPropertyTax: string;
  annualHomeInsurance: string;
};

const defaultFormState: FormState = {
  homeValue: "450000",
  downpayment: "90000",
  interestRate: "5.99",
  durationYears: "25",
  monthlyHoa: "0",
  annualPropertyTax: "3600",
  annualHomeInsurance: "1200",
};

const currencyFormatter = new Intl.NumberFormat("en-CA", {
  style: "currency",
  currency: "CAD",
  maximumFractionDigits: 0,
});

export default function MortgageCalculatorCard() {
  const [formState, setFormState] = useState<FormState>(defaultFormState);
  const [rateData, setRateData] = useState<MortgageRateResponse | null>(null);
  const [result, setResult] = useState<MortgageCalculationResponse | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingRate, setIsLoadingRate] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rateError, setRateError] = useState<string | null>(null);

  useEffect(() => {
    const loadRate = async () => {
      try {
        const response = await fetch("/api/mortgage-calculator", {
          method: "GET",
          cache: "no-store",
        });

        const data = (await response.json()) as MortgageRateResponse & {
          error?: string;
        };

        if (!response.ok) {
          setRateError(data.error ?? "Unable to load the latest mortgage rate.");
          return;
        }

        setRateData(data);

        if (typeof data.rate === "number") {
          const latestRate = data.rate.toFixed(2);
          setFormState((currentState) => ({
            ...currentState,
            interestRate: latestRate,
          }));
        }
      } catch (loadError) {
        console.error("Mortgage rate load error:", loadError);
        setRateError("Unable to load the latest mortgage rate.");
      } finally {
        setIsLoadingRate(false);
      }
    };

    void loadRate();
  }, []);

  const handleChange = (field: keyof FormState, value: string) => {
    setFormState((currentState) => ({
      ...currentState,
      [field]: value,
    }));
  };

  const handleUseLatestRate = () => {
    if (typeof rateData?.rate !== "number") {
      return;
    }

    const latestRate = rateData.rate.toFixed(2);

    setFormState((currentState) => ({
      ...currentState,
      interestRate: latestRate,
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/mortgage-calculator", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          homeValue: Number(formState.homeValue),
          downpayment: Number(formState.downpayment),
          interestRate: Number(formState.interestRate),
          durationYears: Number(formState.durationYears),
          monthlyHoa: Number(formState.monthlyHoa),
          annualPropertyTax: Number(formState.annualPropertyTax),
          annualHomeInsurance: Number(formState.annualHomeInsurance),
        }),
      });

      const data = (await response.json()) as MortgageCalculationResponse & {
        error?: string;
      };

      if (!response.ok) {
        setResult(null);
        setError(data.error ?? "Unable to calculate your mortgage estimate.");
        return;
      }

      setResult(data);
    } catch (submitError) {
      console.error("Mortgage calculator submit error:", submitError);
      setResult(null);
      setError("Unable to calculate your mortgage estimate.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="rounded-3xl bg-white p-8 shadow-sm">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-[#8C5A3C]">
            Financial Tools
          </p>
          <h2 className="mt-3 text-2xl font-semibold">Mortgage Calculator</h2>
          <p className="mt-3 max-w-3xl text-sm text-[#4B2E2B]">
            Test a purchase price, down payment, and carrying costs to get a live
            estimate powered by API Ninjas, with a Canadian benchmark rate from the
            Bank of Canada.
          </p>
        </div>
        <div className="rounded-2xl bg-[#FFF8F0] px-4 py-3 text-sm text-[#4B2E2B]">
          <p className="font-semibold text-[#8C5A3C]">
            Latest Canadian posted rate
          </p>
          <p className="mt-1 text-lg font-semibold">
            {isLoadingRate
              ? "Loading..."
              : rateData?.rate
                ? `${rateData.rate.toFixed(2)}%`
                : "Unavailable"}
          </p>
          <p className="mt-1 text-xs text-[#6B4A3A]">
            {rateData?.label ?? "Canadian mortgage benchmark"}
          </p>
          <p className="mt-1 text-xs text-[#6B4A3A]">
            {rateData?.date
              ? `${rateData.source} update: ${rateData.date}`
              : "Live rate unavailable"}
          </p>
          <button
            type="button"
            onClick={handleUseLatestRate}
            disabled={!rateData?.rate}
            className="mt-3 rounded-md bg-[#8C5A3C] px-3 py-2 text-xs font-medium text-[#FFF8F0] transition hover:bg-[#4B2E2B] disabled:cursor-not-allowed disabled:opacity-50"
          >
            Use this rate
          </button>
        </div>
      </div>

      {rateError ? (
        <p className="mt-4 rounded-2xl bg-[#FFF1E8] px-4 py-3 text-sm text-[#8A4B2B]">
          {rateError}
        </p>
      ) : null}

      <form className="mt-6 grid gap-4 lg:grid-cols-2" onSubmit={handleSubmit}>
        <label className="flex flex-col gap-2 text-sm text-[#4B2E2B]">
          Home value
          <input
            type="number"
            min="1"
            step="1000"
            value={formState.homeValue}
            onChange={(event) => handleChange("homeValue", event.target.value)}
            className="rounded-2xl border border-[#D6B79F] bg-[#FFF8F0] px-4 py-3 outline-none transition focus:border-[#8C5A3C]"
          />
        </label>

        <label className="flex flex-col gap-2 text-sm text-[#4B2E2B]">
          Down payment
          <input
            type="number"
            min="0"
            step="1000"
            value={formState.downpayment}
            onChange={(event) => handleChange("downpayment", event.target.value)}
            className="rounded-2xl border border-[#D6B79F] bg-[#FFF8F0] px-4 py-3 outline-none transition focus:border-[#8C5A3C]"
          />
        </label>

        <label className="flex flex-col gap-2 text-sm text-[#4B2E2B]">
          Interest rate %
          <input
            type="number"
            min="0.01"
            max="100"
            step="0.01"
            value={formState.interestRate}
            onChange={(event) => handleChange("interestRate", event.target.value)}
            className="rounded-2xl border border-[#D6B79F] bg-[#FFF8F0] px-4 py-3 outline-none transition focus:border-[#8C5A3C]"
          />
        </label>

        <label className="flex flex-col gap-2 text-sm text-[#4B2E2B]">
          Term in years
          <input
            type="number"
            min="1"
            max="100"
            step="1"
            value={formState.durationYears}
            onChange={(event) => handleChange("durationYears", event.target.value)}
            className="rounded-2xl border border-[#D6B79F] bg-[#FFF8F0] px-4 py-3 outline-none transition focus:border-[#8C5A3C]"
          />
        </label>

        <label className="flex flex-col gap-2 text-sm text-[#4B2E2B]">
          Monthly HOA
          <input
            type="number"
            min="0"
            step="50"
            value={formState.monthlyHoa}
            onChange={(event) => handleChange("monthlyHoa", event.target.value)}
            className="rounded-2xl border border-[#D6B79F] bg-[#FFF8F0] px-4 py-3 outline-none transition focus:border-[#8C5A3C]"
          />
        </label>

        <label className="flex flex-col gap-2 text-sm text-[#4B2E2B]">
          Annual property tax
          <input
            type="number"
            min="0"
            step="100"
            value={formState.annualPropertyTax}
            onChange={(event) =>
              handleChange("annualPropertyTax", event.target.value)
            }
            className="rounded-2xl border border-[#D6B79F] bg-[#FFF8F0] px-4 py-3 outline-none transition focus:border-[#8C5A3C]"
          />
        </label>

        <label className="flex flex-col gap-2 text-sm text-[#4B2E2B]">
          Annual home insurance
          <input
            type="number"
            min="0"
            step="100"
            value={formState.annualHomeInsurance}
            onChange={(event) =>
              handleChange("annualHomeInsurance", event.target.value)
            }
            className="rounded-2xl border border-[#D6B79F] bg-[#FFF8F0] px-4 py-3 outline-none transition focus:border-[#8C5A3C]"
          />
        </label>

        <div className="flex items-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-2xl bg-[#8C5A3C] px-5 py-3 text-sm font-medium text-[#FFF8F0] transition hover:bg-[#4B2E2B] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Calculating..." : "Calculate payment"}
          </button>
        </div>
      </form>

      {error ? (
        <p className="mt-4 rounded-2xl bg-[#FFF1E8] px-4 py-3 text-sm text-[#8A4B2B]">
          {error}
        </p>
      ) : null}

      {result ? (
        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl bg-[#FFF8F0] p-5">
            <p className="text-sm text-[#8C5A3C]">Monthly payment</p>
            <p className="mt-2 text-2xl font-semibold text-[#4B2E2B]">
              {currencyFormatter.format(result.monthly_payment.total)}
            </p>
          </div>
          <div className="rounded-2xl bg-[#FFF8F0] p-5">
            <p className="text-sm text-[#8C5A3C]">Monthly principal + interest</p>
            <p className="mt-2 text-2xl font-semibold text-[#4B2E2B]">
              {currencyFormatter.format(result.monthly_payment.mortgage)}
            </p>
          </div>
          <div className="rounded-2xl bg-[#FFF8F0] p-5">
            <p className="text-sm text-[#8C5A3C]">Annual payment</p>
            <p className="mt-2 text-2xl font-semibold text-[#4B2E2B]">
              {currencyFormatter.format(result.annual_payment.total)}
            </p>
          </div>
          <div className="rounded-2xl bg-[#FFF8F0] p-5">
            <p className="text-sm text-[#8C5A3C]">Total interest paid</p>
            <p className="mt-2 text-2xl font-semibold text-[#4B2E2B]">
              {currencyFormatter.format(result.total_interest_paid)}
            </p>
          </div>
        </div>
      ) : null}
    </div>
  );
}
