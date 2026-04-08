import { NextResponse } from "next/server";

const API_NINJAS_BASE_URL = "https://api.api-ninjas.com/v1";
const BANK_OF_CANADA_RATE_URL =
  "https://www.bankofcanada.ca/valet/observations/V80691335/json?recent=1";

type MortgageCalculatorRequest = {
  homeValue: number;
  downpayment: number;
  interestRate: number;
  durationYears: number;
  monthlyHoa?: number;
  annualPropertyTax?: number;
  annualHomeInsurance?: number;
};

function getApiKey() {
  return process.env.API_NINJAS_API_KEY;
}

function buildHeaders(apiKey: string) {
  return {
    "X-Api-Key": apiKey,
  };
}

function toNumber(value: unknown, fallback = 0) {
  const parsedValue =
    typeof value === "number" ? value : Number.parseFloat(String(value ?? ""));

  return Number.isFinite(parsedValue) ? parsedValue : fallback;
}

function validateRequest(body: MortgageCalculatorRequest) {
  if (body.homeValue <= 0) {
    return "Home value must be greater than 0.";
  }

  if (body.downpayment < 0) {
    return "Down payment cannot be negative.";
  }

  if (body.downpayment >= body.homeValue) {
    return "Down payment must be less than the home value.";
  }

  if (body.interestRate <= 0) {
    return "Interest rate must be greater than 0.";
  }

  if (body.durationYears < 1 || body.durationYears > 100) {
    return "Mortgage term must be between 1 and 100 years.";
  }

  if (body.monthlyHoa && body.monthlyHoa < 0) {
    return "HOA fees cannot be negative.";
  }

  if (body.annualPropertyTax && body.annualPropertyTax < 0) {
    return "Property tax cannot be negative.";
  }

  if (body.annualHomeInsurance && body.annualHomeInsurance < 0) {
    return "Home insurance cannot be negative.";
  }

  return null;
}

export async function GET() {
  try {
    const response = await fetch(BANK_OF_CANADA_RATE_URL, {
      cache: "no-store",
    });

    if (!response.ok) {
      const errorText = await response.text();

      return NextResponse.json(
        {
          error: "Unable to load the latest Canadian mortgage rate right now.",
          details: errorText,
        },
        { status: response.status },
      );
    }

    const data = (await response.json()) as {
      observations?: Array<{
        d?: string;
        V80691335?: {
          v?: string;
        };
      }>;
    };
    const latestObservation = data.observations?.[0];
    const latestRate =
      latestObservation?.V80691335?.v !== undefined
        ? Number.parseFloat(latestObservation.V80691335.v)
        : null;

    return NextResponse.json({
      date: latestObservation?.d ?? null,
      rate: Number.isFinite(latestRate) ? latestRate : null,
      label: "5-year fixed conventional mortgage",
      source: "Bank of Canada",
    });
  } catch (error) {
    console.error("Canadian mortgage rate proxy error:", error);

    return NextResponse.json(
      { error: "Unable to reach the Bank of Canada for mortgage rates." },
      { status: 502 },
    );
  }
}

export async function POST(request: Request) {
  const apiKey = getApiKey();

  if (!apiKey) {
    return NextResponse.json(
      { error: "API Ninjas key is not configured on the server." },
      { status: 500 },
    );
  }

  const payload = (await request.json()) as Partial<MortgageCalculatorRequest>;

  const normalizedPayload: MortgageCalculatorRequest = {
    homeValue: toNumber(payload.homeValue),
    downpayment: toNumber(payload.downpayment),
    interestRate: toNumber(payload.interestRate),
    durationYears: toNumber(payload.durationYears, 30),
    monthlyHoa: toNumber(payload.monthlyHoa),
    annualPropertyTax: toNumber(payload.annualPropertyTax),
    annualHomeInsurance: toNumber(payload.annualHomeInsurance),
  };

  const validationError = validateRequest(normalizedPayload);

  if (validationError) {
    return NextResponse.json({ error: validationError }, { status: 400 });
  }

  const query = new URLSearchParams({
    home_value: String(normalizedPayload.homeValue),
    downpayment: String(normalizedPayload.downpayment),
    interest_rate: String(normalizedPayload.interestRate),
    duration_years: String(normalizedPayload.durationYears),
    monthly_hoa: String(normalizedPayload.monthlyHoa ?? 0),
    annual_property_tax: String(normalizedPayload.annualPropertyTax ?? 0),
    annual_home_insurance: String(normalizedPayload.annualHomeInsurance ?? 0),
  });

  try {
    const response = await fetch(
      `${API_NINJAS_BASE_URL}/mortgagecalculator?${query.toString()}`,
      {
        headers: buildHeaders(apiKey),
        cache: "no-store",
      },
    );

    if (!response.ok) {
      const errorText = await response.text();

      return NextResponse.json(
        {
          error: "Mortgage calculation failed.",
          details: errorText,
        },
        { status: response.status },
      );
    }

    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error("Mortgage calculator proxy error:", error);

    return NextResponse.json(
      { error: "Unable to reach API Ninjas for mortgage calculations." },
      { status: 502 },
    );
  }
}
