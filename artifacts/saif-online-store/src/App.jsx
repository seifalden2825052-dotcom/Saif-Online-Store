import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import BrandStory from "./components/BrandStory";
import Assurances from "./components/Assurances";
import ProductGrid from "./components/ProductGrid";
import Footer from "./components/Footer";
import CartDrawer from "./components/CartDrawer";
import CheckoutModal from "./components/CheckoutModal";
import ProductConfigurator from "./components/ProductConfigurator";
import SearchOverlay from "./components/SearchOverlay";
import { useThemeSync } from "./store/theme";

export default function App() {
  useThemeSync();

  return (
    <main className="min-h-[100dvh] bg-bg font-sans text-ink antialiased selection:bg-neon/20">
      <Navbar />
      <Hero />
      <ProductGrid />
      <BrandStory />
      <Assurances />
      <Footer />
      <CartDrawer />
      <ProductConfigurator />
      <CheckoutModal />
      <SearchOverlay />
    </main>
  );
}