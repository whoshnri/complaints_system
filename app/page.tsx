import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, EyeOff, MessageSquareText, School, ShieldCheck } from 'lucide-react';
import { redirect } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { getSessionUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const session = await getSessionUser();

  if (session) {
    redirect('/feed');
  }

  return (
    <main className="min-h-screen bg-white text-black">
      <header className="mx-auto flex w-full max-w-7xl items-center justify-between px-5 py-5 sm:px-8 lg:px-10">
        <Link href="/" className="flex items-center gap-3" aria-label="VoiceIt home">
          <Image src="/icon.svg" alt="" width={34} height={34} className="rounded-md" />
          <span className="text-2xl font-bold tracking-normal">VoiceIt</span>
        </Link>

        <nav className="hidden items-center gap-8 text-sm font-semibold text-neutral-700 md:flex">
          <a href="#how-it-works" className="hover:text-black">
            How it works
          </a>
          <a href="#privacy" className="hover:text-black">
            Privacy
          </a>
          <a href="#schools" className="hover:text-black">
            Schools
          </a>
        </nav>

        <div className="flex items-center gap-2">
          <Button asChild variant="outline" className="h-11 border-neutral-200 bg-white px-4 text-black shadow-sm hover:bg-neutral-700">
            <Link href="/login">Sign in</Link>
          </Button>
          <Button asChild className="hidden h-11 bg-black px-5 text-white shadow-sm hover:bg-neutral-800 sm:inline-flex">
            <Link href="/signup">Get started</Link>
          </Button>
        </div>
      </header>

      <section className="mx-auto grid w-full max-w-7xl items-center gap-10 px-5 pb-12 pt-10 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:px-10 lg:pb-16 lg:pt-12">
        <div className="max-w-2xl">
          

          <h1 className="mt-7 text-5xl font-bold leading-[0.95] tracking-normal text-black sm:text-6xl lg:text-7xl">
            Anonymous school feedback
          </h1>

          <p className="mt-7 max-w-xl text-lg font-semibold leading-7 text-neutral-600">
            VoiceIt gives students a private place to raise complaints, follow school conversations, and support the issues that need attention.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" className="h-12 bg-black px-6 text-white shadow-sm hover:bg-neutral-800">
              <Link href="/signup">
                Create account
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="h-12 border-neutral-200 bg-white px-6 text-black shadow-sm hover:bg-neutral-50">
              <Link href="/login">Sign in</Link>
            </Button>
          </div>
        </div>

        <div className="relative min-h-[460px] overflow-hidden rounded-[2rem] bg-neutral-950 lg:min-h-[620px]">
          <Image
            src="/landing-campus-feedback.png"
            alt="Students reviewing feedback together on campus"
            fill
            priority
            sizes="(min-width: 1024px) 58vw, 100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/10" />

          
          <div className="absolute bottom-6 left-4 right-4 rounded-2xl bg-black/72 p-4 text-white shadow-2xl backdrop-blur-md sm:bottom-10 sm:left-auto sm:right-10 sm:w-[360px]">
            <div className="flex items-center justify-between border-b border-white/15 pb-3">
              <p className="text-sm font-bold">Student reports</p>
              <p className="text-xs font-semibold text-white/60">Live feed</p>
            </div>
            <div className="space-y-3 py-4 text-sm">
              <div className="flex items-center justify-between gap-4">
                <span className="font-semibold">Anonymous complaint</span>
                <span className="rounded-full bg-white/12 px-2 py-1 text-xs text-white/80">Open</span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="font-semibold">School conversation</span>
                <span className="rounded-full bg-white/12 px-2 py-1 text-xs text-white/80">Active</span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="font-semibold">Student support</span>
                <span className="rounded-full bg-white/12 px-2 py-1 text-xs text-white/80">Rising</span>
              </div>
            </div>
            {/* <div className="rounded-full bg-white px-4 py-3 text-center text-xs font-bold text-black">
              Raise a complaint without revealing your name
            </div> */}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="border-t border-neutral-200 bg-neutral-50 px-5 py-10 sm:px-8 lg:px-10">
        <div className="mx-auto grid max-w-7xl gap-4 md:grid-cols-3">
          <div id="privacy" className="rounded-lg border border-neutral-200 bg-white p-5">
            <EyeOff className="mb-5 size-6" />
            <h2 className="text-lg font-bold">Post privately</h2>
            <p className="mt-2 text-sm leading-6 text-neutral-600">Share what happened without attaching your identity to the complaint.</p>
          </div>
          <div id="schools" className="rounded-lg border border-neutral-200 bg-white p-5">
            <School className="mb-5 size-6" />
            <h2 className="text-lg font-bold">Follow schools</h2>
            <p className="mt-2 text-sm leading-6 text-neutral-600">Keep your feed focused on the institutions and issues that matter to you.</p>
          </div>
          <div className="rounded-lg border border-neutral-200 bg-white p-5">
            <MessageSquareText className="mb-5 size-6" />
            <h2 className="text-lg font-bold">Support issues</h2>
            <p className="mt-2 text-sm leading-6 text-neutral-600">Upvote complaints and join discussions so repeated problems are easier to see.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
