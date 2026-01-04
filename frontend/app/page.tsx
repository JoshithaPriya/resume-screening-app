import Navbar from "@/components/Navbar"
import HomePage from "@/app/home/page"

export const metadata = {
  title: "AI Resume Screening & Candidate Ranking using NLP",
  description: "A data science project that uses NLP, TF-IDF and cosine similarity to automatically rank candidates.",
}

export default function Page() {
  return (
    <>
      <Navbar />
      <HomePage />
    </>
  )
}
