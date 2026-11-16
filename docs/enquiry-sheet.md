# Saving enquiries to a Google Sheet

Each enquiry from the landing page is added as a row in a Google Sheet, as well as being emailed
(see `app/api/enquiry/route.ts`). The sheet is filled by a small Google Apps Script that you set up once.
The script also writes the column headings, so the sheet can start empty.

## 1. Create the script

1. Open your Google Sheet (a new, empty one is fine).
2. Open **Extensions → Apps Script**, delete what is there, and paste:

```js
// Change this to your own password, and use the same value for ENQUIRY_WEBHOOK_SECRET on the host.
const SECRET = 'change-this-to-a-long-random-password';

const HEADINGS = ['Date', 'Name', 'Phone', 'Email', 'Project', 'Request', 'Note', 'Sent from'];

// Writes the headings in row 1 (and keeps them in view), if the sheet does not have them yet.
function setupSheet() {
  const sheet = SpreadsheetApp.getActiveSheet();
  if (sheet.getRange(1, 1).getValue() === HEADINGS[0]) return;
  sheet.insertRowBefore(1);
  sheet.getRange(1, 1, 1, HEADINGS.length).setValues([HEADINGS]).setFontWeight('bold').setBackground('#f3efe8');
  sheet.setFrozenRows(1);
  sheet.setColumnWidths(1, HEADINGS.length, 150);
  sheet.setColumnWidth(7, 280);
}

function doPost(e) {
  const data = JSON.parse(e.postData.contents);
  if (data.secret !== SECRET) return ContentService.createTextOutput('forbidden');

  setupSheet();
  const when = Utilities.formatDate(new Date(), 'Asia/Kolkata', 'dd MMM yyyy, hh:mm a');
  SpreadsheetApp.getActiveSheet().appendRow([
    when, data.name, data.phone, data.email, data.project, data.request, data.note, data.source,
  ]);
  return ContentService.createTextOutput('ok');
}
```

3. To get the headings now, choose **setupSheet** in the function list at the top of the editor and click
   **Run**. Google asks you to approve permissions the first time. Row 1 of your sheet then has bold
   headings. If you skip this, the first enquiry adds them.
4. Click **Deploy → New deployment**. Choose the type **Web app**, then set:
   - Execute as: **Me**
   - Who has access: **Anyone**
5. Click **Deploy**, approve the permissions if asked, and copy the **Web app URL** (it ends in `/exec`).

## 2. Add the variables on the host (Vercel → Settings → Environment Variables)

| Name | Value |
| --- | --- |
| `ENQUIRY_WEBHOOK_URL` | the Web app URL you copied |
| `ENQUIRY_WEBHOOK_SECRET` | the same password as `SECRET` in the script |

Then redeploy the site.

## If you change the script later

Use **Deploy → Manage deployments → Edit → New version**. Pasting new code without making a new
version keeps the old one running.
