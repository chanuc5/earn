;(() => {
  const KEYS = {
    AUTH: "MEECHTO_AUTH",
    USERS: "MEECHTO_USERS",
    VACANCIES: "MEECHTO_VACANCIES",
    COMPANIES: "MEECHTO_COMPANIES",
    SEEDED: "MEECHTO_SEEDED",
  }

  const PAGES = {
    LOGIN: "login.html",
    REGISTER: "register.html",
    SEEKER: "index.html",
    HR: "hr.html",
  }

  // Seed once
  function seed() {
    if (localStorage.getItem(KEYS.SEEDED)) return
    const users = [
      { id: "u-seeker-1", name: "Ava Patel", email: "ava@meechto.dev", password: "meechto", role: "seeker" },
      { id: "u-hr-1", name: "HR Admin", email: "hr@meechto.dev", password: "meechto", role: "hr" },
    ]
    const vacancies = [
      {
        id: "v-1",
        title: "Frontend Engineer",
        company: "Skyline Labs",
        status: "pending",
        featured: true,
        applicants: 34,
      },
      {
        id: "v-2",
        title: "Backend Engineer",
        company: "Neptune Cloud",
        status: "approved",
        featured: false,
        applicants: 21,
      },
      { id: "v-3", title: "Data Analyst", company: "Acme Corp", status: "rejected", featured: false, applicants: 8 },
    ]
    const companies = [
      { id: "c-1", name: "Skyline Labs", featured: true },
      { id: "c-2", name: "Neptune Cloud", featured: false },
      { id: "c-3", name: "Acme Corp", featured: true },
    ]
    localStorage.setItem(KEYS.USERS, JSON.stringify(users))
    localStorage.setItem(KEYS.VACANCIES, JSON.stringify(vacancies))
    localStorage.setItem(KEYS.COMPANIES, JSON.stringify(companies))
    localStorage.setItem(KEYS.SEEDED, "1")
  }

  function getJSON(key, fallback) {
    try {
      return JSON.parse(localStorage.getItem(key)) ?? fallback
    } catch {
      return fallback
    }
  }
  function setJSON(key, value) {
    localStorage.setItem(key, JSON.stringify(value))
  }

  function getAuth() {
    return getJSON(KEYS.AUTH, null)
  }
  function setAuth(user) {
    setJSON(KEYS.AUTH, user)
  }
  function logout() {
    localStorage.removeItem(KEYS.AUTH)
    safeGo(PAGES.LOGIN)
  }

  function safeGo(path) {
    if (location.pathname.endsWith(path)) return // prevent loops
    location.href = path
  }

  function requireAuth(pageKind) {
    // pageKind: 'login' | 'register' | 'seeker' | 'hr'
    const auth = getAuth()
    if ((pageKind === "login" || pageKind === "register") && auth) {
      return safeGo(auth.role === "hr" ? PAGES.HR : PAGES.SEEKER)
    }
    if ((pageKind === "seeker" || pageKind === "hr") && !auth) {
      return safeGo(PAGES.LOGIN)
    }
    if (pageKind === "hr" && auth && auth.role !== "hr") {
      return safeGo(PAGES.SEEKER)
    }
    if (pageKind === "seeker" && auth && auth.role === "hr") {
      return safeGo(PAGES.HR)
    }
  }

  function qs(sel, root = document) {
    return root.querySelector(sel)
  }
  function qsa(sel, root = document) {
    return Array.from(root.querySelectorAll(sel))
  }

  function initNavbar() {
    const toggle = qs("#menuToggle")
    const nav = qs("#mainNav")
    if (toggle && nav) {
      toggle.addEventListener("click", () => {
        const open = nav.classList.toggle("open")
        toggle.setAttribute("aria-expanded", open ? "true" : "false")
      })
    }
  }

  // LOGIN
  function initLogin() {
    requireAuth("login")
    initNavbar()
    const form = qs("#loginForm")
    const err = qs("#loginError")
    if (!form) return
    form.addEventListener("submit", (e) => {
      e.preventDefault()
      err.textContent = ""
      const data = new FormData(form)
      const email = (data.get("email") || "").toString().trim().toLowerCase()
      const password = (data.get("password") || "").toString()
      const users = getJSON(KEYS.USERS, [])
      const user = users.find((u) => u.email.toLowerCase() === email && u.password === password)
      if (!user) {
        err.textContent = "Invalid credentials. Try hr@meechto.dev or ava@meechto.dev (password: meechto)."
        return
      }
      setAuth({ id: user.id, name: user.name, email: user.email, role: user.role })
      safeGo(user.role === "hr" ? PAGES.HR : PAGES.SEEKER)
    })
  }

  // REGISTER
  function initRegister() {
    requireAuth("register")
    initNavbar()
    const form = qs("#registerForm")
    const err = qs("#registerError")
    if (!form) return
    form.addEventListener("submit", (e) => {
      e.preventDefault()
      err.textContent = ""
      const data = new FormData(form)
      const name = (data.get("name") || "").toString().trim()
      const email = (data.get("email") || "").toString().trim().toLowerCase()
      const password = (data.get("password") || "").toString()
      const role = (data.get("role") || "seeker").toString()
      if (!name || !email || !password) {
        err.textContent = "Please fill all fields."
        return
      }
      const users = getJSON(KEYS.USERS, [])
      if (users.some((u) => u.email === email)) {
        err.textContent = "Email already registered. Please login."
        return
      }
      const newUser = { id: "u-" + Math.random().toString(36).slice(2, 8), name, email, password, role }
      users.push(newUser)
      setJSON(KEYS.USERS, users)
      setAuth({ id: newUser.id, name, email, role })
      safeGo(role === "hr" ? PAGES.HR : PAGES.SEEKER)
    })
  }

  // SEEKER DASHBOARD (index.html has its own UI; we only provide helper functions if needed later)

  // HR DASHBOARD
  function initHR() {
    requireAuth("hr")
    initNavbar()

    const usersTable = qs("#usersTable")
    const vacanciesList = qs("#vacanciesList")
    const newVacancyForm = qs("#newVacancyForm")
    const employeesTab = qs('[data-users-tab="employees"]')
    const companiesTab = qs('[data-users-tab="companies"]')
    let currentTab = "employees"

    if (employeesTab && companiesTab) {
      employeesTab.addEventListener("click", () => {
        currentTab = "employees"
        setActiveTab()
        renderUsers()
      })
      companiesTab.addEventListener("click", () => {
        currentTab = "companies"
        setActiveTab()
        renderUsers()
      })
    }
    function setActiveTab() {
      ;[employeesTab, companiesTab].forEach((b) => b && b.classList.remove("active"))
      ;(currentTab === "employees" ? employeesTab : companiesTab).classList.add("active")
    }

    function renderUsers() {
      const users = getJSON(KEYS.USERS, [])
      const companies = getJSON(KEYS.COMPANIES, [])
      if (currentTab === "employees") {
        const rows = users
          .filter((u) => u.role === "seeker")
          .map((u) => `<tr><td>${escapeHtml(u.name)}</td><td>${escapeHtml(u.email)}</td><td>Employee</td></tr>`)
          .join("")
        usersTable.innerHTML = `<div class="table"><table><thead><tr><th>Name</th><th>Email</th><th>Type</th></tr></thead><tbody>${rows || '<tr><td colspan="3" class="muted">No employees.</td></tr>'}</tbody></table></div>`
      } else {
        const rows = companies
          .map(
            (c) =>
              `<tr><td>${escapeHtml(c.name)}</td><td>${c.featured ? "Featured" : "-"}</td><td><button data-company="${c.id}" class="btn small">Toggle Featured</button></td></tr>`,
          )
          .join("")
        usersTable.innerHTML = `<div class="table"><table><thead><tr><th>Company</th><th>Status</th><th>Action</th></tr></thead><tbody>${rows || '<tr><td colspan="3" class="muted">No companies.</td></tr>'}</tbody></table></div>`
        qsa("[data-company]").forEach((btn) => {
          btn.addEventListener("click", () => {
            const id = btn.getAttribute("data-company")
            const companies = getJSON(KEYS.COMPANIES, [])
            const idx = companies.findIndex((c) => c.id === id)
            if (idx >= 0) {
              companies[idx].featured = !companies[idx].featured
              setJSON(KEYS.COMPANIES, companies)
              renderUsers()
              renderFeatured()
            }
          })
        })
      }
    }

    function renderVacancies() {
      const vacancies = getJSON(KEYS.VACANCIES, [])
      vacanciesList.innerHTML = vacancies
        .map((v) => {
          return `<li>
          <div>
            <strong>${escapeHtml(v.title)}</strong> at ${escapeHtml(v.company)}
            <div class="muted sm">Status: ${v.status}${v.featured ? " • Featured" : ""}</div>
          </div>
          <div class="actions">
            <button class="btn small" data-v-feature="${v.id}">Feature</button>
            <button class="btn small" data-v-approve="${v.id}">Approve</button>
            <button class="btn small" data-v-reject="${v.id}">Reject</button>
          </div>
        </li>`
        })
        .join("")
      qsa("[data-v-feature]").forEach((b) =>
        b.addEventListener("click", () => setVacancyFeature(b.getAttribute("data-v-feature"))),
      )
      qsa("[data-v-approve]").forEach((b) =>
        b.addEventListener("click", () => setVacancyStatus(b.getAttribute("data-v-approve"), "approved")),
      )
      qsa("[data-v-reject]").forEach((b) =>
        b.addEventListener("click", () => setVacancyStatus(b.getAttribute("data-v-reject"), "rejected")),
      )
    }

    function setVacancyStatus(id, status) {
      const vacancies = getJSON(KEYS.VACANCIES, [])
      const i = vacancies.findIndex((v) => v.id === id)
      if (i >= 0) {
        vacancies[i].status = status
        setJSON(KEYS.VACANCIES, vacancies)
        renderVacancies()
        renderStats()
        renderFeatured()
      }
    }
    function setVacancyFeature(id) {
      const vacancies = getJSON(KEYS.VACANCIES, [])
      const i = vacancies.findIndex((v) => v.id === id)
      if (i >= 0) {
        vacancies[i].featured = !vacancies[i].featured
        setJSON(KEYS.VACANCIES, vacancies)
        renderVacancies()
        renderFeatured()
      }
    }

    if (newVacancyForm) {
      newVacancyForm.addEventListener("submit", (e) => {
        e.preventDefault()
        const data = new FormData(newVacancyForm)
        const title = (data.get("title") || "").toString().trim()
        const company = (data.get("company") || "").toString().trim()
        if (!title || !company) return
        const vacancies = getJSON(KEYS.VACANCIES, [])
        vacancies.unshift({
          id: "v-" + Math.random().toString(36).slice(2, 8),
          title,
          company,
          status: "pending",
          featured: false,
          applicants: 0,
        })
        setJSON(KEYS.VACANCIES, vacancies)
        renderVacancies()
        renderStats()
        addCompanyIfMissing(company)
        newVacancyForm.reset()
      })
    }

    function addCompanyIfMissing(name) {
      const companies = getJSON(KEYS.COMPANIES, [])
      if (!companies.some((c) => c.name.toLowerCase() === name.toLowerCase())) {
        companies.push({ id: "c-" + Math.random().toString(36).slice(2, 8), name, featured: false })
        setJSON(KEYS.COMPANIES, companies)
        renderFeatured()
      }
    }

    function renderStats() {
      const vacancies = getJSON(KEYS.VACANCIES, [])
      const applicants = vacancies.reduce((sum, v) => sum + (v.applicants || 0), 0)
      const open = vacancies.filter((v) => v.status === "approved" || v.status === "pending").length
      const companies = getJSON(KEYS.COMPANIES, []).length
      const elA = qs("#statApplicants"),
        elO = qs("#statOpenRoles"),
        elC = qs("#statCompanies")
      if (elA) elA.textContent = String(applicants)
      if (elO) elO.textContent = String(open)
      if (elC) elC.textContent = String(companies)
      const svg = qs("#sparkline")
      if (svg) {
        const points = Array.from({ length: 10 }, () => 10 + Math.floor(Math.random() * 40))
        const step = 24
        const path = points.map((y, i) => `${i === 0 ? "M" : "L"} ${i * step} ${60 - y}`).join(" ")
        svg.innerHTML = `<path d="${path}" stroke="var(--primary)" stroke-width="2" fill="none" />${points.map((y, i) => `<circle cx="${i * step}" cy="${60 - y}" r="2" fill="var(--accent)" />`).join("")}`
      }
    }

    function renderFeatured() {
      const list = qs("#featuredList")
      if (!list) return
      const vacancies = getJSON(KEYS.VACANCIES, []).filter((v) => v.featured)
      const companies = getJSON(KEYS.COMPANIES, []).filter((c) => c.featured)
      const items = [
        ...vacancies.map(
          (v) =>
            `<li><div><strong>${escapeHtml(v.title)}</strong> at ${escapeHtml(v.company)}</div><span class="muted sm">Featured job</span></li>`,
        ),
        ...companies.map(
          (c) => `<li><div><strong>${escapeHtml(c.name)}</strong></div><span class="muted sm">Top company</span></li>`,
        ),
      ]
      list.innerHTML = items.join("") || '<li class="muted">No featured items yet.</li>'
    }

    renderUsers()
    renderVacancies()
    renderStats()
    renderFeatured()

    const logoutBtn = qs("#logoutBtn")
    if (logoutBtn) logoutBtn.addEventListener("click", logout)
  }

  function escapeHtml(s) {
    return s.replace(/[&<>"']/g, (m) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[m])
  }

  // Boot
  seed()
  document.addEventListener("DOMContentLoaded", () => {
    const init = document.body.getAttribute("data-init")
    if (init === "login") return initLogin()
    if (init === "register") return initRegister()
    if (init === "hr") return initHR()
  })
})()
