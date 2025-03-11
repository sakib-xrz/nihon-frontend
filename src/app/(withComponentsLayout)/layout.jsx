import Footer from "@/common/Footer";
import Navigation from "@/common/Navigation";

export default function CommonLayout({ children }) {
    return (
        <div>
            <Navigation />
            <div className="min-h-screen">
                {children}
            </div>
            <Footer />
        </div>
    )
}