// pages/contact.js
"use client";

import { useState } from "react";

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    goal: "",
    date: "",
    budget: "",
    email: "",
    details: "",
    privacyPolicy: false,
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.privacyPolicy) {
      setMessage("Please accept the privacy policy.");
      return;
    }

    setLoading(true);
    setMessage("");

    const token = localStorage.getItem("adminToken");
    const companyId = process.env.NEXT_PUBLIC_COMPANY_ID;

    try {
      const res = await fetch(`process.env.API_BASE_URL`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
          "X-Company-ID": companyId,
        },
        body: JSON.stringify(formData),
      });

      const result = await res.json();

      if (res.ok) {
        setMessage("Inquiry submitted successfully!");
        setFormData({
          name: "",
          company: "",
          goal: "",
          date: "",
          budget: "",
          email: "",
          details: "",
          privacyPolicy: false,
        });
      } else {
        setMessage(result.message || "Submission failed.");
      }
    } catch (error) {
      console.error(error);
      setMessage("Error connecting to server.");
    }

    setLoading(false);
  };

  return (
    <section className="contact-section">
      <div className="container">
        <div className="form-container">
          <p className="form-intro">Fill the form below:</p>

          <form onSubmit={handleSubmit} className="conversation-form">
            <div className="form-line">
              <div className="form-text">Hi! My name is</div>
              <div className="form-input-wrapper">
                <input
                  type="text"
                  name="name"
                  placeholder="Enter your name*"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>
              <div className="form-text">and I work with</div>
              <div className="form-input-wrapper">
                <input
                  type="text"
                  name="company"
                  placeholder="Company name type here*"
                  required
                  value={formData.company}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-line">
              <div className="form-text">I'm looking for a partner to help me with</div>
              <div className="form-input-wrapper">
                <input
                  type="text"
                  name="goal"
                  placeholder="Your goal type here*"
                  required
                  value={formData.goal}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-line">
              <div className="form-text">With an idea of having that completed</div>
              <div className="form-input-wrapper">
                <input
                  type="text"
                  name="date"
                  placeholder="Date*"
                  required
                  value={formData.date}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-line">
              <div className="form-text">I am hoping to stay around a budget range of</div>
              <div className="form-input-wrapper">
                <select name="budget" required value={formData.budget} onChange={handleChange} className="form-input">
                  <option value="" disabled>
                    Select*
                  </option>
                  <option value="5k-10k">$5,000 - $10,000</option>
                  <option value="10k-25k">$10,000 - $25,000</option>
                  <option value="25k-50k">$25,000 - $50,000</option>
                  <option value="50k+">$50,000+</option>
                </select>
              </div>
            </div>

            <div className="form-line">
              <div className="form-text">You can reach me at</div>
              <div className="form-input-wrapper">
                <input
                  type="email"
                  name="email"
                  placeholder="name@example.com"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="form-input"
                />
              </div>
              <div className="form-text">to start the conversation.</div>
              <div className="form-text">Optionally, I'm sharing more:</div>
              <div className="form-input-wrapper">
                <textarea
                  name="details"
                  placeholder="Product details type here..."
                  value={formData.details}
                  onChange={handleChange}
                  className="form-input"
                  rows={1}
                ></textarea>
              </div>
            </div>

            <div className="form-footer">
              <div className="privacy-policy">
                <label className="checkbox-container">
                  <input
                    type="checkbox"
                    name="privacyPolicy"
                    checked={formData.privacyPolicy}
                    onChange={handleChange}
                    required
                  />
                  <span className="checkmark"></span>
                  <span className="policy-text">
                    I agree with the {" "}
                    <a href="#" className="privacy-link">
                      Privacy Policy
                    </a>
                  </span>
                </label>
              </div>
              <div className="submit-wrapper">
                <button type="submit" className="submit-button" disabled={loading}>
                  {loading ? "Sending..." : "SEND INQUIRY"}
                </button>
              </div>
            </div>

            {message && <p style={{ marginTop: 20 }}>{message}</p>}
          </form>
        </div>
      </div>

      <style jsx>{`
        .contact-section {
          background-color: #f5f5f5;
          padding: 80px 0;
          width: 100%;
        }
        
        .container {
          width: 100%;
          max-width: 1350px;
          margin: 0 auto;
          padding: 0 20px;
        }
        
        .form-container {
          width: 100%;
        }
        
        .form-intro {
          font-size: 18px;
          color: #555;
          margin-bottom: 40px;
        }
        
        .conversation-form {
          width: 100%;
        }
        
        .form-line {
          display: flex;
          flex-direction: column;
          margin-bottom: 10px;
          width: 100%;
        }
        
        .form-text {
          font-size: 36px;
          font-weight: 500;
          color: #222;
          margin-bottom: 1px;
          line-height: 1;
        }
        
        .form-input-wrapper {
          width: 100%;
          margin-bottom: 1px;
        }
        
        .form-input {
          width: 100%;
          background-color: transparent;
          border: none;
          border-bottom: 1px solid #999;
          padding: 10px 0;
          font-size: 18px;
          color: #555;
          transition: border-color 0.3s;
        }
        
        .form-input:focus {
          outline: none;
          border-color: #222;
        }
        
        .form-input::placeholder {
          color: #999;
        }
        
        select.form-input {
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23999' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right center;
          padding-right: 30px;
        }
        
        textarea.form-input {
          resize: none;
        }
        
        .form-footer {
          display: flex;
          flex-direction: column;
          margin-top: 60px;
        }
        
        .privacy-policy {
          margin-bottom: 30px;
        }
        
        .checkbox-container {
          position: relative;
          padding-left: 35px;
          cursor: pointer;
          font-size: 16px;
          user-select: none;
          display: flex;
          align-items: center;
        }
        
        .checkbox-container input {
          position: absolute;
          opacity: 0;
          cursor: pointer;
          height: 0;
          width: 0;
        }
        
        .checkmark {
          position: absolute;
          top: 0;
          left: 0;
          height: 24px;
          width: 24px;
          border: 1px solid #999;
          background-color: transparent;
        }
        
        .checkbox-container:hover input ~ .checkmark {
          border-color: #222;
        }
        
        .checkbox-container input:checked ~ .checkmark {
          background-color: #222;
          border-color: #222;
        }
        
        .checkmark:after {
          content: "";
          position: absolute;
          display: none;
        }
        
        .checkbox-container input:checked ~ .checkmark:after {
          display: block;
        }
        
        .checkbox-container .checkmark:after {
          left: 9px;
          top: 5px;
          width: 5px;
          height: 10px;
          border: solid white;
          border-width: 0 2px 2px 0;
          transform: rotate(45deg);
        }
        
        .policy-text {
          font-size: 16px;
          color: #555;
        }
        
        .privacy-link {
          color: #222;
          text-decoration: underline;
        }
        
        .submit-button {
          background-color: #999;
          color: white;
          border: none;
          border-radius: 50px;
          padding: 15px 30px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: background-color 0.3s;
        }
        
        .submit-button:hover {
          background-color: #777;
        }
        
        /* Mobile styles */
        @media (max-width: 900px) {
          .form-text {
            font-size: 29px;
          }
          
          .form-line {
            margin-bottom: 20px;
          }
          
          .form-input-wrapper {
            margin-bottom: 15px;
          }
          
          .form-input-wrapper:last-child {
            margin-bottom: 0;
          }
        }
        
        /* Desktop styles */
        @media (min-width: 768px) {
          .form-line {
            flex-direction: row;
            flex-wrap: wrap;
            align-items: baseline;
          }
          
          .form-text {
            font-size: 30px;
            margin-right: 15px;
            margin-bottom: 0;
            white-space: nowrap;
          }
          
          .form-input-wrapper {
            flex: 1;
            min-width: 150px;
            margin-bottom: 0;
            margin-right: 15px;
          }
          
          .form-input-wrapper:last-child {
            margin-right: 0;
          }
          
          .form-footer {
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
          }
          
          .privacy-policy {
            margin-bottom: 0;
          }
        }
        
        /* Large desktop styles */
        @media (min-width: 1200px) {
          .form-text {
            font-size: 44px;
          }
          
          .form-input {
            font-size: 22px;
          }
        }
      `}</style>
    </section>
  )
}

export default Contact
