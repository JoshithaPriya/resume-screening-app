"use client"

import Link from "next/link"
import { ArrowRight, Upload, Zap, TrendingUp, CheckCircle } from "lucide-react"

export default function HomePage() {
  return (
    <main className="bg-background">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
              AI Resume Screening & Candidate Ranking using NLP
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              A data science project that uses NLP, TF-IDF and cosine similarity to automatically rank candidates.
            </p>
            <div className="flex gap-4">
              <Link
                href="/analyse"
                className="bg-primary text-white px-8 py-3 rounded-lg hover:bg-primary/90 transition-colors font-medium flex items-center gap-2 w-fit"
              >
                Start Analysis
                <ArrowRight size={20} />
              </Link>
              <button
                onClick={() => document.getElementById("project-details")?.scrollIntoView({ behavior: "smooth" })}
                className="border-2 border-border text-foreground px-8 py-3 rounded-lg hover:bg-muted transition-colors font-medium"
              >
                View Project Details
              </button>
            </div>
          </div>

          {/* Results Card Preview */}
          <div className="bg-card border border-border rounded-xl p-6 shadow-lg">
            <h3 className="text-lg font-semibold text-foreground mb-4">Sample Results</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 px-2 text-muted-foreground font-medium">Candidate</th>
                    <th className="text-left py-2 px-2 text-muted-foreground font-medium">Match</th>
                    <th className="text-left py-2 px-2 text-muted-foreground font-medium">Verdict</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-border hover:bg-muted/50">
                    <td className="py-3 px-2 text-foreground">Alice Johnson</td>
                    <td className="py-3 px-2 text-foreground">86%</td>
                    <td className="py-3 px-2">
                      <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium">
                        Selected
                      </span>
                    </td>
                  </tr>
                  <tr className="border-b border-border hover:bg-muted/50">
                    <td className="py-3 px-2 text-foreground">Bob Chen</td>
                    <td className="py-3 px-2 text-foreground">72%</td>
                    <td className="py-3 px-2">
                      <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-medium">
                        Review
                      </span>
                    </td>
                  </tr>
                  <tr className="hover:bg-muted/50">
                    <td className="py-3 px-2 text-foreground">Carol Martinez</td>
                    <td className="py-3 px-2 text-foreground">45%</td>
                    <td className="py-3 px-2">
                      <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-xs font-medium">Reject</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="bg-muted py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-foreground mb-12 text-center">How the AI Screening Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                step: 1,
                title: "Upload Resumes",
                description: "Submit multiple resumes in PDF or TXT format",
                icon: <Upload className="w-6 h-6" />,
              },
              {
                step: 2,
                title: "NLP & Feature Extraction",
                description: "TF-IDF vectorization and skill extraction from documents",
                icon: <Zap className="w-6 h-6" />,
              },
              {
                step: 3,
                title: "Similarity Scoring",
                description: "Cosine similarity between resumes and job description",
                icon: <TrendingUp className="w-6 h-6" />,
              },
              {
                step: 4,
                title: "Ranking & Verdict",
                description: "Automatic classification: Selected, Review, or Reject",
                icon: <CheckCircle className="w-6 h-6" />,
              },
            ].map((item) => (
              <div key={item.step} className="bg-card border border-border rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/20 text-primary flex items-center justify-center font-bold">
                    {item.step}
                  </div>
                  <div className="text-primary">{item.icon}</div>
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Project Details Section */}
      <section id="project-details" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-4xl font-bold text-foreground mb-12 text-center">Data Science & NLP at the Core</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Column - Tech Stack */}
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold text-foreground mb-8">Technology Stack</h3>
            {[
              "Python, Pandas, Scikit-learn, NLTK",
              "TF-IDF vectorization for resume and job description",
              "Cosine similarity for match score calculation",
              "Classification into Selected / Review / Reject categories",
              "REST API backend with FastAPI",
              "Real-time processing with streaming support",
            ].map((item, idx) => (
              <div key={idx} className="flex gap-4">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                </div>
                <p className="text-foreground text-lg">{item}</p>
              </div>
            ))}
          </div>

          {/* Right Column - Project Info */}
          <div className="bg-card border border-border rounded-xl p-8">
            <h3 className="text-2xl font-semibold text-foreground mb-4">Academic Project</h3>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              This is a comprehensive Data Science and Natural Language Processing project that demonstrates practical
              applications of machine learning algorithms in recruitment and talent screening.
            </p>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">Machine Learning</p>
                  <p className="text-sm text-muted-foreground">Supervised and unsupervised techniques</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">NLP Processing</p>
                  <p className="text-sm text-muted-foreground">Text analysis and feature extraction</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">Real-world Application</p>
                  <p className="text-sm text-muted-foreground">Practical HR automation solution</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Get Started CTA Section */}
      <section className="bg-muted py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-foreground mb-4">Ready to try the Resume Ranker?</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Upload resumes and paste a job description on the Screening Dashboard to get started.
          </p>
          <Link
            href="/analyse"
            className="bg-primary text-white px-8 py-3 rounded-lg hover:bg-primary/90 transition-colors font-medium inline-flex items-center gap-2"
          >
            Go to Screening Dashboard
            <ArrowRight size={20} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background border-t border-border py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-muted-foreground">AI Resume Screening & Candidate Ranking — Data Science Project</p>
        </div>
      </footer>
    </main>
  )
}
