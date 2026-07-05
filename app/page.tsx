import Link from 'next/link'
import HeroCanvas from '@/components/hero/HeroCanvas'

const HOW_IT_WORKS = [
  {
    step: '01',
    title: 'Drop your notes',
    desc: 'Upload PDFs, Word docs, slides, or even photos of handwritten pages. Optionally add your KTU syllabus and past papers.',
  },
  {
    step: '02',
    title: 'We do the heavy lifting',
    desc: 'PallyME reads everything, maps it to your modules, hunts for repeat exam patterns, and generates flashcards — in under a minute.',
  },
  {
    step: '03',
    title: 'Walk into your exam ready',
    desc: 'Get clean short notes by module, 3D flip flashcards, and a ranked list of questions most likely to repeat. No guesswork.',
  },
]

export default function LandingPage() {
  return (
    <main
      style={{
        minHeight: '100vh',
        background: 'var(--ink-950)',
        overflowX: 'hidden',
      }}
    >
      {/* ── Nav ──────────────────────────────────────────────────────────── */}
      <nav
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          padding: '0 24px',
          height: 60,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(10, 14, 26, 0.85)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(111, 227, 214, 0.07)',
        }}
      >
        <div
          style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 700,
            fontSize: '1.15rem',
            letterSpacing: '-0.02em',
            color: 'var(--paper-100)',
          }}
        >
          Pally<span style={{ color: 'var(--brass-400)' }}>ME</span>
        </div>
        <Link href="/workspace" className="btn-primary" style={{ padding: '8px 20px', fontSize: '0.85rem' }}>
          Get started
        </Link>
      </nav>

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section
        className="blueprint-grid"
        style={{
          minHeight: '100vh',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          alignItems: 'center',
          gap: 0,
          paddingTop: 60,
        }}
      >
        {/* Left: copy */}
        <div
          style={{
            padding: 'clamp(40px, 8vw, 100px) clamp(24px, 5vw, 80px)',
            display: 'flex',
            flexDirection: 'column',
            gap: 28,
          }}
        >
          {/* Eyebrow */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '6px 14px',
              borderRadius: 20,
              border: '1px solid rgba(111, 227, 214, 0.2)',
              background: 'rgba(111, 227, 214, 0.06)',
              width: 'fit-content',
            }}
          >
            <span
              style={{
                width: 7,
                height: 7,
                borderRadius: '50%',
                background: 'var(--blueprint-300)',
                animation: 'pulse-dot 2s ease-in-out infinite',
                display: 'block',
              }}
            />
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.7rem',
                color: 'var(--blueprint-300)',
                letterSpacing: '0.06em',
              }}
            >
              Built for KTU engineering students
            </span>
          </div>

          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
              fontSize: 'clamp(2.4rem, 4.5vw, 3.6rem)',
              lineHeight: 1.1,
              letterSpacing: '-0.03em',
              color: 'var(--paper-100)',
              margin: 0,
            }}
          >
            Notes in.
            <br />
            <span
              style={{
                background: 'linear-gradient(135deg, var(--brass-400), var(--blueprint-300))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Exam-ready out.
            </span>
          </h1>

          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'clamp(0.95rem, 1.5vw, 1.1rem)',
              color: 'var(--paper-200)',
              lineHeight: 1.7,
              maxWidth: 460,
              margin: 0,
            }}
          >
            Upload your KTU class notes and PallyME turns them into clean short
            notes, 3D flashcards, and a ranked list of questions most likely to
            repeat — powered by AI, organized by module.
          </p>

          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <Link href="/workspace" className="btn-primary">
              Simplify my notes →
            </Link>
            <a href="#how-it-works" className="btn-secondary">
              See how it works
            </a>
          </div>

          {/* Social proof */}
          <div
            style={{
              display: 'flex',
              gap: 24,
              flexWrap: 'wrap',
              paddingTop: 8,
            }}
          >
            {[
              { val: '5 min', label: 'avg. processing time' },
              { val: '5 modules', label: 'perfectly organized' },
              { val: 'Zero', label: 'all-nighters needed' },
            ].map((stat) => (
              <div key={stat.label}>
                <p
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '1.4rem',
                    fontWeight: 700,
                    color: 'var(--brass-400)',
                    margin: 0,
                    lineHeight: 1,
                  }}
                >
                  {stat.val}
                </p>
                <p
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.75rem',
                    color: 'var(--muted-300)',
                    margin: '4px 0 0',
                  }}
                >
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Right: 3D hero */}
        <div
          style={{
            height: '100vh',
            maxHeight: 700,
            position: 'relative',
          }}
          aria-label="Animated notes assembling into flashcards"
          aria-hidden
        >
          <HeroCanvas />
        </div>
      </section>

      {/* ── How it works ─────────────────────────────────────────────────── */}
      <section
        id="how-it-works"
        style={{
          padding: 'clamp(60px, 10vw, 120px) clamp(24px, 8vw, 100px)',
          maxWidth: 1100,
          margin: '0 auto',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <p
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.75rem',
              color: 'var(--blueprint-300)',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              marginBottom: 12,
            }}
          >
            The workflow
          </p>
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.8rem, 3vw, 2.6rem)',
              fontWeight: 700,
              color: 'var(--paper-100)',
              margin: 0,
            }}
          >
            Three steps. Zero chaos.
          </h2>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: 20,
          }}
        >
          {HOW_IT_WORKS.map((item, i) => (
            <div
              key={item.step}
              className="glass-card"
              style={{
                padding: '28px 24px',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Background step number */}
              <div
                aria-hidden
                style={{
                  position: 'absolute',
                  top: -10,
                  right: 16,
                  fontFamily: 'var(--font-display)',
                  fontSize: '5rem',
                  fontWeight: 800,
                  color: 'rgba(111, 227, 214, 0.04)',
                  lineHeight: 1,
                  userSelect: 'none',
                }}
              >
                {item.step}
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  marginBottom: 14,
                }}
              >
                <div className="module-badge" style={{ width: 36, height: 36, fontSize: '0.6rem' }}>
                  {item.step}
                </div>
                <div
                  style={{
                    flex: 1,
                    height: 1,
                    background: 'rgba(217, 164, 65, 0.25)',
                  }}
                  aria-hidden
                />
              </div>

              <h3
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  color: 'var(--paper-100)',
                  marginBottom: 10,
                }}
              >
                {item.title}
              </h3>
              <p
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.875rem',
                  color: 'var(--muted-300)',
                  lineHeight: 1.65,
                  margin: 0,
                }}
              >
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Bottom CTA ───────────────────────────────────────────────────── */}
      <section
        className="blueprint-grid-dense"
        style={{
          padding: 'clamp(60px, 8vw, 100px) 24px',
          textAlign: 'center',
          borderTop: '1px solid rgba(111, 227, 214, 0.06)',
        }}
      >
        <p
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.75rem',
            color: 'var(--muted-400)',
            letterSpacing: '0.1em',
            marginBottom: 16,
          }}
        >
          Ready when you are
        </p>
        <h2
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1.6rem, 3vw, 2.4rem)',
            fontWeight: 700,
            color: 'var(--paper-100)',
            marginBottom: 12,
          }}
        >
          Your KTU study pal,
          <br />
          <span style={{ color: 'var(--brass-400)' }}>minus the all-nighters.</span>
        </h2>
        <p
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.95rem',
            color: 'var(--muted-300)',
            marginBottom: 32,
            maxWidth: 480,
            margin: '0 auto 32px',
          }}
        >
          No account. No credit card. Just upload and go.
        </p>
        <Link href="/workspace" className="btn-primary" style={{ fontSize: '1rem', padding: '16px 36px' }}>
          Start studying smarter →
        </Link>
      </section>

      <style>{`
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }

        @media (max-width: 768px) {
          section:first-of-type {
            grid-template-columns: 1fr !important;
          }
          section:first-of-type > div:last-child {
            display: none !important;
          }
        }
      `}</style>
    </main>
  )
}
