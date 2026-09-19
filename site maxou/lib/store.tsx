'use client'

/**
 * SHERLOCKHUB demo data layer.
 *
 * This project was built without a connected database or auth provider
 * (the user declined integrations). Every account, credit balance, search,
 * transaction, and community document below is client-side demo state,
 * persisted to localStorage so the prototype survives reloads. The shape
 * mirrors what a real backend (users, sessions, ledger, moderation queue)
 * would look like, so a real database/auth provider can be dropped in later
 * without changing the UI.
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

export type UserRole = 'user' | 'admin'
export type AccountStatus = 'active' | 'suspended'

export interface DemoUser {
  id: string
  name: string
  email: string
  password: string
  role: UserRole
  status: AccountStatus
  createdAt: string
  creditBalance: number
}

export type DocStatus = 'pending' | 'approved' | 'rejected' | 'removed'

export interface CommunityDocument {
  id: string
  title: string
  description: string
  category: string
  tags: string[]
  fileType: string
  fileSize: string
  authorId: string
  authorName: string
  date: string
  views: number
  status: DocStatus
}

export interface Report {
  id: string
  documentId: string
  reason: string
  reporterId: string
  date: string
  status: 'open' | 'resolved'
}

export interface SearchRecord {
  id: string
  userId: string
  query: string
  database: string
  resultsFound: number
  creditsUsed: number
  date: string
}

export type TransactionType = 'purchase' | 'search' | 'admin_adjustment'
export type TransactionStatus = 'completed' | 'pending' | 'failed'

export interface Transaction {
  id: string
  userId: string
  type: TransactionType
  description: string
  amountEur: number
  credits: number
  status: TransactionStatus
  date: string
}

export type DatabaseStatus = 'enabled' | 'disabled'

export interface SherlockDatabase {
  id: string
  name: string
  description: string
  recordCount: number
  status: DatabaseStatus
  fields: string[]
}

export interface CreditPackage {
  id: string
  priceEur: number
  credits: number
  highlight?: boolean
}

export interface AdminSettings {
  pricePerCreditEur: number
  packages: CreditPackage[]
}

export interface SearchResultItem {
  id: string
  match: string
  database: string
  relevance: number
  info: string[]
}

interface StoreState {
  users: DemoUser[]
  currentUserId: string | null
  documents: CommunityDocument[]
  reports: Report[]
  searches: SearchRecord[]
  transactions: Transaction[]
  databases: SherlockDatabase[]
  settings: AdminSettings
}

const STORAGE_KEY = 'sherlockhub-demo-state-v1'

function uid(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}${Date.now().toString(36)}`
}

const DEFAULT_PACKAGES: CreditPackage[] = [
  { id: 'pkg_5', priceEur: 5, credits: 25 },
  { id: 'pkg_10', priceEur: 10, credits: 50 },
  { id: 'pkg_20', priceEur: 20, credits: 100, highlight: true },
  { id: 'pkg_50', priceEur: 50, credits: 250 },
  { id: 'pkg_100', priceEur: 100, credits: 500 },
]

const DEFAULT_DATABASES: SherlockDatabase[] = [
  {
    id: 'db_corporate',
    name: 'CORPORATE REGISTRY',
    description: 'Global company filings, ownership structures, and directors.',
    recordCount: 184_320_000,
    status: 'enabled',
    fields: ['Company name', 'Registration number', 'Directors', 'Jurisdiction'],
  },
  {
    id: 'db_domain',
    name: 'DOMAIN INTELLIGENCE',
    description: 'Domain registration history, DNS records, and ownership signals.',
    recordCount: 96_410_000,
    status: 'enabled',
    fields: ['Domain', 'Registrar', 'Creation date', 'Name servers'],
  },
  {
    id: 'db_public_records',
    name: 'PUBLIC RECORDS',
    description: 'Court filings, licenses, and government-published records.',
    recordCount: 312_880_000,
    status: 'enabled',
    fields: ['Record type', 'Jurisdiction', 'Filing date', 'Status'],
  },
  {
    id: 'db_academic',
    name: 'ACADEMIC INDEX',
    description: 'Published research papers, citations, and author networks.',
    recordCount: 148_900_000,
    status: 'enabled',
    fields: ['Title', 'Authors', 'Journal', 'Citation count'],
  },
  {
    id: 'db_legacy',
    name: 'LEGACY ARCHIVE',
    description: 'Archived and deprecated public datasets.',
    recordCount: 21_050_000,
    status: 'disabled',
    fields: ['Archive ID', 'Source', 'Date archived'],
  },
]

function seedState(): StoreState {
  const now = Date.now()
  const daysAgo = (n: number) => new Date(now - n * 86_400_000).toISOString()

  const adminUser: DemoUser = {
    id: 'user_admin',
    name: 'System Administrator',
    email: 'admin@sherlockhub.io',
    password: 'admin123',
    role: 'admin',
    status: 'active',
    createdAt: daysAgo(400),
    creditBalance: 9999,
  }

  const demoUser: DemoUser = {
    id: 'user_demo',
    name: 'Alex Winters',
    email: 'demo@sherlockhub.io',
    password: 'demo1234',
    role: 'user',
    status: 'active',
    createdAt: daysAgo(62),
    creditBalance: 250,
  }

  const users = [adminUser, demoUser]

  const searches: SearchRecord[] = [
    {
      id: uid('srch'),
      userId: demoUser.id,
      query: 'Nova Meridian Holdings',
      database: 'CORPORATE REGISTRY',
      resultsFound: 1284,
      creditsUsed: 1,
      date: daysAgo(1),
    },
    {
      id: uid('srch'),
      userId: demoUser.id,
      query: 'orbitfield.io',
      database: 'DOMAIN INTELLIGENCE',
      resultsFound: 42,
      creditsUsed: 1,
      date: daysAgo(3),
    },
    {
      id: uid('srch'),
      userId: demoUser.id,
      query: 'Halcyon Data Partners',
      database: 'CORPORATE REGISTRY',
      resultsFound: 318,
      creditsUsed: 1,
      date: daysAgo(9),
    },
    {
      id: uid('srch'),
      userId: demoUser.id,
      query: 'quantum lattice compression',
      database: 'ACADEMIC INDEX',
      resultsFound: 76,
      creditsUsed: 1,
      date: daysAgo(15),
    },
  ]

  const transactions: Transaction[] = [
    {
      id: uid('txn'),
      userId: demoUser.id,
      type: 'purchase',
      description: 'Credit purchase',
      amountEur: 50,
      credits: 250,
      status: 'completed',
      date: daysAgo(60),
    },
    {
      id: uid('txn'),
      userId: demoUser.id,
      type: 'search',
      description: 'Search — Nova Meridian Holdings',
      amountEur: 0,
      credits: -1,
      status: 'completed',
      date: daysAgo(1),
    },
    {
      id: uid('txn'),
      userId: demoUser.id,
      type: 'search',
      description: 'Search — orbitfield.io',
      amountEur: 0,
      credits: -1,
      status: 'completed',
      date: daysAgo(3),
    },
    {
      id: uid('txn'),
      userId: demoUser.id,
      type: 'search',
      description: 'Search — Halcyon Data Partners',
      amountEur: 0,
      credits: -1,
      status: 'completed',
      date: daysAgo(9),
    },
  ]

  const documents: CommunityDocument[] = [
    {
      id: uid('doc'),
      title: 'Global Shipping Delay Dataset 2024',
      description:
        'A structured dataset of port congestion and shipping delays compiled from public port authority bulletins.',
      category: 'Business',
      tags: ['logistics', 'shipping', 'trade'],
      fileType: 'CSV',
      fileSize: '4.2 MB',
      authorId: demoUser.id,
      authorName: demoUser.name,
      date: daysAgo(20),
      views: 1842,
      status: 'approved',
    },
    {
      id: uid('doc'),
      title: 'Open Municipal Budgets — 2023 Compilation',
      description:
        'Aggregated municipal budget disclosures across 40 mid-size cities, cleaned and normalized.',
      category: 'Finance',
      tags: ['government', 'budget', 'transparency'],
      fileType: 'XLSX',
      fileSize: '2.8 MB',
      authorId: demoUser.id,
      authorName: demoUser.name,
      date: daysAgo(34),
      views: 964,
      status: 'approved',
    },
    {
      id: uid('doc'),
      title: 'Neural Retrieval Benchmark Notes',
      description: 'My personal research notes benchmarking dense retrieval architectures.',
      category: 'Artificial Intelligence',
      tags: ['ai', 'research', 'benchmarks'],
      fileType: 'PDF',
      fileSize: '1.1 MB',
      authorId: demoUser.id,
      authorName: demoUser.name,
      date: daysAgo(2),
      views: 12,
      status: 'pending',
    },
    {
      id: uid('doc'),
      title: 'Climate Station Readings — Pacific Rim',
      description: 'Raw sensor exports from independently operated weather stations I maintain.',
      category: 'Science',
      tags: ['climate', 'sensors', 'geography'],
      fileType: 'JSON',
      fileSize: '9.6 MB',
      authorId: adminUser.id,
      authorName: adminUser.name,
      date: daysAgo(55),
      views: 3210,
      status: 'approved',
    },
  ]

  const reports: Report[] = []

  return {
    users,
    currentUserId: null,
    documents,
    reports,
    searches,
    transactions,
    databases: DEFAULT_DATABASES,
    settings: {
      pricePerCreditEur: 0.2,
      packages: DEFAULT_PACKAGES,
    },
  }
}

function loadState(): StoreState {
  if (typeof window === 'undefined') return seedState()
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return seedState()
    const parsed = JSON.parse(raw) as StoreState
    if (!parsed.users || !parsed.databases) return seedState()
    return parsed
  } catch {
    return seedState()
  }
}

const DEMO_RESULT_TEMPLATES = [
  'Registered entity match',
  'Historical filing match',
  'Cross-reference match',
  'Ownership record match',
  'Public disclosure match',
  'Archived record match',
]

const DEMO_INFO_FIELDS = [
  'Jurisdiction: Delaware, US',
  'Status: Active',
  'First indexed: 2019',
  'Confidence: High',
  'Source: Public filing',
  'Last updated: 2024',
]

function generateResults(query: string, count: number): SearchResultItem[] {
  const n = Math.min(count, 8)
  return Array.from({ length: n }, (_, i) => ({
    id: uid('res'),
    match: `${query} ${i === 0 ? '' : `— Record ${i + 1}`}`.trim(),
    database: DEMO_RESULT_TEMPLATES[i % DEMO_RESULT_TEMPLATES.length],
    relevance: Math.max(62, 99 - i * 6),
    info: [
      DEMO_INFO_FIELDS[i % DEMO_INFO_FIELDS.length],
      DEMO_INFO_FIELDS[(i + 2) % DEMO_INFO_FIELDS.length],
      DEMO_INFO_FIELDS[(i + 4) % DEMO_INFO_FIELDS.length],
    ],
  }))
}

interface AppContextValue {
  ready: boolean
  currentUser: DemoUser | null
  isAdmin: boolean
  users: DemoUser[]
  documents: CommunityDocument[]
  reports: Report[]
  searches: SearchRecord[]
  transactions: Transaction[]
  databases: SherlockDatabase[]
  settings: AdminSettings

  signUp: (name: string, email: string, password: string) => { ok: boolean; error?: string }
  signIn: (email: string, password: string) => { ok: boolean; error?: string }
  signOut: () => void

  performSearch: (
    query: string,
    databaseId: string,
  ) => { ok: boolean; error?: string; results?: SearchResultItem[]; resultCount?: number }

  purchaseCredits: (pkg: CreditPackage) => void
  buyCustomCredits: (amountEur: number) => void

  mySearches: () => SearchRecord[]
  myTransactions: () => Transaction[]
  myDocuments: () => CommunityDocument[]

  publishDocument: (
    doc: Omit<CommunityDocument, 'id' | 'authorId' | 'authorName' | 'date' | 'views' | 'status'>,
  ) => void
  reportDocument: (documentId: string, reason: string) => void
  incrementViews: (documentId: string) => void

  adminApproveDocument: (id: string) => void
  adminRejectDocument: (id: string) => void
  adminRemoveDocument: (id: string) => void
  adminResolveReport: (id: string) => void

  adminAddDatabase: (db: Omit<SherlockDatabase, 'id'>) => void
  adminRemoveDatabase: (id: string) => void
  adminToggleDatabase: (id: string) => void

  adminAdjustCredits: (userId: string, delta: number, note: string) => void
  adminUpdateSettings: (settings: AdminSettings) => void
  adminSetUserStatus: (userId: string, status: AccountStatus) => void
}

const AppContext = createContext<AppContextValue | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<StoreState>(seedState)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    setState(loadState())
    setReady(true)
  }, [])

  useEffect(() => {
    if (!ready) return
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }, [state, ready])

  const currentUser = useMemo(
    () => state.users.find((u) => u.id === state.currentUserId) ?? null,
    [state.users, state.currentUserId],
  )

  const signUp = useCallback<AppContextValue['signUp']>(
    (name, email, password) => {
      const exists = state.users.some((u) => u.email.toLowerCase() === email.toLowerCase())
      if (exists) return { ok: false, error: 'An account with this email already exists.' }
      const newUser: DemoUser = {
        id: uid('user'),
        name,
        email,
        password,
        role: 'user',
        status: 'active',
        createdAt: new Date().toISOString(),
        creditBalance: 0,
      }
      setState((s) => ({ ...s, users: [...s.users, newUser], currentUserId: newUser.id }))
      return { ok: true }
    },
    [state.users],
  )

  const signIn = useCallback<AppContextValue['signIn']>(
    (email, password) => {
      const user = state.users.find((u) => u.email.toLowerCase() === email.toLowerCase())
      if (!user || user.password !== password) {
        return { ok: false, error: 'Invalid email or password.' }
      }
      if (user.status === 'suspended') {
        return { ok: false, error: 'This account has been suspended.' }
      }
      setState((s) => ({ ...s, currentUserId: user.id }))
      return { ok: true }
    },
    [state.users],
  )

  const signOut = useCallback(() => {
    setState((s) => ({ ...s, currentUserId: null }))
  }, [])

  const performSearch = useCallback<AppContextValue['performSearch']>(
    (query, databaseId) => {
      if (!currentUser) return { ok: false, error: 'You must be signed in to search.' }
      if (currentUser.creditBalance < 1) {
        return { ok: false, error: 'INSUFFICIENT_CREDITS' }
      }
      const db = state.databases.find((d) => d.id === databaseId) ?? state.databases[0]
      const resultCount = 40 + Math.floor(Math.random() * 3000)
      const results = generateResults(query, 6)

      const record: SearchRecord = {
        id: uid('srch'),
        userId: currentUser.id,
        query,
        database: db.name,
        resultsFound: resultCount,
        creditsUsed: 1,
        date: new Date().toISOString(),
      }
      const txn: Transaction = {
        id: uid('txn'),
        userId: currentUser.id,
        type: 'search',
        description: `Search — ${query}`,
        amountEur: 0,
        credits: -1,
        status: 'completed',
        date: new Date().toISOString(),
      }

      setState((s) => ({
        ...s,
        users: s.users.map((u) =>
          u.id === currentUser.id ? { ...u, creditBalance: u.creditBalance - 1 } : u,
        ),
        searches: [record, ...s.searches],
        transactions: [txn, ...s.transactions],
      }))

      return { ok: true, results, resultCount }
    },
    [currentUser, state.databases],
  )

  const purchaseCredits = useCallback<AppContextValue['purchaseCredits']>(
    (pkg) => {
      if (!currentUser) return
      const txn: Transaction = {
        id: uid('txn'),
        userId: currentUser.id,
        type: 'purchase',
        description: 'Credit purchase',
        amountEur: pkg.priceEur,
        credits: pkg.credits,
        status: 'completed',
        date: new Date().toISOString(),
      }
      setState((s) => ({
        ...s,
        users: s.users.map((u) =>
          u.id === currentUser.id ? { ...u, creditBalance: u.creditBalance + pkg.credits } : u,
        ),
        transactions: [txn, ...s.transactions],
      }))
    },
    [currentUser],
  )

  const buyCustomCredits = useCallback<AppContextValue['buyCustomCredits']>(
    (amountEur) => {
      if (!currentUser) return
      const credits = Math.round(amountEur / state.settings.pricePerCreditEur)
      const txn: Transaction = {
        id: uid('txn'),
        userId: currentUser.id,
        type: 'purchase',
        description: 'Credit purchase',
        amountEur,
        credits,
        status: 'completed',
        date: new Date().toISOString(),
      }
      setState((s) => ({
        ...s,
        users: s.users.map((u) =>
          u.id === currentUser.id ? { ...u, creditBalance: u.creditBalance + credits } : u,
        ),
        transactions: [txn, ...s.transactions],
      }))
    },
    [currentUser, state.settings.pricePerCreditEur],
  )

  const mySearches = useCallback(
    () => state.searches.filter((s) => s.userId === currentUser?.id),
    [state.searches, currentUser],
  )
  const myTransactions = useCallback(
    () => state.transactions.filter((t) => t.userId === currentUser?.id),
    [state.transactions, currentUser],
  )
  const myDocuments = useCallback(
    () => state.documents.filter((d) => d.authorId === currentUser?.id),
    [state.documents, currentUser],
  )

  const publishDocument = useCallback<AppContextValue['publishDocument']>(
    (doc) => {
      if (!currentUser) return
      const newDoc: CommunityDocument = {
        ...doc,
        id: uid('doc'),
        authorId: currentUser.id,
        authorName: currentUser.name,
        date: new Date().toISOString(),
        views: 0,
        status: 'pending',
      }
      setState((s) => ({ ...s, documents: [newDoc, ...s.documents] }))
    },
    [currentUser],
  )

  const reportDocument = useCallback<AppContextValue['reportDocument']>(
    (documentId, reason) => {
      if (!currentUser) return
      const report: Report = {
        id: uid('rep'),
        documentId,
        reason,
        reporterId: currentUser.id,
        date: new Date().toISOString(),
        status: 'open',
      }
      setState((s) => ({ ...s, reports: [report, ...s.reports] }))
    },
    [currentUser],
  )

  const incrementViews = useCallback<AppContextValue['incrementViews']>((documentId) => {
    setState((s) => ({
      ...s,
      documents: s.documents.map((d) =>
        d.id === documentId ? { ...d, views: d.views + 1 } : d,
      ),
    }))
  }, [])

  const adminApproveDocument = useCallback<AppContextValue['adminApproveDocument']>((id) => {
    setState((s) => ({
      ...s,
      documents: s.documents.map((d) => (d.id === id ? { ...d, status: 'approved' } : d)),
    }))
  }, [])
  const adminRejectDocument = useCallback<AppContextValue['adminRejectDocument']>((id) => {
    setState((s) => ({
      ...s,
      documents: s.documents.map((d) => (d.id === id ? { ...d, status: 'rejected' } : d)),
    }))
  }, [])
  const adminRemoveDocument = useCallback<AppContextValue['adminRemoveDocument']>((id) => {
    setState((s) => ({
      ...s,
      documents: s.documents.map((d) => (d.id === id ? { ...d, status: 'removed' } : d)),
    }))
  }, [])
  const adminResolveReport = useCallback<AppContextValue['adminResolveReport']>((id) => {
    setState((s) => ({
      ...s,
      reports: s.reports.map((r) => (r.id === id ? { ...r, status: 'resolved' } : r)),
    }))
  }, [])

  const adminAddDatabase = useCallback<AppContextValue['adminAddDatabase']>((db) => {
    setState((s) => ({
      ...s,
      databases: [...s.databases, { ...db, id: uid('db') }],
    }))
  }, [])
  const adminRemoveDatabase = useCallback<AppContextValue['adminRemoveDatabase']>((id) => {
    setState((s) => ({ ...s, databases: s.databases.filter((d) => d.id !== id) }))
  }, [])
  const adminToggleDatabase = useCallback<AppContextValue['adminToggleDatabase']>((id) => {
    setState((s) => ({
      ...s,
      databases: s.databases.map((d) =>
        d.id === id ? { ...d, status: d.status === 'enabled' ? 'disabled' : 'enabled' } : d,
      ),
    }))
  }, [])

  const adminAdjustCredits = useCallback<AppContextValue['adminAdjustCredits']>(
    (userId, delta, note) => {
      const txn: Transaction = {
        id: uid('txn'),
        userId,
        type: 'admin_adjustment',
        description: note || (delta >= 0 ? 'Admin credit grant' : 'Admin credit deduction'),
        amountEur: 0,
        credits: delta,
        status: 'completed',
        date: new Date().toISOString(),
      }
      setState((s) => ({
        ...s,
        users: s.users.map((u) =>
          u.id === userId ? { ...u, creditBalance: Math.max(0, u.creditBalance + delta) } : u,
        ),
        transactions: [txn, ...s.transactions],
      }))
    },
    [],
  )

  const adminUpdateSettings = useCallback<AppContextValue['adminUpdateSettings']>((settings) => {
    setState((s) => ({ ...s, settings }))
  }, [])

  const adminSetUserStatus = useCallback<AppContextValue['adminSetUserStatus']>(
    (userId, status) => {
      setState((s) => ({
        ...s,
        users: s.users.map((u) => (u.id === userId ? { ...u, status } : u)),
      }))
    },
    [],
  )

  const value: AppContextValue = {
    ready,
    currentUser,
    isAdmin: currentUser?.role === 'admin',
    users: state.users,
    documents: state.documents,
    reports: state.reports,
    searches: state.searches,
    transactions: state.transactions,
    databases: state.databases,
    settings: state.settings,
    signUp,
    signIn,
    signOut,
    performSearch,
    purchaseCredits,
    buyCustomCredits,
    mySearches,
    myTransactions,
    myDocuments,
    publishDocument,
    reportDocument,
    incrementViews,
    adminApproveDocument,
    adminRejectDocument,
    adminRemoveDocument,
    adminResolveReport,
    adminAddDatabase,
    adminRemoveDatabase,
    adminToggleDatabase,
    adminAdjustCredits,
    adminUpdateSettings,
    adminSetUserStatus,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
