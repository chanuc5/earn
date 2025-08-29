"use client"

import AuthGate from "@/components/auth-gate"
import { useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts"

type Vacancy = { id: string; title: string; company: string; status: "pending" | "approved" | "rejected" }
type Company = { id: string; name: string; featured: boolean }
type Employee = { id: string; name: string; email: string }

const VAC_KEY = "meechto:vacancies"
const CO_KEY = "meechto:companies"
const EM_KEY = "meechto:employees"

function useSeededData() {
  const [vacancies, setVacancies] = useState<Vacancy[]>([])
  const [companies, setCompanies] = useState<Company[]>([])
  const [employees, setEmployees] = useState<Employee[]>([])

  useEffect(() => {
    const v = localStorage.getItem(VAC_KEY)
    const c = localStorage.getItem(CO_KEY)
    const e = localStorage.getItem(EM_KEY)
    if (v && c && e) {
      setVacancies(JSON.parse(v))
      setCompanies(JSON.parse(c))
      setEmployees(JSON.parse(e))
      return
    }
    const seedV: Vacancy[] = [
      { id: "v1", title: "Frontend Engineer", company: "BlueLabs", status: "pending" },
      { id: "v2", title: "Data Analyst", company: "Insight Co", status: "pending" },
      { id: "v3", title: "Prompt Engineer", company: "AIly", status: "approved" },
    ]
    const seedC: Company[] = [
      { id: "c1", name: "BlueLabs", featured: true },
      { id: "c2", name: "Insight Co", featured: false },
      { id: "c3", name: "AIly", featured: true },
    ]
    const seedE: Employee[] = [
      { id: "e1", name: "Alex Johnson", email: "alex@meechto.com" },
      { id: "e2", name: "Priya Singh", email: "priya@meechto.com" },
      { id: "e3", name: "Diego Ramos", email: "diego@meechto.com" },
    ]
    localStorage.setItem(VAC_KEY, JSON.stringify(seedV))
    localStorage.setItem(CO_KEY, JSON.stringify(seedC))
    localStorage.setItem(EM_KEY, JSON.stringify(seedE))
    setVacancies(seedV)
    setCompanies(seedC)
    setEmployees(seedE)
  }, [])

  function updateVacancies(next: Vacancy[]) {
    localStorage.setItem(VAC_KEY, JSON.stringify(next))
    setVacancies(next)
  }
  function updateCompanies(next: Company[]) {
    localStorage.setItem(CO_KEY, JSON.stringify(next))
    setCompanies(next)
  }
  function updateEmployees(next: Employee[]) {
    localStorage.setItem(EM_KEY, JSON.stringify(next))
    setEmployees(next)
  }

  return { vacancies, companies, employees, updateVacancies, updateCompanies, updateEmployees }
}

export default function HRDashboard() {
  const { vacancies, companies, employees, updateVacancies, updateCompanies, updateEmployees } = useSeededData()

  const [newVacancy, setNewVacancy] = useState({ title: "", company: "" })
  const statsData = useMemo(
    () => [
      { name: "Mon", posts: 3, views: 120 },
      { name: "Tue", posts: 4, views: 150 },
      { name: "Wed", posts: 2, views: 90 },
      { name: "Thu", posts: 6, views: 220 },
      { name: "Fri", posts: 5, views: 180 },
      { name: "Sat", posts: 1, views: 60 },
      { name: "Sun", posts: 2, views: 100 },
    ],
    [],
  )

  function addVacancy() {
    if (!newVacancy.title || !newVacancy.company) return
    const v: Vacancy = {
      id: `v${Date.now()}`,
      title: newVacancy.title,
      company: newVacancy.company,
      status: "pending",
    }
    updateVacancies([v, ...vacancies])
    setNewVacancy({ title: "", company: "" })
  }

  function setVacancyStatus(id: string, status: Vacancy["status"]) {
    updateVacancies(vacancies.map((v) => (v.id === id ? { ...v, status } : v)))
  }

  function toggleFeaturedCompany(id: string) {
    updateCompanies(companies.map((c) => (c.id === id ? { ...c, featured: !c.featured } : c)))
  }

  function addEmployee(name: string, email: string) {
    if (!name || !email) return
    updateEmployees([{ id: `e${Date.now()}`, name, email }, ...employees])
  }

  return (
    <AuthGate requireRole="hr">
      <section className="space-y-8">
        <header className="flex flex-col gap-1">
          <h1 className="text-pretty text-3xl font-semibold">HR Dashboard</h1>
          <p className="text-sm text-muted-foreground">Manage users, vacancies, stats, and featured companies.</p>
        </header>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Post a Vacancy</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={newVacancy.title}
                    onChange={(e) => setNewVacancy((s) => ({ ...s, title: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="company">Company</Label>
                  <Input
                    id="company"
                    value={newVacancy.company}
                    onChange={(e) => setNewVacancy((s) => ({ ...s, company: e.target.value }))}
                  />
                </div>
              </div>
              <Button className="bg-blue-600 text-white hover:bg-blue-700" onClick={addVacancy}>
                Create
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Activity & Stats</CardTitle>
            </CardHeader>
            <CardContent style={{ height: 260 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={statsData}>
                  <defs>
                    <linearGradient id="colorPosts" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563eb" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0.1} />
                    </linearGradient>
                    <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.1} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="posts" stroke="#2563eb" fill="url(#colorPosts)" />
                  <Area type="monotone" dataKey="views" stroke="#06b6d4" fill="url(#colorViews)" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Approve / Reject Vacancies</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {vacancies.length === 0 && <p className="text-sm text-muted-foreground">No vacancies yet.</p>}
              {vacancies.map((v) => (
                <div key={v.id} className="flex items-center justify-between rounded-md border p-3">
                  <div>
                    <p className="font-medium">{v.title}</p>
                    <p className="text-xs text-muted-foreground">{v.company}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className="rounded-full px-2 py-1 text-xs"
                      style={{
                        backgroundColor:
                          v.status === "approved" ? "#dcfce7" : v.status === "rejected" ? "#fee2e2" : "#f3f4f6",
                        color: v.status === "approved" ? "#166534" : v.status === "rejected" ? "#991b1b" : "#0f172a",
                      }}
                    >
                      {v.status}
                    </span>
                    <Button
                      className="bg-blue-600 text-white hover:bg-blue-700"
                      onClick={() => setVacancyStatus(v.id, "approved")}
                    >
                      Approve
                    </Button>
                    <Button variant="outline" onClick={() => setVacancyStatus(v.id, "rejected")}>
                      Reject
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Manage Users (Employees / Companies)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-md border p-3">
                <p className="text-sm font-medium">Employees</p>
                <ul className="mt-2 space-y-2">
                  {employees.map((e) => (
                    <li key={e.id} className="flex items-center justify-between rounded-md bg-gray-50 p-2">
                      <span className="text-sm">
                        {e.name} • {e.email}
                      </span>
                      <Button variant="outline">Message</Button>
                    </li>
                  ))}
                </ul>
                <div className="mt-3 grid grid-cols-3 gap-2">
                  <Input placeholder="Full name" id="emp-name" />
                  <Input placeholder="Email" id="emp-email" />
                  <Button
                    className="bg-slate-900 text-white hover:bg-slate-800"
                    onClick={() => {
                      const name = (document.getElementById("emp-name") as HTMLInputElement)?.value
                      const email = (document.getElementById("emp-email") as HTMLInputElement)?.value
                      addEmployee(name, email)
                    }}
                  >
                    Add
                  </Button>
                </div>
              </div>

              <div className="rounded-md border p-3">
                <p className="text-sm font-medium">Top Companies</p>
                <ul className="mt-2 space-y-2">
                  {companies.map((c) => (
                    <li key={c.id} className="flex items-center justify-between rounded-md bg-gray-50 p-2">
                      <span className="text-sm">{c.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">{c.featured ? "Featured" : "Standard"}</span>
                        <Button
                          className="bg-cyan-500 text-white hover:bg-cyan-600"
                          onClick={() => toggleFeaturedCompany(c.id)}
                        >
                          {c.featured ? "Unfeature" : "Feature"}
                        </Button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </AuthGate>
  )
}
