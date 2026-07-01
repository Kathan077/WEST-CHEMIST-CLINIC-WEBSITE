import Link from "next/link";
import "./not-found.css";

export default function NotFound() {
  return (
    <div className="nf_container">
      {/* Background blobs */}
      <div className="nf_bg_shapes" aria-hidden="true">
        <div className="nf_shape nf_shape_1"></div>
        <div className="nf_shape nf_shape_2"></div>
      </div>

      {/* Main Art & 404 Display */}
      <div className="nf_art_box">
        <h1 className="nf_number">404</h1>
      </div>

      {/* Content */}
      <div className="nf_content">
        <h2 className="nf_title">Page Not Found</h2>
        <p className="nf_desc">
          We couldn't find the page you are looking for. It might have been moved, deleted, or the URL might be incorrect.
        </p>

        {/* Action Buttons */}
        <div className="nf_actions">
          <Link href="/" className="nf_btn nf_btn_primary">
            <span>Return Home</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </Link>
          <Link href="/services" className="nf_btn nf_btn_secondary">
            <span>Our Services</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
