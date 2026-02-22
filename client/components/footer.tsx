"use client"

export function Footer() {
  return (
    <footer className="border-t border-wellness-accent/20 mt-12 py-8 bg-white/30">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <p className="text-center text-muted-foreground mb-4">Take a breath, you&apos;re doing great.</p>
        <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
          <a href="#" className="hover:text-wellness-primary transition">
            About
          </a>
          <span>•</span>
          <a href="#" className="hover:text-wellness-primary transition">
            Privacy
          </a>
          <span>•</span>
          <a href="#" className="hover:text-wellness-primary transition">
            Support
          </a>
        </div>
      </div>
    </footer>
  )
}
