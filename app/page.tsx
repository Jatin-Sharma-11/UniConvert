import Dropzone from "@/components/dropzone";

export default function Home() {
  return (
    <div className="space-y-16 pb-8">
      {/* Hero Section */}
      <div className="space-y-6 text-center pt-10">
        <h1 className="text-3xl md:text-5xl font-bold tracking-tighter">
          Convert files <span className="text-primary">without limits</span>
        </h1>
        <p className="text-muted-foreground md:text-xl max-w-2xl mx-auto px-4">
          Free, unlimited file converter running entirely in your browser.
          No server uploads, complete privacy.
        </p>
      </div>

      {/* Dropzone Section */}
      <Dropzone />
    </div>
  );
}
