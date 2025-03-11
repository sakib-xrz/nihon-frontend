import Information from "@/components/Information";
import NavSearch from "@/components/NavSearch";
import ResPonsiveSearch from "@/components/ResPonsiveSearch";
import "../style/navigation.css";
import Link from "next/link";

export default function Navigation() {
  return (
    <div
      style={{
        background: "#F9A8D4",
        position: "sticky",
        top: "0",
        zIndex: "1000",
      }}
    >
      <div style={{ width: "90%", margin: "0 auto", padding: "25px 0" }}>
        <div
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <h3 style={{ fontSize: "30px", color: "white" }}>LOGO</h3>
          {/* Show NavSearch only on medium and larger screens */}
          <div
            className="desktopSearch"
            style={{ width: "70%", margin: "0 auto" }}
          >
            <NavSearch />
          </div>
          <div>
            <Information />
          </div>
        </div>
        <div className="mx-auto mt-2 desktopMenu">
          <ul className="py-2">
            <li>
              <Link className="link" prefetch={false} href="/">
                Home
              </Link>
            </li>
            <li>
              <Link className="link" prefetch={false} href="/product">
                Shop
              </Link>
            </li>
            <li>
              <Link className="link" prefetch={false} href="/category">
                Category
              </Link>
            </li>
            <li>
              <Link className="link" prefetch={false} href="/contact-us">
                ContactUs
              </Link>
            </li>
          </ul>
        </div>
        {/* Show ResPonsiveSearch only on small screens */}
        <div className="mobieSearch" style={{ width: "95%", margin: "0 auto" }}>
          <ResPonsiveSearch />
        </div>
      </div>
    </div>
  );
}
