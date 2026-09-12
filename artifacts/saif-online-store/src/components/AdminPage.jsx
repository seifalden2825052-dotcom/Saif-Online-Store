import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  ArrowDownRight,
  ArrowLeft,
  ArrowUpRight,
  BarChart3,
  Bell,
  Check,
  ChevronDown,
  ChevronRight,
  CircleDollarSign,
  ClipboardList,
  Database,
  ExternalLink,
  Headphones,
  LayoutDashboard,
  LogOut,
  Menu,
  Package,
  PanelLeftClose,
  PanelLeftOpen,
  Search,
  Settings2,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Users,
  X,
} from "lucide-react";
import { products } from "../data/products";
import BrandMark from "./BrandMark";

const DEMO_EMAIL = "demo@auren.com";
const DEMO_PASSWORD = "demo123";

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

  function useDemoAccess() {
    setEmail(DEMO_EMAIL);
    setPassword(DEMO_PASSWORD);
    setError("");
  }

  return (
    <section className="admin-auth-card">
      <div className="admin-kicker">
        <ShieldCheck size={15} />
        AUREN private workspace
      </div>
      <h1>Admin access.</h1>
      <p className="admin-lede">
        A polished control room for the AUREN storefront. This is a safe
        portfolio demo with no live orders or payment processing.
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
            placeholder="Enter demo123"
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
        <div>
          <strong>Demo credentials</strong>
          <span>Ready for case study previews</span>
        </div>
        <button className="admin-demo-fill" onClick={useDemoAccess} type="button">
          Use demo access
          <ArrowUpRight size={14} />
        </button>
      </div>
    </section>
  );
}

const navItems = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "orders", label: "Orders", icon: ClipboardList, count: "12" },
  { id: "products", label: "Products", icon: Package },
  { id: "activity", label: "Activity", icon: Activity },
];

const demoOrders = [
  { id: "#AUR-1048", customer: "Maya Hassan", product: "Quantum ANC Headphones", total: "$299.00", status: "Paid", date: "Today, 10:42" },
  { id: "#AUR-1047", customer: "Omar Khalil", product: "Vortex 34” Ultrawide", total: "$599.00", status: "Processing", date: "Today, 09:18" },
  { id: "#AUR-1046", customer: "Lina Saad", product: "Pulse Earbuds Mini", total: "$149.00", status: "Shipped", date: "Yesterday, 18:06" },
  { id: "#AUR-1045", customer: "Adam Nassar", product: "Flux Low-Profile Keyboard", total: "$249.00", status: "Paid", date: "Yesterday, 16:21" },
  { id: "#AUR-1044", customer: "Rana Younis", product: "Neon Smartwatch S2", total: "$199.00", status: "Delivered", date: "Sep 10, 13:54" },
  { id: "#AUR-1043", customer: "Yousef Barakat", product: "Spark Drone 4K", total: "$799.00", status: "Cancelled", date: "Sep 10, 11:26" },
];

const demoActivity = [
  { icon: ShoppingBag, title: "New order received", detail: "Maya Hassan placed #AUR-1048", time: "12 min ago", tone: "copper" },
  { icon: Package, title: "Inventory updated", detail: "4 units added to Quantum ANC Headphones", time: "48 min ago", tone: "green" },
  { icon: Users, title: "New customer profile", detail: "Omar Khalil joined the AUREN list", time: "2 hrs ago", tone: "blue" },
  { icon: ShieldCheck, title: "Secure session verified", detail: "Admin access authenticated from demo workspace", time: "Today, 09:02", tone: "neutral" },
];

const productCategories = ["Audio", "Wearables", "Displays", "Phones", "Desk", "Aerial"];

const demoNotifications = [
  { id: "order-1048", title: "New order received", detail: "Maya Hassan placed #AUR-1048", time: "12 min ago", section: "orders", tone: "copper" },
  { id: "inventory-q1", title: "Inventory updated", detail: "4 units added to Quantum ANC Headphones", time: "48 min ago", section: "products", tone: "green" },
  { id: "customer-omar", title: "New customer profile", detail: "Omar Khalil joined the AUREN list", time: "2 hrs ago", section: "activity", tone: "blue" },
];

function readStoredCatalog() {
  if (typeof window === "undefined") return products;
  try {
    const stored = JSON.parse(window.localStorage.getItem("auren-admin-products") ?? "null");
    return Array.isArray(stored) && stored.length ? stored : products;
  } catch {
    return products;
  }
}

function downloadCsv(filename, rows) {
  const csv = rows
    .map((row) => row.map((value) => `"${String(value ?? "").replaceAll('"', '""')}"`).join(","))
    .join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function formatCurrency(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

function MetricCard({ label, value, delta, trend = "up", icon: Icon, tone = "copper" }) {
  return (
    <article className={`admin-stat-card ${tone}`}>
      <div className="admin-stat-topline">
        <span>{label}</span>
        <span className="admin-stat-icon"><Icon size={16} /></span>
      </div>
      <strong>{value}</strong>
      <div className={`admin-stat-delta ${trend}`}>
        {trend === "up" ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
        {delta}
        <span>vs last month</span>
      </div>
    </article>
  );
}

function SalesChart() {
  const bars = [34, 44, 39, 56, 48, 63, 58, 76, 67, 82, 73, 92];
  return (
    <div className="admin-sales-chart">
      <div className="admin-chart-y">
        <span>$8k</span>
        <span>$6k</span>
        <span>$4k</span>
        <span>$2k</span>
        <span>$0</span>
      </div>
      <div className="admin-chart-stage">
        <div className="admin-chart-grid">
          <i /><i /><i /><i /><i />
        </div>
        <svg className="admin-chart-line" viewBox="0 0 620 220" preserveAspectRatio="none" aria-label="Revenue chart">
          <defs>
            <linearGradient id="chartFill" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0" stopColor="var(--neon)" stopOpacity="0.28" />
              <stop offset="1" stopColor="var(--neon)" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d="M0 178 C45 148 62 164 104 139 S170 158 206 112 S275 130 310 92 S370 110 410 72 S462 104 502 48 S560 66 620 20 V220 H0 Z" fill="url(#chartFill)" />
          <path d="M0 178 C45 148 62 164 104 139 S170 158 206 112 S275 130 310 92 S370 110 410 72 S462 104 502 48 S560 66 620 20" fill="none" stroke="var(--neon)" strokeWidth="3" vectorEffect="non-scaling-stroke" />
        </svg>
        <div className="admin-chart-bars">
          {bars.map((height, index) => (
            <span key={index} style={{ height: `${height}%` }} />
          ))}
        </div>
        <div className="admin-chart-x">
          {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map((month) => <span key={month}>{month}</span>)}
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  return <span className={`admin-status-badge ${status.toLowerCase()}`}>{status}</span>;
}

function RecentOrders({ onSelect }) {
  return (
    <section className="admin-surface admin-orders-preview">
      <div className="admin-section-heading">
        <div>
          <span className="admin-eyebrow">Latest activity</span>
          <h2>Recent orders</h2>
        </div>
        <button className="admin-inline-link" onClick={() => onSelect("orders")}>View all <ChevronRight size={15} /></button>
      </div>
      <div className="admin-order-list">
        {demoOrders.slice(0, 4).map((order) => (
          <button className="admin-order-row" key={order.id} onClick={() => onSelect(order)} type="button">
            <span className="admin-order-avatar">{order.customer.split(" ").map((name) => name[0]).join("")}</span>
            <span className="admin-order-customer">
              <strong>{order.customer}</strong>
              <small>{order.id} · {order.product}</small>
            </span>
            <span className="admin-order-total">{order.total}</span>
            <StatusBadge status={order.status} />
            <ChevronRight className="admin-row-chevron" size={16} />
          </button>
        ))}
      </div>
    </section>
  );
}

function Overview({ summary, onNavigate, onSelectOrder }) {
  return (
    <div className="admin-view">
      <div className="admin-welcome">
        <div>
          <span className="admin-eyebrow">Saturday, September 12, 2026</span>
          <h1>Good morning, <em>Saif.</em></h1>
          <p>Here’s what is happening across your storefront today.</p>
        </div>
        <div className="admin-demo-pill"><span /> Demo workspace · Live preview</div>
      </div>

      <div className="admin-stat-grid">
        <MetricCard icon={CircleDollarSign} label="Total revenue" value="$24,860" delta="+12.8%" />
        <MetricCard icon={ShoppingBag} label="Total orders" value="184" delta="+8.4%" tone="blue" />
        <MetricCard icon={Users} label="Customers" value="1,284" delta="+6.2%" tone="green" />
        <MetricCard icon={BarChart3} label="Conversion rate" value="4.86%" delta="-0.4%" trend="down" tone="violet" />
      </div>

      <div className="admin-main-grid">
        <section className="admin-surface admin-chart-card">
          <div className="admin-section-heading">
            <div>
              <span className="admin-eyebrow">Performance</span>
              <h2>Revenue overview</h2>
            </div>
            <button className="admin-period-select">Last 12 months <ChevronDown size={14} /></button>
          </div>
          <div className="admin-chart-total">
            <strong>$24,860.00</strong>
            <span><ArrowUpRight size={14} /> 12.8%</span>
          </div>
          <SalesChart />
        </section>

        <section className="admin-surface admin-inventory-card">
          <div className="admin-section-heading">
            <div>
              <span className="admin-eyebrow">Stock watch</span>
              <h2>Inventory health</h2>
            </div>
            <button className="admin-icon-button" onClick={() => onNavigate("products")} title="Open products"><ExternalLink size={15} /></button>
          </div>
          <div className="admin-inventory-score">
            <div className="admin-score-ring"><strong>82</strong><span>/ 100</span></div>
            <div><strong>Healthy stock</strong><p>Most of your collection is ready to ship.</p></div>
          </div>
          <div className="admin-inventory-bars">
            <div><span>In stock <b>6</b></span><i><em style={{ width: "76%" }} /></i></div>
            <div><span>Low stock <b>1</b></span><i><em className="amber" style={{ width: "24%" }} /></i></div>
            <div><span>Out of stock <b>2</b></span><i><em className="red" style={{ width: "12%" }} /></i></div>
          </div>
          <button className="admin-secondary-button" onClick={() => onNavigate("products")}>Review products <ArrowUpRight size={15} /></button>
        </section>
      </div>

      <div className="admin-bottom-grid">
        <RecentOrders onSelect={(value) => typeof value === "string" ? onNavigate(value) : onSelectOrder(value)} />
        <section className="admin-surface admin-activity-preview">
          <div className="admin-section-heading">
            <div>
              <span className="admin-eyebrow">Workspace feed</span>
              <h2>Recent activity</h2>
            </div>
            <button className="admin-icon-button" onClick={() => onNavigate("activity")} title="Open activity"><Activity size={15} /></button>
          </div>
          <div className="admin-activity-list">
            {demoActivity.slice(0, 3).map((item) => {
              const Icon = item.icon;
              return <div className="admin-activity-item" key={item.title}><span className={`admin-activity-icon ${item.tone}`}><Icon size={15} /></span><div><strong>{item.title}</strong><p>{item.detail}</p><small>{item.time}</small></div></div>;
            })}
          </div>
        </section>
      </div>

      <p className="admin-disclaimer"><Database size={14} /> {summary?.note ?? "This is a controlled portfolio demo. No real payments, shipping, or customer data are processed."}</p>
    </div>
  );
}

function OrdersView({ onSelect, onToast }) {
  const [filter, setFilter] = useState("All");
  const [query, setQuery] = useState("");
  const filtered = demoOrders.filter((order) => {
    const matchesFilter = filter === "All" || order.status === filter;
    const matchesQuery = `${order.id} ${order.customer} ${order.product}`.toLowerCase().includes(query.toLowerCase());
    return matchesFilter && matchesQuery;
  });
  return (
    <div className="admin-view">
      <div className="admin-page-heading"><div><span className="admin-eyebrow">Commerce</span><h1>Orders <span>({demoOrders.length})</span></h1><p>Track the customer journey from payment to delivery.</p></div><button className="admin-primary-button admin-compact-button" onClick={() => { downloadCsv("auren-orders-report.csv", [["Order", "Customer", "Product", "Date", "Total", "Status"], ...demoOrders.map((order) => [order.id, order.customer, order.product, order.date, order.total, order.status])]); onToast("Orders report downloaded."); }}><ExternalLink size={15} /> Export report</button></div>
      <div className="admin-toolbar"><label className="admin-search-field"><Search size={16} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search orders or customers…" /></label><div className="admin-filter-pills">{["All", "Paid", "Processing", "Shipped"].map((item) => <button className={filter === item ? "active" : ""} key={item} onClick={() => setFilter(item)}>{item}</button>)}</div></div>
      <section className="admin-surface admin-table-surface"><div className="admin-table-scroll"><table className="admin-table"><thead><tr><th>Order</th><th>Customer</th><th>Product</th><th>Date</th><th>Total</th><th>Status</th><th /></tr></thead><tbody>{filtered.map((order) => <tr key={order.id}><td><strong>{order.id}</strong></td><td>{order.customer}</td><td className="admin-table-product">{order.product}</td><td className="admin-muted">{order.date}</td><td><strong>{order.total}</strong></td><td><StatusBadge status={order.status} /></td><td><button className="admin-table-action" onClick={() => onSelect(order)}>View <ChevronRight size={14} /></button></td></tr>)}</tbody></table></div>{filtered.length === 0 ? <div className="admin-empty-state">No orders match this search.</div> : null}</section>
    </div>
  );
}

function ProductsView({ catalog, onAddProduct, onToast }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [draft, setDraft] = useState({ name: "", category: productCategories[0], price: "", stock: "10", tagline: "", image: "", imageUrl: "", imageName: "" });
  const categories = ["All", ...new Set(catalog.map((product) => product.category))];
  const filtered = catalog.filter((product) => product.name.toLowerCase().includes(query.toLowerCase()) && (category === "All" || product.category === category));

  function updateDraft(field, value) {
    setDraft((current) => ({ ...current, [field]: value }));
  }

  function closeForm() {
    setIsFormOpen(false);
    setDraft({ name: "", category: productCategories[0], price: "", stock: "10", tagline: "", image: "", imageUrl: "", imageName: "" });
  }

  function handleImageChange(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      onToast("Please choose an image file.");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      onToast("Please choose an image smaller than 2MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setDraft((current) => ({ ...current, image: String(reader.result), imageUrl: "", imageName: file.name }));
    };
    reader.readAsDataURL(file);
  }

  function handleSubmit(event) {
    event.preventDefault();
    const name = draft.name.trim();
    const price = Number(draft.price);
    const stock = Math.max(0, Number(draft.stock) || 0);
    if (!name || !Number.isFinite(price) || price < 0) return;
    const product = {
      id: `auren-custom-${Date.now()}`,
      name,
      tagline: draft.tagline.trim() || "Precision technology, considered.",
      description: draft.tagline.trim() || "A new AUREN catalog addition.",
      price,
      category: draft.category,
      inStock: stock > 0,
      stock,
      image: draft.image.trim() || catalog[0]?.image,
      icon: "Package",
      rating: 5,
      reviews: 0,
      span: "",
      finishes: [],
      sizes: ["Standard"],
      specs: [],
    };
    onAddProduct(product);
    closeForm();
    onToast(`${name} added to the catalog.`);
  }

  return (
    <div className="admin-view">
      <div className="admin-page-heading"><div><span className="admin-eyebrow">Catalog</span><h1>Products <span>({catalog.length})</span></h1><p>Your curated AUREN collection, ready to be managed.</p></div><button className="admin-primary-button admin-compact-button" onClick={() => setIsFormOpen(true)}><Package size={15} /> Add product</button></div>
      <div className="admin-toolbar"><label className="admin-search-field"><Search size={16} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search your collection…" /></label><div className="admin-filter-pills">{categories.map((item) => <button className={category === item ? "active" : ""} key={item} onClick={() => setCategory(item)}>{item}</button>)}</div></div>
      <section className="admin-surface admin-product-surface"><div className="admin-table-scroll"><table className="admin-table admin-product-table"><thead><tr><th>Product</th><th>Category</th><th>Price</th><th>Rating</th><th>Stock</th><th /></tr></thead><tbody>{filtered.map((product) => <tr key={product.id}><td><div className="admin-product-cell"><img src={product.image} alt="" /><span><strong>{product.name}</strong><small>{product.tagline}</small></span></div></td><td><span className="admin-category-label">{product.category}</span></td><td><strong>{formatCurrency(product.price)}</strong></td><td><span className="admin-rating">★ {product.rating}</span><small className="admin-muted"> {product.reviews.toLocaleString()} reviews</small></td><td><span className={`admin-stock ${product.inStock ? "available" : "unavailable"}`}><i />{product.inStock ? "In stock" : "Out of stock"}</span></td><td><button className="admin-table-action" onClick={() => onToast(`${product.name} is ready for review.`)}>Manage <ChevronRight size={14} /></button></td></tr>)}</tbody></table></div>{filtered.length === 0 ? <div className="admin-empty-state">No products match this search.</div> : null}</section>
      {isFormOpen ? <div className="admin-modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) closeForm(); }}><form className="admin-product-modal" onSubmit={handleSubmit}><div className="admin-modal-header"><div><span className="admin-eyebrow">Catalog entry</span><h2>Add product</h2></div><button type="button" className="admin-icon-button" onClick={closeForm} aria-label="Close add product dialog"><X size={18} /></button></div><div className="admin-modal-grid"><label>Product name<input required value={draft.name} onChange={(event) => updateDraft("name", event.target.value)} placeholder="e.g. Halo Studio Speaker" /></label><label>Category<select value={draft.category} onChange={(event) => updateDraft("category", event.target.value)}>{productCategories.map((item) => <option key={item}>{item}</option>)}</select></label><label>Price (USD)<input required min="0" step="0.01" type="number" value={draft.price} onChange={(event) => updateDraft("price", event.target.value)} placeholder="299" /></label><label>Opening stock<input min="0" step="1" type="number" value={draft.stock} onChange={(event) => updateDraft("stock", event.target.value)} /></label><label className="admin-modal-wide">Tagline<input value={draft.tagline} onChange={(event) => updateDraft("tagline", event.target.value)} placeholder="A short line for the catalog" /></label><label className="admin-modal-wide admin-upload-field">Upload image from device <span className="admin-field-hint">JPG, PNG, or WebP · max 2MB</span><input type="file" accept="image/*" onChange={handleImageChange} /><span className="admin-upload-name">{draft.imageName || "Choose an image from your device"}</span></label><label className="admin-modal-wide">Image URL <span className="admin-field-hint">optional alternative</span><input type="url" value={draft.imageUrl} onChange={(event) => { const value = event.target.value; updateDraft("imageUrl", value); updateDraft("image", value); updateDraft("imageName", ""); }} placeholder="https://images.unsplash.com/…" /></label>{draft.image ? <div className="admin-upload-preview admin-modal-wide"><img src={draft.image} alt="Product preview" /><span>Preview</span></div> : null}</div><div className="admin-modal-actions"><button type="button" className="admin-secondary-button" onClick={closeForm}>Cancel</button><button className="admin-primary-button" type="submit">Add to catalog <ArrowUpRight size={15} /></button></div></form></div> : null}
    </div>
  );
}

function ActivityView() {
  return (
    <div className="admin-view">
      <div className="admin-page-heading"><div><span className="admin-eyebrow">System log</span><h1>Activity</h1><p>A clear audit trail for the demo workspace.</p></div><div className="admin-live-label"><span /> All systems operational</div></div>
      <section className="admin-surface admin-full-activity"><div className="admin-activity-list admin-activity-expanded">{demoActivity.concat([{ icon: Settings2, title: "Workspace preferences updated", detail: "Display mode set to editorial light", time: "Yesterday, 17:30", tone: "neutral" }]).map((item) => { const Icon = item.icon; return <div className="admin-activity-item" key={item.title}><span className={`admin-activity-icon ${item.tone}`}><Icon size={15} /></span><div><strong>{item.title}</strong><p>{item.detail}</p><small>{item.time}</small></div><ChevronRight className="admin-row-chevron" size={16} /></div>; })}</div></section>
    </div>
  );
}

function OrderDrawer({ order, onClose }) {
  if (!order) return null;
  return <><div className="admin-drawer-backdrop" onClick={onClose} /><aside className="admin-order-drawer"><div className="admin-drawer-header"><div><span className="admin-eyebrow">Order detail</span><h2>{order.id}</h2></div><button className="admin-icon-button" onClick={onClose} aria-label="Close order detail"><X size={18} /></button></div><div className="admin-drawer-status"><StatusBadge status={order.status} /><span>{order.date}</span></div><div className="admin-drawer-customer"><span className="admin-order-avatar">{order.customer.split(" ").map((name) => name[0]).join("")}</span><div><strong>{order.customer}</strong><small>Demo customer profile</small></div></div><div className="admin-drawer-line"><span>Item</span><strong>{order.product}</strong></div><div className="admin-drawer-line"><span>Total</span><strong>{order.total}</strong></div><div className="admin-drawer-note"><Sparkles size={16} /><p>This order is simulated for the portfolio experience. No fulfillment or payment has been triggered.</p></div><button className="admin-secondary-button" onClick={onClose}>Close preview</button></aside></>;
}

function SearchResults({ results, onSelect }) {
  return (
    <div className="admin-search-results" role="listbox">
      {results.length ? results.map((result) => {
        const Icon = result.icon;
        return <button type="button" key={result.id} className="admin-search-result" onClick={() => onSelect(result)}>
          <span className="admin-search-result-icon"><Icon size={14} /></span>
          <span><strong>{result.title}</strong><small>{result.type} · {result.detail}</small></span>
          <ChevronRight size={14} />
        </button>;
      }) : <div className="admin-search-empty"><Search size={15} /> No matching workspace results.</div>}
    </div>
  );
}

function NotificationPopover({ notifications, readNotifications, onRead, onMarkAll, onNavigate }) {
  return (
    <div className="admin-notification-popover">
      <div className="admin-popover-heading">
        <div><span className="admin-eyebrow">Workspace feed</span><strong>Notifications</strong></div>
        <button type="button" onClick={onMarkAll}>Mark all read</button>
      </div>
      <div className="admin-notification-list">
        {notifications.map((item) => {
          const Icon = item.id.startsWith("order") ? ShoppingBag : item.id.startsWith("inventory") ? Package : Users;
          const isRead = readNotifications.includes(item.id);
          return <button type="button" className={`admin-notification-item ${isRead ? "read" : ""}`} key={item.id} onClick={() => { onRead(item.id); onNavigate(item.section); }}>
            <span className={`admin-activity-icon ${item.tone}`}><Icon size={14} /></span>
            <span><strong>{item.title}</strong><small>{item.detail}</small><em>{item.time}</em></span>
            {!isRead ? <i /> : null}
          </button>;
        })}
      </div>
      <button type="button" className="admin-popover-footer" onClick={() => onNavigate("activity")}>Open activity feed <ArrowUpRight size={14} /></button>
    </div>
  );
}

function Sidebar({ activeSection, setActiveSection, collapsed, setCollapsed, mobileOpen, onClose, onLogout }) {
  const closeOrCollapse = () => {
    if (mobileOpen) onClose();
    else setCollapsed(!collapsed);
  };

  return <aside className={`admin-sidebar ${collapsed ? "collapsed" : ""} ${mobileOpen ? "mobile-open" : ""}`}><div className="admin-sidebar-top"><a className="admin-sidebar-brand" href="/"><BrandMark size={34} className="admin-sidebar-brand-mark" />{!collapsed ? <strong>AUREN <small>OPERATIONS</small></strong> : null}</a><button className="admin-sidebar-collapse" onClick={closeOrCollapse} aria-label={mobileOpen ? "Close navigation" : collapsed ? "Expand sidebar" : "Collapse sidebar"}>{mobileOpen ? <X size={17} /> : collapsed ? <PanelLeftOpen size={17} /> : <PanelLeftClose size={17} />}</button></div><div className="admin-workspace-switcher"><BrandMark size={30} className="admin-workspace-mark" />{!collapsed ? <span><strong>AUREN Store</strong><small>Demo workspace</small></span> : null}<ChevronDown size={14} /></div><nav className="admin-side-nav">{!collapsed ? <span className="admin-nav-label">Workspace</span> : null}{navItems.map((item) => { const Icon = item.icon; return <button className={activeSection === item.id ? "active" : ""} key={item.id} onClick={() => { setActiveSection(item.id); onClose(); }} title={item.label}><Icon size={17} /><span>{item.label}</span>{item.count && !collapsed ? <b>{item.count}</b> : null}</button>; })}</nav><div className="admin-sidebar-bottom">{!collapsed ? <div className="admin-side-help"><Sparkles size={16} /><span><strong>Portfolio mode</strong><small>Everything is simulated</small></span></div> : null}<button className="admin-sidebar-logout" onClick={onLogout} title="Sign out"><LogOut size={17} /><span>Sign out</span></button></div></aside>;
}

function Dashboard({ user, onLogout }) {
  const [summary, setSummary] = useState(null);
  const [activeSection, setActiveSection] = useState("overview");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [collapsed, setCollapsed] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [toast, setToast] = useState("");
  const [globalSearch, setGlobalSearch] = useState("");
  const [catalog, setCatalog] = useState(readStoredCatalog);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [readNotifications, setReadNotifications] = useState([]);

  useEffect(() => {
    request("/api/admin/summary").then(setSummary).catch(() => setSummary(null));
  }, []);

  useEffect(() => {
    if (!toast) return undefined;
    const timer = window.setTimeout(() => setToast(""), 3200);
    return () => window.clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    window.localStorage.setItem("auren-admin-products", JSON.stringify(catalog));
  }, [catalog]);

  const pageTitle = navItems.find((item) => item.id === activeSection)?.label ?? "Overview";
  const setSection = (section) => {
    setActiveSection(section);
    setGlobalSearch("");
    setNotificationsOpen(false);
  };
  const searchResults = useMemo(() => {
    const query = globalSearch.trim().toLowerCase();
    if (!query) return [];
    const orderResults = demoOrders.map((order) => ({
      id: order.id,
      title: order.id,
      detail: `${order.customer} · ${order.product}`,
      type: "Order",
      icon: ClipboardList,
      section: "orders",
      order,
    }));
    const productResults = catalog.map((product) => ({
      id: product.id,
      title: product.name,
      detail: `${product.category} · ${formatCurrency(product.price)}`,
      type: "Product",
      icon: Package,
      section: "products",
    }));
    const activityResults = demoActivity.map((item) => ({
      id: item.title,
      title: item.title,
      detail: item.detail,
      type: "Activity",
      icon: item.icon,
      section: "activity",
    }));
    return [...orderResults, ...productResults, ...activityResults]
      .filter((item) => `${item.title} ${item.detail}`.toLowerCase().includes(query))
      .slice(0, 8);
  }, [catalog, globalSearch]);
  const unreadCount = demoNotifications.filter((item) => !readNotifications.includes(item.id)).length;
  const handleSearchSelect = (result) => {
    setGlobalSearch("");
    if (result.order) setSelectedOrder(result.order);
    setSection(result.section);
  };
  const addProduct = (product) => setCatalog((current) => [product, ...current]);

  return <div className="admin-console">
    <Sidebar activeSection={activeSection} setActiveSection={setSection} collapsed={collapsed} setCollapsed={setCollapsed} mobileOpen={mobileNavOpen} onClose={() => setMobileNavOpen(false)} onLogout={onLogout} />
    {mobileNavOpen ? <button className="admin-mobile-backdrop" onClick={() => setMobileNavOpen(false)} aria-label="Close navigation" /> : null}
    <main className="admin-console-main">
      <header className="admin-console-topbar"><div className="admin-mobile-brand"><button aria-label="Open navigation" className="admin-mobile-menu" onClick={() => setMobileNavOpen(true)}><Menu size={18} /></button><BrandMark size={25} /><span>AUREN</span></div><div className="admin-breadcrumb"><span>Workspace</span><ChevronRight size={14} /><strong>{pageTitle}</strong></div><div className="admin-top-actions"><div className="admin-search-wrap"><label className="admin-top-search"><Search size={15} /><input value={globalSearch} onChange={(event) => setGlobalSearch(event.target.value)} placeholder="Search anything…" aria-label="Search workspace" /></label>{globalSearch.trim() ? <SearchResults results={searchResults} onSelect={handleSearchSelect} /> : null}</div><div className="admin-notification-wrap"><button className="admin-top-icon" title="Notifications" aria-label={`Notifications, ${unreadCount} unread`} aria-expanded={notificationsOpen} onClick={() => setNotificationsOpen((open) => !open)}><Bell size={17} />{unreadCount ? <i /> : null}</button>{notificationsOpen ? <NotificationPopover notifications={demoNotifications} readNotifications={readNotifications} onRead={(id) => setReadNotifications((current) => current.includes(id) ? current : [...current, id])} onMarkAll={() => setReadNotifications(demoNotifications.map((item) => item.id))} onNavigate={setSection} /> : null}</div><a className="admin-store-link" href="/"><ExternalLink size={14} /> <span>View store</span></a><div className="admin-user-chip"><span>{user.email.slice(0, 1).toUpperCase()}</span><strong>{user.email.split("@")[0]}</strong><ChevronDown size={13} /></div></div></header>
      <div className="admin-console-content">
        {activeSection === "overview" ? <Overview summary={summary} onNavigate={setSection} onSelectOrder={setSelectedOrder} /> : null}
        {activeSection === "orders" ? <OrdersView onSelect={setSelectedOrder} onToast={setToast} /> : null}
        {activeSection === "products" ? <ProductsView catalog={catalog} onAddProduct={addProduct} onToast={setToast} /> : null}
        {activeSection === "activity" ? <ActivityView /> : null}
      </div>
    </main>
    <OrderDrawer order={selectedOrder} onClose={() => setSelectedOrder(null)} />
    {toast ? <div className="admin-toast"><Check size={16} /> {toast}</div> : null}
  </div>;
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

  return <main className={`admin-shell ${user ? "admin-shell-console" : ""}`}>
    {user ? null : <a className="admin-brand" href="/"><BrandMark size={34} /><span className="admin-brand-copy">AUREN <small>/ ADMIN</small></span></a>}
    {user === undefined ? <div className="admin-loading">Loading workspace…</div> : user ? <Dashboard onLogout={handleLogout} user={user} /> : <LoginCard onLogin={loadSession} />}
  </main>;
}