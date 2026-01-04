"use client"

import type React from "react"

import { useState } from "react"
import Navbar from "@/components/Navbar"
import { Upload, Send, AlertCircle, BarChart3 } from "lucide-react"

type CandidateResult = {
  candidate_name: string
  match_score: number
  matched_skills: string[]
  missing_skills: string[]
  verdict: "Selected" | "Review" | "Reject"
}

const DEMO_RESULTS: CandidateResult[] = [
  {
    candidate_name: "Alice Johnson",
    match_score: 86,
    matched_skills: ["Python", "Pandas", "SQL"],
    missing_skills: ["Deep Learning"],
    verdict: "Selected",
  },
  {
    candidate_name: "Bob Chen",
    match_score: 72,
    matched_skills: ["Python", "Excel"],
    missing_skills: ["Machine Learning", "SQL"],
    verdict: "Review",
  },
  {
    candidate_name: "Carol Martinez",
    match_score: 45,
    matched_skills: ["Excel", "Java"],
    missing_skills: ["Python", "Machine Learning", "NLP"],
    verdict: "Reject",
  },
]

export default function AnalysePage() {
  const [files, setFiles] = useState<File[]>([])
  const [jobDescription, setJobDescription] = useState("")
  const [results, setResults] = useState<CandidateResult[] | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files))
    }
  }

  const handleAnalyze = async () => {
    // Validation
    if (files.length === 0 || !jobDescription.trim()) {
      setError("Please upload at least one resume and enter a job description.")
      return
    }

    setLoading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append("job_description", jobDescription)
      files.forEach((file) => formData.append("resumes", file))

      const response = await fetch("http://localhost:8000/analyze", {
        method: "POST",
        body: formData,
      })

      if (response.ok) {
        const data = await response.json()
        setResults(data)
      } else {
        throw new Error("API request failed")
      }
    } catch (err) {
      console.error("Error calling API:", err)
      setError("Could not reach the analysis API. Showing demo results instead.")
      setResults(DEMO_RESULTS)
    } finally {
      setLoading(false)
    }
  }

  const getVerdictColor = (verdict: string) => {
    switch (verdict) {
      case "Selected":
        return "bg-green-100 text-green-800"
      case "Review":
        return "bg-yellow-100 text-yellow-800"
      case "Reject":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const stats = results
    ? {
        total: results.length,
        selected: results.filter((r) => r.verdict === "Selected").length,
        review: results.filter((r) => r.verdict === "Review").length,
        reject: results.filter((r) => r.verdict === "Reject").length,
      }
    : null

  return (
    <>
      <Navbar />
      <main className="bg-background min-h-screen py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-2">Screening Dashboard</h1>
            <p className="text-muted-foreground">Powered by Python + NLP + TF-IDF + Cosine Similarity</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Input Panel */}
            <div className="lg:col-span-1">
              <div className="bg-card border border-border rounded-xl p-6">
                <h2 className="text-xl font-semibold text-foreground mb-6">Upload Resumes & Job Description</h2>

                {/* File Input */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-foreground mb-3">Upload Resumes (PDF or TXT)</label>
                  <div className="border-2 border-dashed border-border rounded-lg p-6 cursor-pointer hover:border-primary/50 transition-colors">
                    <input
                      type="file"
                      multiple
                      accept=".pdf,.txt"
                      onChange={handleFileChange}
                      className="hidden"
                      id="file-input"
                    />
                    <label htmlFor="file-input" className="cursor-pointer flex flex-col items-center gap-2">
                      <Upload className="w-8 h-8 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Click to upload files</span>
                    </label>
                  </div>
                  {files.length > 0 && (
                    <div className="mt-4 space-y-2">
                      {files.map((file, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-sm text-foreground bg-muted p-2 rounded">
                          <span className="truncate">{file.name}</span>
                          <span className="text-xs text-muted-foreground ml-auto">
                            ({(file.size / 1024).toFixed(1)} KB)
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Job Description */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-foreground mb-3">Job Description</label>
                  <textarea
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    placeholder="Paste the job description here..."
                    className="w-full h-40 p-3 bg-background border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary resize-none"
                  />
                </div>

                {/* Error Message */}
                {error && (
                  <div className="mb-6 flex gap-3 bg-red-100 border border-red-300 rounded-lg p-4">
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-red-800">{error}</p>
                  </div>
                )}

                {/* Analyze Button */}
                <button
                  onClick={handleAnalyze}
                  disabled={loading || files.length === 0 || !jobDescription.trim()}
                  className="w-full bg-primary text-white py-3 rounded-lg hover:bg-primary/90 disabled:bg-muted disabled:text-muted-foreground transition-colors font-medium flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-current border-r-transparent rounded-full animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Send size={18} />
                      Analyze Candidates
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Results Panel */}
            <div className="lg:col-span-2">
              {!results ? (
                <div className="bg-card border border-dashed border-border rounded-xl p-12 text-center">
                  <BarChart3 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-lg text-muted-foreground">
                    No analysis yet. Upload resumes and click Analyze to see results.
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Summary Stats */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="bg-card border border-border rounded-lg p-4">
                      <p className="text-muted-foreground text-sm font-medium">Total Candidates</p>
                      <p className="text-3xl font-bold text-foreground">{stats?.total}</p>
                    </div>
                    <div className="bg-card border border-border rounded-lg p-4">
                      <p className="text-muted-foreground text-sm font-medium">Selected</p>
                      <p className="text-3xl font-bold text-green-600">{stats?.selected}</p>
                    </div>
                    <div className="bg-card border border-border rounded-lg p-4">
                      <p className="text-muted-foreground text-sm font-medium">Review</p>
                      <p className="text-3xl font-bold text-yellow-600">{stats?.review}</p>
                    </div>
                    <div className="bg-card border border-border rounded-lg p-4">
                      <p className="text-muted-foreground text-sm font-medium">Reject</p>
                      <p className="text-3xl font-bold text-red-600">{stats?.reject}</p>
                    </div>
                  </div>

                  {/* Results Table */}
                  <div className="bg-card border border-border rounded-xl overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-border bg-muted">
                            <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Candidate</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Match Score</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                              Matched Skills
                            </th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                              Missing Skills
                            </th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Verdict</th>
                          </tr>
                        </thead>
                        <tbody>
                          {results.map((result, idx) => (
                            <tr key={idx} className="border-b border-border hover:bg-muted/50 transition-colors">
                              <td className="px-6 py-4 text-foreground font-medium">{result.candidate_name}</td>
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                  <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                                    <div className="h-full bg-primary" style={{ width: `${result.match_score}%` }} />
                                  </div>
                                  <span className="text-foreground font-medium">{result.match_score}%</span>
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex flex-wrap gap-2">
                                  {result.matched_skills.map((skill, i) => (
                                    <span key={i} className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                                      {skill}
                                    </span>
                                  ))}
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex flex-wrap gap-2">
                                  {result.missing_skills.map((skill, i) => (
                                    <span key={i} className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded">
                                      {skill}
                                    </span>
                                  ))}
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <span
                                  className={`px-3 py-1 rounded-full text-xs font-medium ${getVerdictColor(
                                    result.verdict,
                                  )}`}
                                >
                                  {result.verdict}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
