import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Assurances from "./components/Assurances";
import ProductGrid from "./components/ProductGrid";
import Footer from "./components/Footer";
import CartDrawer from "./components/CartDrawer";
import CheckoutModal from "./components/CheckoutModal";
import CustomCursor from "./components/CustomCursor";
import ProductConfigurator from "./components/ProductConfigurator";

export default function App() {
  return (
    <main className="min-h-screen bg-slate-950 font-sans text-slate-50 antialiased selection:bg-cyan-300/30">
      <CustomCursor />
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
