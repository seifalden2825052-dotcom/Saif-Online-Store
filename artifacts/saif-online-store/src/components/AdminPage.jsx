import { useEffect, useState } from "react";
import { ArrowLeft, Check, Database, LogOut, ShieldCheck } from "lucide-react";

const DEMO_EMAIL = "demo@auren.com";

async function request(path, options = {}) {
  const response = await fetch(path, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers ?? {}),
    },
    ...options,
  });

  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(body.error ?? "Something went wrong.");
  }

  return body;
}

function LoginCard({ onLogin }) {
  const [email, setEmail] = useState(DEMO_EMAIL);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      await request("/api/admin/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      await onLogin();
    } catch (loginError) {
      setError(loginError.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="admin-auth-card">
      <div className="admin-kicker">
        <ShieldCheck size={15} />
        AUREN private workspace
      </div>
      <h1>Admin access.</h1>
      <p className="admin-lede">
        A focused control room for the portfolio storefront. This is a demo
        environment with no live orders or payment processing.
      </p>

      <form className="admin-form" onSubmit={handleSubmit}>
        <label>
          Email
          <input
            autoComplete="email"
            onChange={(event) => setEmail(event.target.value)}
            type="email"
            value={email}
          />
        </label>
        <label>
          Password
          <input
            autoComplete="current-password"
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Enter the demo password"
            type="password"
            value={password}
          />
        </label>
        {error ? <p className="admin-error">{error}</p> : null}
        <button className="admin-primary-button" disabled={isSubmitting}>
          {isSubmitting ? "Checking access…" : "Enter dashboard"}
        </button>
      </form>

      <div className="admin-demo-note">
        <strong>Demo credentials</strong>
        <span>{DEMO_EMAIL}</span>
        <span>Password supplied in the case study</span>
      </div>
    </section>
  );
}

function Dashboard({ user, onLogout }) {
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    request("/api/admin/summary")
      .then(setSummary)
      .catch((summaryError) => setError(summaryError.message));
  }, []);

  return (
    <section className="admin-dashboard">
      <header className="admin-dashboard-header">
        <div>
          <div className="admin-kicker">
            <ShieldCheck size={15} />
            Authenticated workspace
          </div>
          <h1>Good to see you.</h1>
          <p>{user.email}</p>
        </div>
        <button className="admin-ghost-button" onClick={onLogout}>
          <LogOut size={16} />
          Sign out
        </button>
      </header>

      {error ? <p className="admin-error">{error}</p> : null}
      <div className="admin-status-line">
        <span className="admin-status-dot" />
        Demo operations are online
      </div>

      <div className="admin-cards">
        {(summary?.cards ?? [
          { label: "Catalog", value: "Loading…", tone: "copper" },
          { label: "Checkout", value: "Loading…", tone: "muted" },
          { label: "Database", value: "Checking…", tone: "green" },
        ]).map((card) => (
          <article className={`admin-metric-card ${card.tone}`} key={card.label}>
            <span>{card.label}</span>
            <strong>{card.value}</strong>
          </article>
        ))}
      </div>

      <div className="admin-panel-grid">
        <article className="admin-panel">
          <div className="admin-panel-icon">
            <Database size={18} />
          </div>
          <h2>Neon workspace</h2>
          <p>
            Your demo account is stored with a hashed password and a
            short-lived, HttpOnly session cookie.
          </p>
          <div className="admin-check">
            <Check size={15} />
            Secure session flow active
          </div>
        </article>
        <article className="admin-panel">
          <span className="admin-panel-eyebrow">Portfolio mode</span>
          <h2>Show the thinking.</h2>
          <p>
            Use this screen in the case study to demonstrate protected routes,
            database-backed sessions, and a clear boundary around demo
            commerce.
          </p>
          <a className="admin-back-link" href="/">
            <ArrowLeft size={15} />
            Back to storefront
          </a>
        </article>
      </div>

      {summary?.note ? <p className="admin-footnote">{summary.note}</p> : null}
    </section>
  );
}

export default function AdminPage() {
  const [user, setUser] = useState(undefined);

  async function loadSession() {
    try {
      const session = await request("/api/admin/me");
      setUser(session.user);
    } catch {
      setUser(null);
    }
  }

  useEffect(() => {
    loadSession();
  }, []);

  async function handleLogout() {
    await request("/api/admin/logout", { method: "POST" }).catch(() => {});
    setUser(null);
  }

  return (
    <main className="admin-shell">
      <a className="admin-brand" href="/">
        AUREN <span>/ ADMIN</span>
      </a>
      {user === undefined ? (
        <div className="admin-loading">Loading workspace…</div>
      ) : user ? (
        <Dashboard onLogout={handleLogout} user={user} />
      ) : (
        <LoginCard onLogin={loadSession} />
      )}
    </main>
  );
}