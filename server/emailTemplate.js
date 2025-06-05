const createEmailTemplate = (data) => {
  const { name, email, company, goal, date, budget, details } = data;
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Contact Form Submission</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333333;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #ffffff;
        }
        .header {
          text-align: center;
          padding: 20px 0;
          background-color: #f8f9fa;
        }
        .logo {
          max-width: 200px;
          height: auto;
        }
        .content {
          padding: 20px 0;
        }
        .field {
          margin-bottom: 15px;
        }
        .label {
          font-weight: bold;
          color: #666666;
        }
        .value {
          margin-top: 5px;
        }
        .footer {
          text-align: center;
          padding: 20px;
          background-color: #f8f9fa;
          color: #666666;
          font-size: 12px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <img src="cid:company-logo" alt="LiquiData Logo" class="logo">
        </div>
        <div class="content">
          <h2>New Contact Form Submission</h2>
          
          <div class="field">
            <div class="label">Name:</div>
            <div class="value">${name}</div>
          </div>
          
          <div class="field">
            <div class="label">Email:</div>
            <div class="value">${email}</div>
          </div>
          
          <div class="field">
            <div class="label">Company:</div>
            <div class="value">${company}</div>
          </div>
          
          <div class="field">
            <div class="label">Project Goal:</div>
            <div class="value">${goal}</div>
          </div>
          
          <div class="field">
            <div class="label">Target Completion Date:</div>
            <div class="value">${date}</div>
          </div>
          
          <div class="field">
            <div class="label">Budget Range:</div>
            <div class="value">${budget}</div>
          </div>
          
          <div class="field">
            <div class="label">Additional Details:</div>
            <div class="value">${details || 'No additional details provided.'}</div>
          </div>
        </div>
        <div class="footer">
          <p>This email was sent from the LiquiData website contact form.</p>
          <p>© ${new Date().getFullYear()} LiquiData. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

module.exports = createEmailTemplate; 