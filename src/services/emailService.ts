export interface SendEmailPayload {
  recipientEmail: string;
  subject: string;
  text: string;
  html?: string;
}

export interface SendEmailResult {
  success: boolean;
  messageId?: string;
  message?: string;
  error?: string;
  isBadCredentials?: boolean;
  note?: string;
}

export async function sendPibDigestEmail(payload: SendEmailPayload): Promise<SendEmailResult> {
  try {
    const res = await fetch('/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const errText = await res.text();
      return {
        success: false,
        error: `HTTP ${res.status}: ${errText}`
      };
    }

    const data: SendEmailResult = await res.json();
    return data;
  } catch (err: any) {
    return {
      success: false,
      error: err.message || 'Network request failed'
    };
  }
}

export interface ScheduleSubscriptionPayload {
  recipientEmail: string;
  deliveryTimeIST: string;
  subject?: string;
  text?: string;
  html?: string;
}

export async function scheduleSubscriptionOnServer(payload: ScheduleSubscriptionPayload): Promise<{ success: boolean; message?: string }> {
  try {
    const res = await fetch('/api/schedule-subscription', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) return { success: false };
    return await res.json();
  } catch {
    return { success: false };
  }
}

