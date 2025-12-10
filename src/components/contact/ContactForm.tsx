"use client";

import { useState, useRef, useEffect } from "react";
import { apiPost, API_ENDPOINTS } from "@/config/api";
import { event } from "@/lib/gtag";

const Calendar = ({ selectedDate, onDateSelect, onClose }: { selectedDate: string, onDateSelect: (date: string) => void, onClose: () => void }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];
  
  const dayNames = ["SU", "MO", "TU", "WE", "TH", "FR", "SA"];
  
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    const days = [];
    
    // Previous month's trailing days
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const prevDate = new Date(year, month, -i);
      days.push({ date: prevDate.getDate(), isCurrentMonth: false, fullDate: prevDate });
    }
    
    // Current month's days
    for (let day = 1; day <= daysInMonth; day++) {
      const fullDate = new Date(year, month, day);
      days.push({ date: day, isCurrentMonth: true, fullDate });
    }
    
    // Next month's leading days
    const remainingDays = 42 - days.length;
    for (let day = 1; day <= remainingDays; day++) {
      const nextDate = new Date(year, month + 1, day);
      days.push({ date: day, isCurrentMonth: false, fullDate: nextDate });
    }
    
    return days;
  };
  
  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };
  
  const days = getDaysInMonth(currentMonth);
  
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-4 w-80">
      <div className="flex justify-between items-center mb-4">
        <button 
          onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
          className="p-1 hover:bg-gray-100 rounded"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>
        <h3 className="text-lg font-normal text-gray-800">
          {monthNames[currentMonth.getMonth()]}, {currentMonth.getFullYear()}
        </h3>
        <button 
          onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
          className="p-1 hover:bg-gray-100 rounded"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>
      </div>
      
      <div className="grid grid-cols-7 gap-0 mb-3">
        {dayNames.map(day => (
          <div key={day} className="text-center text-xs font-semibold text-orange-400 py-2">
            {day}
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-7 gap-0">
        {days.map((day, index) => {
          const dateStr = formatDate(day.fullDate);
          const isSelected = dateStr === selectedDate;
          const isToday = dateStr === formatDate(new Date());
          
          return (
            <button
              key={index}
              onClick={() => {
                onDateSelect(dateStr);
                onClose();
              }}
              className={`
                w-8 h-8 text-sm flex items-center justify-center rounded hover:bg-gray-50 transition-colors
                ${!day.isCurrentMonth ? 'text-gray-300' : 'text-gray-800'}
                ${isSelected ? 'bg-blue-400 text-white hover:bg-blue-500' : ''}
                ${isToday && !isSelected ? 'text-blue-400 font-semibold' : ''}
              `}
            >
              {day.date}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export const ContactForm = () => {
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
  const [budgetOpen, setBudgetOpen] = useState(false);
  const [dateOpen, setDateOpen] = useState(false);
  const budgetRef = useRef<HTMLDivElement>(null);
  const dateRef = useRef<HTMLDivElement>(null);

  const budgetOptions = [
    { value: "4l-8l", label: "₹4,00,000 - ₹8,00,000" },
    { value: "8l-20l", label: "₹8,00,000 - ₹20,00,000" },
    { value: "20l-40l", label: "₹20,00,000 - ₹40,00,000" },
    { value: "40l+", label: "₹40,00,000+" }
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (budgetRef.current && !budgetRef.current.contains(event.target as Node)) {
        setBudgetOpen(false);
      }
      if (dateRef.current && !dateRef.current.contains(event.target as Node)) {
        setDateOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.privacyPolicy) {
      setMessage("Please accept the privacy policy.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const result = await apiPost(API_ENDPOINTS.contact.submissions, formData);
      
      // Track successful form submission
      event({
        action: 'form_submit',
        category: 'engagement',
        label: 'contact_form',
        value: 1,
      });
      
      setMessage("✅ Inquiry submitted successfully! We'll get back to you soon.");
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
    } catch (error) {
      console.error(error);
      setMessage("❌ Error connecting to server. Please make sure the backend is running.");
    }

    setLoading(false);
  };

  const inputClassName = "w-full border-0 border-b-2 border-zinc-700/50 bg-transparent px-0 py-3 text-xl text-white placeholder-zinc-600 transition-all duration-300 focus:border-cyan-400 focus:outline-none focus:bg-cyan-500/5 focus:shadow-lg focus:shadow-cyan-500/20 hover:border-zinc-600 md:text-xl lg:text-xl [&:-webkit-autofill]:bg-zinc-800 [&:-webkit-autofill]:text-zinc-100 [&:-webkit-autofill]:shadow-[0_0_0_30px_rgb(39,39,42)_inset]";

  return (
    <section className="bg-transparent pt-48 py-4 font-sans font-light relative">
      {/* Decorative elements */}
      <div className="absolute top-20 left-0 w-1 h-32 bg-gradient-to-b from-cyan-500/50 to-transparent" />
      <div className="absolute top-40 right-0 w-1 h-32 bg-gradient-to-b from-blue-500/50 to-transparent" />
      
      <div className="w-full px-2 md:px-12">
        <div className="w-full">
          <div className="mb-8 flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <p className="text-lg text-cyan-400 uppercase tracking-wider font-semibold">Let's Connect</p>
          </div>

          <form onSubmit={handleSubmit} className="w-full">
            <div className="mb-2 flex flex-col md:mb-2 md:flex-row md:flex-wrap md:items-baseline group">
              <div className="mb-0 mr-4 text-3xl font-medium text-white md:mb-0 md:text-4xl lg:text-5xl group-hover:text-cyan-400 transition-colors duration-300">Hi! My name is</div>
              <div className="mb-1 mr-4 flex-1 md:mb-0 md:min-w-[150px]">
                <input
                  type="text"
                  name="name"
                  placeholder="Enter your name*"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className={inputClassName}
                />
              </div>
              <div className="mb-0 mr-4 text-3xl font-medium text-white md:mb-0 md:text-4xl lg:text-5xl group-hover:text-cyan-400 transition-colors duration-300">and I work with</div>
              <div className="mb-0 mr-0 flex-1 md:min-w-[150px]">
                <input
                  type="text"
                  name="company"
                  placeholder="Company name type here*"
                  required
                  value={formData.company}
                  onChange={handleChange}
                  className={inputClassName}
                />
              </div>
            </div>

            <div className="mb-2 flex flex-col md:mb-2 md:flex-row md:flex-wrap md:items-baseline group">
              <div className="mb-0 mr-4 text-3xl font-medium text-white md:mb-0 md:text-4xl lg:text-5xl group-hover:text-cyan-400 transition-colors duration-300">I'm looking for a partner to help me with</div>
              <div className="mb-0 mr-0 flex-1 md:min-w-[150px]">
                <input
                  type="text"
                  name="goal"
                  placeholder="Your goal type here*"
                  required
                  value={formData.goal}
                  onChange={handleChange}
                  className={inputClassName}
                />
              </div>
            </div>

            <div className="mb-2 flex flex-col md:mb-2 md:flex-row md:flex-wrap md:items-baseline group">
              <div className="mb-0 mr-4 text-3xl font-medium text-white md:mb-0 md:text-4xl lg:text-5xl group-hover:text-cyan-400 transition-colors duration-300">With an idea of having that completed</div>
              <div className="mb-0 mr-0 flex-1 md:min-w-[150px]">
                <input
                  type="date"
                  name="date"
                  required
                  value={formData.date}
                  onChange={handleChange}
                  className="w-full border-0 border-b-2 border-zinc-700/50 bg-transparent px-0 py-3 text-lg text-white transition-all duration-300 focus:border-cyan-400 focus:outline-none focus:bg-cyan-500/5 focus:shadow-lg focus:shadow-cyan-500/20 hover:border-zinc-600 [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert [&::-webkit-calendar-picker-indicator]:opacity-70 [&::-webkit-calendar-picker-indicator]:hover:opacity-100 [&::-webkit-calendar-picker-indicator]:cursor-pointer cursor-pointer"
                />
              </div>
            </div>

            <div className="mb-2 flex flex-col md:mb-2 md:flex-row md:flex-wrap md:items-baseline group">
              <div className="mb-0 mr-4 text-3xl font-medium text-white md:mb-0 md:text-4xl lg:text-5xl group-hover:text-cyan-400 transition-colors duration-300">I am hoping to stay around a budget range of</div>
              <div className="mb-0 mr-0 flex-1 md:min-w-[150px]">
                <div className="relative" ref={budgetRef}>
                  <div
                    onClick={() => setBudgetOpen(!budgetOpen)}
                    className="w-full border-0 border-b-2 border-zinc-700/50 bg-transparent px-0 py-3 pr-8 text-lg text-white transition-all duration-300 hover:border-zinc-600 focus:border-cyan-400 cursor-pointer flex justify-between items-center"
                  >
                    <span className={formData.budget ? "text-white" : "text-zinc-600"}>
                      {formData.budget ? budgetOptions.find(opt => opt.value === formData.budget)?.label : "Select*"}
                    </span>
                    <svg className={`w-5 h-5 transition-all duration-300 ${budgetOpen ? 'rotate-180 text-cyan-400' : 'text-zinc-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  </div>
                  {budgetOpen && (
                    <div className="absolute top-full left-0 w-64 bg-[#1e1f26] border border-cyan-500/30 rounded-xl mt-2 z-10 shadow-2xl shadow-cyan-500/20 overflow-hidden">
                      {budgetOptions.map((option) => (
                        <div
                          key={option.value}
                          onClick={() => {
                            setFormData(prev => ({ ...prev, budget: option.value }));
                            setBudgetOpen(false);
                          }}
                          className="px-4 py-3 text-base text-gray-300 hover:bg-cyan-500/10 hover:text-cyan-400 cursor-pointer transition-all border-b border-zinc-700/30 last:border-0"
                        >
                          {option.label}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="mb-2 flex flex-col md:mb-2 md:flex-row md:flex-wrap md:items-baseline group">
              <div className="mb-0 mr-4 text-3xl font-medium text-white md:mb-0 md:text-4xl lg:text-5xl group-hover:text-cyan-400 transition-colors duration-300">You can reach me at</div>
              <div className="mb-1 mr-4 flex-1 md:mb-0 md:min-w-[150px]">
                <input
                  type="email"
                  name="email"
                  placeholder="name@example.com"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className={inputClassName}
                />
              </div>
              <div className="mb-0 mr-4 text-3xl font-medium text-white md:mb-0 md:text-4xl lg:text-5xl group-hover:text-cyan-400 transition-colors duration-300">to start the conversation.</div>
              <div className="mb-0 mr-4 text-3xl font-medium text-white md:mb-0 md:text-4xl lg:text-5xl group-hover:text-cyan-400 transition-colors duration-300">Optionally, I'm sharing more:</div>
              <div className="mb-0 mr-0 flex-1 md:min-w-[150px]">
                <textarea
                  name="details"
                  placeholder="Product details type here..."
                  value={formData.details}
                  onChange={handleChange}
                  rows={1}
                  className="w-full resize-none border-0 border-b-2 border-zinc-700/50 bg-transparent px-0 py-3 text-xl text-white placeholder-zinc-600 transition-all duration-300 focus:border-cyan-400 focus:outline-none focus:bg-cyan-500/5 focus:shadow-lg focus:shadow-cyan-500/20 hover:border-zinc-600 md:text-xl lg:text-xl"
                />
              </div>
            </div>

            <div className="mt-12 flex flex-col md:flex-row md:items-center md:justify-between p-6 bg-zinc-900/30 rounded-xl border border-zinc-800/50 backdrop-blur-sm">
              <div className="mb-4 md:mb-0">
                <label className="relative flex cursor-pointer select-none items-center pl-9 text-base text-gray-300 group">
                  <input
                    type="checkbox"
                    name="privacyPolicy"
                    checked={formData.privacyPolicy}
                    onChange={handleChange}
                    required
                    className="absolute h-0 w-0 cursor-pointer opacity-0"
                  />
                  <span className="absolute left-0 top-0 h-6 w-6 border-2 border-zinc-700 bg-transparent rounded transition-all group-hover:border-cyan-400"></span>
                  <span className="absolute left-0 top-0 hidden h-6 w-6 border-2 border-cyan-500 bg-gradient-to-br from-cyan-500 to-blue-600 rounded after:absolute after:left-[7px] after:top-[3px] after:h-[10px] after:w-[5px] after:rotate-45 after:border-r-2 after:border-b-2 after:border-white after:content-['']"></span>
                  <span className="text-gray-300 group-hover:text-white transition-colors">
                    I agree with the{" "}
                    <a href="#" className="text-cyan-400 underline hover:text-cyan-300 font-semibold">
                      Privacy Policy
                    </a>
                  </span>
                </label>
              </div>
              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="relative overflow-hidden rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-8 py-4 text-base font-bold text-white transition-all hover:from-cyan-600 hover:to-blue-700 hover:shadow-lg hover:shadow-cyan-500/50 disabled:opacity-50 disabled:cursor-not-allowed group"
                >
                  <span className="relative z-10 uppercase tracking-wider flex items-center gap-2">
                    {loading ? (
                      <>
                        <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Sending...
                      </>
                    ) : (
                      <>
                        Send Inquiry
                        <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </>
                    )}
                  </span>
                  <div className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
                </button>
              </div>
            </div>

            {message && (
              <div className={`mt-6 p-4 rounded-xl border ${
                message.includes('✅') 
                  ? 'bg-green-500/10 border-green-500/30 text-green-400' 
                  : 'bg-red-500/10 border-red-500/30 text-red-400'
              } flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-500`}>
                {message.includes('✅') ? (
                  <svg className="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
                <p className="font-medium">{message}</p>
              </div>
            )}
          </form>
        </div>
      </div>

      <style jsx>{`
        label input:checked ~ span:first-of-type {
          display: none;
        }
        label input:checked ~ span:last-of-type {
          display: block;
        }
      `}</style>
    </section>
  );
};