import React, { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ArrowLeft, Send, CheckCircle2, User, Mail, Paperclip, MessageSquare, AlertCircle } from "lucide-react";
import ScrollReveal from "../components/ScrollReveal";
import { CAREER_JOBS } from "../data";

// Extract only the job title from a value like "Title — Department"
function extractPositionTitle(value: string): string {
  // Split on any dash variant: em-dash (—), en-dash (–), hyphen (-)
  const parts = value.split(/\s*[—–-]\s*/);
  return parts[0].trim();
}

export default function CareersApply() {
  const [searchParams] = useSearchParams();
  const positionQuery = searchParams.get("position");

  // State
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [position, setPosition] = useState("");
  const [resumeUrl, setResumeUrl] = useState("");
  const [introduction, setIntroduction] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Auto-fill position from URL query param (contains only the title)
  useEffect(() => {
    if (positionQuery) {
      // The URL param may already be a clean title; extract just in case
      setPosition(extractPositionTitle(decodeURIComponent(positionQuery)));
    } else if (CAREER_JOBS.length > 0) {
      setPosition(CAREER_JOBS[0].title);
    } else {
      setPosition("General Talent Pool");
    }
  }, [positionQuery]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!fullName.trim() || !email.trim() || !position.trim()) {
      setErrorMsg("Please fill in all required fields: Full Name, Email, and Position.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrorMsg("Please enter a valid email address.");
      return;
    }

    setSubmitting(true);

    // Always send only the clean title to the backend
    const cleanPosition = extractPositionTitle(position);

    fetch("http://localhost:8000/api/careers/apply/index.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        full_name: fullName.trim(),
        email: email.trim(),
        position: cleanPosition,
        resume_url: resumeUrl.trim(),
        cover_message: introduction.trim(),
      }),
    })
      .then(async (res) => {
        const data = await res.json();
        setSubmitting(false);
        if (data.success) {
          setSuccess(true);
        } else {
          setErrorMsg(data.message || "Failed to submit application. Please try again.");
        }
      })
      .catch((err) => {
        setSubmitting(false);
        console.error("Submission error:", err);
        setErrorMsg("Network error. Please check your connection and try again.");
      });
  };

  return (
    <div className="gotek-page bg-bg-dark pt-32 pb-24 px-6 md:px-12 font-sans overflow-x-hidden">
      <div className="max-w-3xl mx-auto w-full relative z-10">
        
        {/* Navigation back button */}
        <ScrollReveal id="apply-back-reveal">
          <Link
            to="/careers"
            className="group inline-flex items-center gap-2 text-xs font-sans font-semibold text-zinc-500 hover:text-accent transition-colors mb-8"
            data-cursor="pointer"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1.5 transition-transform" />
            Back to Careers
          </Link>
        </ScrollReveal>

        {success ? (
          /* Success Receipt state */
          <ScrollReveal id="apply-success-reveal">
            <div className="glass-container p-8 md:p-12 text-center flex flex-col items-center gap-6 shadow-2xl">
              <div className="w-16 h-16 rounded-full bg-accent/10 border border-accent flex items-center justify-center text-accent">
                <CheckCircle2 className="w-10 h-10 animate-bounce" />
              </div>
              <h2 className="font-display text-2xl md:text-3xl font-black text-zinc-900 tracking-tight leading-none">
                Application Received
              </h2>
              <p className="font-sans text-sm text-zinc-650 max-w-sm leading-relaxed">
                We have registered your application for{" "}
                <span className="text-accent font-bold">{extractPositionTitle(position)}</span>.
                Our recruitment team will review your credentials and contact you within 48 business hours if there is alignment.
              </p>
              
              <div className="p-5 bg-zinc-50 border border-zinc-200 font-sans text-xs text-left text-zinc-600 flex flex-col gap-2.5 w-full max-w-md">
                <span className="font-semibold text-zinc-800">Submitted Details:</span>
                <span>• Name: {fullName}</span>
                <span>• Position: {extractPositionTitle(position)}</span>
                <span>• Contact Email: {email}</span>
                <span>• Resume: {resumeUrl || "Not provided"}</span>
              </div>

              <p className="text-xs text-zinc-400">A confirmation email has been sent to <strong>{email}</strong>.</p>

              <Link
                to="/careers"
                className="mt-4 px-6 py-3.5 bg-accent text-white font-sans text-xs font-bold uppercase tracking-[1.5px] hover:bg-[#0019bf] transition-colors"
              >
                Return to Careers
              </Link>
            </div>
          </ScrollReveal>
        ) : (
          /* The Interactive Form container */
          <ScrollReveal id="apply-form-container-reveal">
            <div className="glass-container p-8 md:p-12 shadow-xl flex flex-col gap-8 text-left">
              <div className="flex flex-col gap-2">
                <span className="font-sans text-[80px] font-black text-accent/10 leading-none">AP-99</span>
                <h2 className="font-display text-2xl md:text-3xl font-extrabold text-zinc-900 tracking-tight leading-none mt-[-50px]">
                  Submit Job Application
                </h2>
                <p className="font-sans text-sm text-zinc-500 leading-relaxed font-light mt-1">
                  Fill out the fields below to submit your portfolio and cover letter detail to Gotek's talent team.
                </p>
              </div>

              {/* Error Banner */}
              {errorMsg && (
                <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded">
                  <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                
                {/* Row 1: Full Name and Email Address */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-sans">
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-semibold text-zinc-700 flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-accent" />
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Enter your full legal name"
                      className="w-full bg-zinc-50 border border-zinc-200 p-4 text-sm text-zinc-900 focus:outline-none focus:bg-white focus:border-accent transition-all rounded-none"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-semibold text-zinc-700 flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-accent" />
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email address"
                      className="w-full bg-zinc-50 border border-zinc-200 p-4 text-sm text-zinc-900 focus:outline-none focus:bg-white focus:border-accent transition-all rounded-none"
                    />
                  </div>
                </div>

                {/* Row 2: Position Dropdown - value is always ONLY the title */}
                <div className="flex flex-col gap-2 font-sans">
                  <label className="text-xs font-semibold text-zinc-700">
                    Position of Interest <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={position}
                    onChange={(e) => setPosition(e.target.value)}
                    className="w-full bg-zinc-50 border border-zinc-200 p-4 text-sm text-zinc-900 focus:outline-none focus:bg-white focus:border-accent transition-all rounded-none"
                  >
                    <option value="General Talent Pool">General Talent Pool</option>
                    {CAREER_JOBS.map((job) => (
                      // value = title only; display label = title — department
                      <option key={job.id} value={job.title}>
                        {job.title} — {job.department}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Row 3: Resume URL */}
                <div className="flex flex-col gap-2 font-sans">
                  <label className="text-xs font-semibold text-zinc-700 flex items-center gap-1.5">
                    <Paperclip className="w-3.5 h-3.5 text-accent" />
                    Resume URL / Portfolio Link
                  </label>
                  <input
                    type="url"
                    value={resumeUrl}
                    onChange={(e) => setResumeUrl(e.target.value)}
                    placeholder="https://drive.google.com/your-resume"
                    className="w-full bg-zinc-50 border border-zinc-200 p-4 text-sm text-zinc-900 focus:outline-none focus:bg-white focus:border-accent transition-all rounded-none"
                  />
                  <span className="text-[11px] text-zinc-400">
                    Host your PDF on Google Drive, Dropbox, or GitHub, and enter the link here.
                  </span>
                </div>

                {/* Row 4: Cover Message */}
                <div className="flex flex-col gap-2 font-sans">
                  <label className="text-xs font-semibold text-zinc-700 flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5 text-accent" />
                    Introduction & Cover Message
                  </label>
                  <textarea
                    rows={5}
                    value={introduction}
                    onChange={(e) => setIntroduction(e.target.value)}
                    placeholder="Briefly describe your experience, skills, and why you are interested in Gotek..."
                    className="w-full bg-zinc-50 border border-zinc-200 p-4 text-sm text-zinc-900 focus:outline-none focus:bg-white focus:border-accent resize-none transition-all rounded-none"
                  />
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-4 bg-accent hover:bg-[#0019bf] text-white font-sans text-xs font-bold tracking-[1.5px] uppercase transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 mt-4 rounded-none"
                  data-cursor="pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>{submitting ? "Submitting application..." : "Submit Application"}</span>
                </button>

              </form>
            </div>
          </ScrollReveal>
        )}

      </div>
    </div>
  );
}
