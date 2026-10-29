// Placeholder: replace with a request to your CRM or form endpoint, or a Server Action.
// Both enquiry forms (the full one in "Visit" and the quick one in the pop-up) send through here.
export async function sendEnquiry<T>(values: T) {
  await new Promise((resolve) => setTimeout(resolve, 900));
  return values;
}
