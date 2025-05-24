import Link from "next/link";

export function Footer() {
  return (
    <footer className="w-full border-t py-6">
      <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
        <p className="text-center text-sm text-muted-foreground md:text-left">
          &copy; {new Date().getFullYear()} ScavTools. All rights reserved.
        </p>
        <nav className="flex gap-4 text-sm">
          <Link href="/about" className="text-muted-foreground hover:underline">
            About
          </Link>
          <Link
            href="/privacy-policy"
            className="text-muted-foreground hover:underline"
          >
            Privacy
          </Link>
          <Link href="/terms" className="text-muted-foreground hover:underline">
            Terms
          </Link>
          <Link
            href="/contact"
            className="text-muted-foreground hover:underline"
          >
            Contact
          </Link>
        </nav>
      </div>
    </footer>
  );
}
