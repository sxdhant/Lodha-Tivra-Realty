// What the two enquiry forms send to /api/enquiry (app/api/enquiry/route.ts), which emails it to the team.
export type EnquiryPayload = {
  source: 'form' | 'quick';
  name: string;
  phone: string;
  email?: string;
  purpose: 'viewing' | 'brochure';
  // A residence id, or 'any' when the visitor has not decided.
  residence: string;
  message?: string;
  // A hidden field real visitors never see or fill; bots do. The server drops anything that has it.
  website?: string;
};

// True once the team has been emailed; false if anything went wrong, so the form can say so.
export async function sendEnquiry(payload: EnquiryPayload): Promise<boolean> {
  try {
    const response = await fetch('/api/enquiry', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return response.ok;
  } catch {
    return false;
  }
}
