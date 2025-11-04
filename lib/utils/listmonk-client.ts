
interface OnboardingPayload {
  email: string;
  firstName?: string;
}

function assertEnv() {
  if (!process.env.LISTMONK_URL || !process.env.LISTMONK_API_KEY) {
    throw new Error('Listmonk is not configured (LISTMONK_URL, LISTMONK_API_KEY)');
  }
}

export async function sendTransactional(options: {
  email: string;
  templateId: string | number;
  data?: Record<string, any>;
}): Promise<void> {
  assertEnv();
  const base = (process.env.LISTMONK_URL as string).replace(/\/$/, '');
  const apiKey = process.env.LISTMONK_API_KEY as string;
  const url = `${base}/api/tx`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Basic ${Buffer.from(`${apiKey}:`).toString('base64')}`,
    },
    body: JSON.stringify({
      subscriber_email: options.email,
      template_id: Number(options.templateId),
      data: options.data ?? {},
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Listmonk tx failed: ${res.status} ${text}`);
  }
}

export async function sendOnboardingTransactional(payload: OnboardingPayload): Promise<void> {
  if (!process.env.LISTMONK_TEMPLATE_ONBOARD_ID) {
    // eslint-disable-next-line no-console
    console.warn('LISTMONK_TEMPLATE_ONBOARD_ID not set; skipping onboarding send');
    return;
  }
  await sendTransactional({
    email: payload.email,
    templateId: process.env.LISTMONK_TEMPLATE_ONBOARD_ID as string,
    data: {
      first_name: payload.firstName ?? 'there',
      onboarding_url: `${process.env.BASE_URL || ''}/onboarding`,
      apply_url: `${process.env.BASE_URL || ''}/apply`,
    },
  });
}
