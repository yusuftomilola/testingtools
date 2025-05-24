import Link from "next/link";
import { ArrowRight, Github, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Footer } from "@/components/footer";

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/30">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                  About ScavTools
                </h1>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  Building the ultimate toolkit for modern developers
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="w-full py-12 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2 max-w-3xl">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                  Our Mission
                </h2>
                <p className="text-muted-foreground text-lg">
                  Our mission is to provide high-quality, browser-based tools
                  that streamline developers' workflows and boost productivity.
                </p>
                <p className="text-muted-foreground mt-4">
                  We believe that developers shouldn't have to install dozens of
                  applications or browser extensions to get their work done.
                  That's why we've created ScavTools — a comprehensive suite of
                  development utilities accessible from any browser, anywhere,
                  anytime.
                </p>
                <p className="text-muted-foreground mt-4">
                  From frontend helpers to blockchain tools, our goal is to
                  create a one-stop platform that caters to the diverse needs of
                  modern developers, saving them time and enhancing their
                  productivity.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Our Story Section */}
        <section className="w-full py-12 md:py-24 bg-muted/20">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-10">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                Our Story
              </h2>
              <p className="mx-auto max-w-[600px] text-muted-foreground">
                The journey of ScavTools from concept to reality
              </p>
            </div>

            <div className="max-w-3xl mx-auto">
              {/* Timeline */}
              <div className="space-y-8">
                <div className="relative pl-8 border-l border-muted-foreground/20">
                  <div className="absolute left-0 top-0 flex items-center justify-center w-6 h-6 rounded-full bg-primary -translate-x-1/2">
                    <div className="w-2 h-2 rounded-full bg-primary-foreground"></div>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold">The Idea (2022)</h3>
                    <p className="text-muted-foreground">
                      Frustrated by having to install multiple tools and browser
                      extensions, our founder envisioned a platform where
                      developers could access all the utilities they need in one
                      place.
                    </p>
                  </div>
                </div>

                <div className="relative pl-8 border-l border-muted-foreground/20">
                  <div className="absolute left-0 top-0 flex items-center justify-center w-6 h-6 rounded-full bg-primary -translate-x-1/2">
                    <div className="w-2 h-2 rounded-full bg-primary-foreground"></div>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold">
                      Development Begins (2023)
                    </h3>
                    <p className="text-muted-foreground">
                      With a clear vision in mind, development of ScavTools
                      began. The initial focus was on creating a solid
                      foundation with a few essential tools that developers use
                      daily.
                    </p>
                  </div>
                </div>

                <div className="relative pl-8 border-l border-muted-foreground/20">
                  <div className="absolute left-0 top-0 flex items-center justify-center w-6 h-6 rounded-full bg-primary -translate-x-1/2">
                    <div className="w-2 h-2 rounded-full bg-primary-foreground"></div>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold">Beta Launch (2023)</h3>
                    <p className="text-muted-foreground">
                      ScavTools launched in beta with a handful of core tools.
                      The response from early users was overwhelmingly positive,
                      validating our vision and providing valuable feedback.
                    </p>
                  </div>
                </div>

                <div className="relative pl-8">
                  <div className="absolute left-0 top-0 flex items-center justify-center w-6 h-6 rounded-full bg-primary -translate-x-1/2">
                    <div className="w-2 h-2 rounded-full bg-primary-foreground"></div>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold">Today & Beyond</h3>
                    <p className="text-muted-foreground">
                      Today, ScavTools continues to grow with new tools and
                      features being added regularly. Our roadmap includes
                      expanding our blockchain tools, adding more backend
                      utilities, and creating a vibrant community of developers.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="w-full py-12 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-10">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                Meet the Team
              </h2>
              <p className="mx-auto max-w-[600px] text-muted-foreground">
                The people behind ScavTools
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {/* Team Member 1 */}
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="h-32 w-32 rounded-full bg-muted overflow-hidden">
                  <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-muted-foreground">
                    JS
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold">John Smith</h3>
                  <p className="text-muted-foreground">
                    Founder & Lead Developer
                  </p>
                </div>
                <p className="text-sm text-muted-foreground">
                  Full-stack developer with a passion for creating tools that
                  make developers' lives easier.
                </p>
              </div>

              {/* Team Member 2 */}
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="h-32 w-32 rounded-full bg-muted overflow-hidden">
                  <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-muted-foreground">
                    AJ
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold">Alice Johnson</h3>
                  <p className="text-muted-foreground">Frontend Lead</p>
                </div>
                <p className="text-sm text-muted-foreground">
                  UI/UX specialist with a keen eye for design and user
                  experience.
                </p>
              </div>

              {/* Team Member 3 */}
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="h-32 w-32 rounded-full bg-muted overflow-hidden">
                  <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-muted-foreground">
                    RB
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold">Robert Brown</h3>
                  <p className="text-muted-foreground">Blockchain Specialist</p>
                </div>
                <p className="text-sm text-muted-foreground">
                  StarkNet expert focused on building powerful blockchain tools
                  for developers.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Technology Stack */}
        <section className="w-full py-12 md:py-24 bg-muted/30">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-10">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                Our Technology Stack
              </h2>
              <p className="mx-auto max-w-[600px] text-muted-foreground">
                The powerful technologies behind ScavTools
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {/* Frontend */}
              <div className="flex flex-col p-6 rounded-xl border bg-card">
                <h3 className="text-xl font-bold mb-4">Frontend</h3>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-primary mr-2"></div>
                    <span>Next.js - React framework for production</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-primary mr-2"></div>
                    <span>React - UI component library</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-primary mr-2"></div>
                    <span>TailwindCSS - Utility-first CSS framework</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-primary mr-2"></div>
                    <span>TypeScript - Type-safe JavaScript</span>
                  </li>
                </ul>
              </div>

              {/* Backend */}
              <div className="flex flex-col p-6 rounded-xl border bg-card">
                <h3 className="text-xl font-bold mb-4">Backend</h3>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-primary mr-2"></div>
                    <span>NestJS - Progressive Node.js framework</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-primary mr-2"></div>
                    <span>PostgreSQL - Advanced open source database</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-primary mr-2"></div>
                    <span>TypeORM - ORM for TypeScript and JavaScript</span>
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-primary mr-2"></div>
                    <span>
                      StarkNet - Layer 2 scaling solution for Ethereum
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="w-full py-12 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-10">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                Our Values
              </h2>
              <p className="mx-auto max-w-[600px] text-muted-foreground">
                The principles that guide everything we do
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {/* Value 1 */}
              <div className="flex flex-col p-6 rounded-xl border bg-card">
                <h3 className="text-xl font-bold mb-2">
                  Developer-First Approach
                </h3>
                <p className="text-muted-foreground">
                  We build tools with developers in mind, focusing on what makes
                  their workflow more efficient and enjoyable.
                </p>
              </div>

              {/* Value 2 */}
              <div className="flex flex-col p-6 rounded-xl border bg-card">
                <h3 className="text-xl font-bold mb-2">Security and Privacy</h3>
                <p className="text-muted-foreground">
                  We prioritize the security of our users' data and ensure that
                  all tools operate with privacy in mind.
                </p>
              </div>

              {/* Value 3 */}
              <div className="flex flex-col p-6 rounded-xl border bg-card">
                <h3 className="text-xl font-bold mb-2">Open Collaboration</h3>
                <p className="text-muted-foreground">
                  We believe in the power of community and welcome contributions
                  from developers around the world.
                </p>
              </div>

              {/* Value 4 */}
              <div className="flex flex-col p-6 rounded-xl border bg-card">
                <h3 className="text-xl font-bold mb-2">
                  Continuous Improvement
                </h3>
                <p className="text-muted-foreground">
                  We are committed to constantly improving our tools based on
                  user feedback and technological advancements.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="w-full py-12 md:py-24 bg-muted/20">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-10">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                Get in Touch
              </h2>
              <p className="mx-auto max-w-[600px] text-muted-foreground">
                Have questions or feedback? We'd love to hear from you.
              </p>
            </div>

            <div className="flex flex-col items-center justify-center space-y-4 max-w-md mx-auto">
              <div className="w-full p-6 rounded-xl border bg-card">
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-primary"
                    >
                      <path d="M22 17a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9.5C2 7 4 5 6.5 5H18c2.2 0 4 1.8 4 4v8Z" />
                      <polyline points="15,9 18,9 18,11" />
                      <path d="M6.5 5C9 5 11 7 11 9.5V17a2 2 0 0 1-2 2v0" />
                      <line x1="6" x2="7" y1="10" y2="10" />
                    </svg>
                    <a
                      href="mailto:contact@scavtools.com"
                      className="text-primary hover:underline"
                    >
                      contact@scavtools.com
                    </a>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Github className="text-primary" />
                    <a
                      href="https://github.com/scavtools"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      github.com/scavtools
                    </a>
                  </div>
                  <div className="flex items-center space-x-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-primary"
                    >
                      <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                    </svg>
                    <a
                      href="https://twitter.com/scavtools"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      @scavtools
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Join Us Section */}
        <section className="w-full py-16 md:py-24 bg-primary text-primary-foreground">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center text-center space-y-6 max-w-3xl mx-auto">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary-foreground/10">
                <Users className="h-8 w-8" />
              </div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Ready to streamline your development workflow?
              </h2>
              <p className="text-xl text-primary-foreground/80">
                Join 500+ developers who are already using ScavTools to boost
                their productivity.
              </p>
              <Button
                asChild
                size="lg"
                variant="secondary"
                className="text-lg px-8 py-6 h-auto font-semibold"
              >
                <Link href="/register">
                  Create a Free Account
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}
