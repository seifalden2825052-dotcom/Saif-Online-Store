import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Assurances from "./components/Assurances";
import ProductGrid from "./components/ProductGrid";
import Footer from "./components/Footer";
import CartDrawer from "./components/CartDrawer";
import CheckoutModal from "./components/CheckoutModal";
import ProductConfigurator from "./components/ProductConfigurator";
import { useThemeSync } from "./store/theme";

export default function App() {
  useThemeSync();

  return (
    <main className="min-h-screen bg-bg font-sans text-ink antialiased selection:bg-neon/20">
      <Navbar />
      <Hero />
      <Assurances />
      <ProductGrid />
      <Footer />
      <CartDrawer />
      <ProductConfigurator />
      <CheckoutModal />
    </main>
  );
}
