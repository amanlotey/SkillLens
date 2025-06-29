// /app/page.jsx
import SkillStackForm from '@/components/SkillStackForm'

export default function Home() {
  return (
    <main className="min-h-screen bg-[#171721] text-[#f8f8f8] px-4 py-10">
      <section className="max-w-6xl mx-auto bg-[#1e1e2a] border border-[#872B97] rounded-lg shadow-lg p-6">
        <SkillStackForm />
      </section>
    </main>
  )
}
