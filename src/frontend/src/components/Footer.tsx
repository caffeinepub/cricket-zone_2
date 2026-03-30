import { Link } from "@tanstack/react-router";
import { Flame } from "lucide-react";
import { SiFacebook, SiInstagram, SiX, SiYoutube } from "react-icons/si";

export default function Footer() {
  const year = new Date().getFullYear();
  const hostname =
    typeof window !== "undefined" ? window.location.hostname : "";

  return (
    <footer className="bg-navbar border-t border-border mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Brand */}
          <div className="flex flex-col items-center md:items-start gap-3">
            <div className="flex items-center gap-2">
              <img
                src="/assets/generated/cricket-zone-logo-transparent.dim_120x120.png"
                alt="Cricket Zone"
                className="h-8 w-8 object-contain"
              />
              <span className="font-bold text-lg text-foreground">
                Cricket<span className="text-primary">Zone</span>
              </span>
            </div>
            <p className="text-xs text-muted-foreground text-center md:text-left max-w-xs">
              Your ultimate destination for IPL live streaming and on-demand
              cricket content.
            </p>
            <p className="text-xs text-muted-foreground">
              🤝 Partnered with IPL 2024
            </p>
          </div>

          {/* Links */}
          <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            {["About", "Careers", "Support", "Terms", "Privacy"].map(
              (label) => (
                <a
                  key={label}
                  href="/"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  data-ocid="footer.link"
                >
                  {label}
                </a>
              ),
            )}
          </nav>

          {/* Social */}
          <div className="flex items-center gap-4">
            {[
              { Icon: SiX, label: "X" },
              { Icon: SiInstagram, label: "Instagram" },
              { Icon: SiYoutube, label: "YouTube" },
              { Icon: SiFacebook, label: "Facebook" },
            ].map(({ Icon, label }) => (
              <a
                key={label}
                href="/"
                aria-label={label}
                className="text-muted-foreground hover:text-primary transition-colors"
                data-ocid="footer.link"
              >
                <Icon className="h-5 w-5" />
              </a>
            ))}
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-border text-center">
          <p className="text-xs text-muted-foreground">
            © {year}. Built with ❤️ using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
