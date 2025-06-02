"use client";

import Link from "next/link";
import { FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";

export default function Footer() {
  return (
    <footer
      className="border-t"
      style={{
        borderColor: "var(--color-border)",
        backgroundColor: "var(--color-background)",
        color: "var(--color-foreground)",
        fontFamily: "var(--font-sans)",
      }}
    >
      <div
        className="mx-auto max-w-7xl px-6 py-12 sm:flex sm:items-center sm:justify-between lg:px-8"
        style={{ color: "var(--color-foreground)" }}
      >
        {/* Left: App name + tagline */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
          <h2
            className="text-lg font-semibold"
            style={{ color: "var(--color-primary)" }}
          >
            Invoicedpedia
          </h2>
          <span
            className="mt-1 text-sm"
            style={{ color: "var(--color-muted-foreground)" }}
          >
            AI-powered invoicing made simple.
          </span>
        </div>

        {/* Navigation */}
        <nav className="mt-6 flex flex-wrap justify-center gap-x-6 gap-y-2 sm:mt-0 sm:justify-end">
          {[
            { name: "Home", href: "#" },
            { name: "Features", href: "#" },
            { name: "Pricing", href: "#" },
            { name: "Docs", href: "#" },
            { name: "Support", href: "#" },
          ].map(({ name, href }) => (
            <a
              key={name}
              href={href}
              className="text-sm font-medium transition-colors duration-300"
              style={{ color: "var(--color-muted-foreground)" }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.color = "var(--color-primary)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = "var(--color-muted-foreground)")
              }
            >
              {name}
            </a>
          ))}
        </nav>
      </div>

      {/* Bottom bar */}
      <div
        className="border-t py-6 text-center text-sm flex flex-col sm:flex-row items-center justify-between max-w-7xl mx-auto px-6"
        style={{
          borderColor: "var(--color-border)",
          color: "var(--color-muted-foreground)",
          fontFamily: "var(--font-mono)",
        }}
      >
        <p className="mb-3 sm:mb-0">
          &copy; {new Date().getFullYear()} Invoicedpedia. All rights reserved.
        </p>

        <div className="flex items-center space-x-6">
          <p className="mr-4 whitespace-nowrap">
            Made by <Link className="hover:text-[#F5991B]" href="https://sidharth-sangelia.vercel.app/">Sidharth</Link>{" "}
            <span role="img" aria-label="sparkles">
              ✨
            </span>{" "}
            <span role="img" aria-label="robot">
              🤖
            </span>{" "}
            with Next.js, Xata & Clerk
          </p>

          {/* Social Icons */}
          <div className="flex space-x-4">
            <Link
              href="https://github.com/sidharthsangelia"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="text-muted-foreground hover:text-primary transition-colors duration-300"
              style={{ color: "var(--color-muted-foreground)", fontSize: "1.25rem" }}
            >
              <FaGithub />
            </Link>
            <Link
              href="https://www.linkedin.com/in/sidharth-sangelia/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="text-muted-foreground hover:text-primary transition-colors duration-300"
              style={{ color: "var(--color-muted-foreground)", fontSize: "1.25rem" }}
            >
              <FaLinkedin />
            </Link>
            <Link
              href="https://x.com/Sidharth_1503"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="X"
              className="text-muted-foreground hover:text-primary transition-colors duration-300"
              style={{ color: "var(--color-muted-foreground)", fontSize: "1.25rem" }}
            >
              <FaTwitter />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
