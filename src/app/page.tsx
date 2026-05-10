import Link from 'next/link';

export default function LandingPage() {
  return (
      <div>
        {/* Hero Section */}
        <section className="max-w-6xl mx-auto px-4 py-24 text-center">
          <div className="inline-block bg-blue-500/10 border border-blue-500/30 text-blue-400 text-sm px-4 py-1.5 rounded-full mb-6">
            Inspired by The Seed from Sword Art Online
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Build Your Own
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
            {' '}AI Companion
          </span>
          </h1>

          <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
            Create, customize, and share AI chatbots with unique personalities.
            No coding required. Just your imagination.
          </p>

          <div className="flex gap-4 justify-center flex-wrap">
            <Link
                href="/bot/new"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition"
            >
              Create Your AI →
            </Link>
            <Link
                href="/explore"
                className="bg-gray-800 hover:bg-gray-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition"
            >
              Explore Bots
            </Link>
          </div>
          <p className="text-gray-600 text-sm mt-6">Free to start · No credit card required</p>
        </section>

        {/* How It Works */}
        <section className="max-w-6xl mx-auto px-4 py-16">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Create',
                description: 'Give your bot a name, personality, and backstory. No coding needed.',
                icon: '🌱',
              },
              {
                step: '02',
                title: 'Customize',
                description: 'Fine-tune personality with sliders. Add rules, backstory, and conversation starters.',
                icon: '🎨',
              },
              {
                step: '03',
                title: 'Share',
                description: 'Get a shareable link. Anyone can chat with your bot — no account needed.',
                icon: '🚀',
              },
            ].map(({ step, title, description, icon }) => (
                <div key={step} className="bg-gray-900 border border-gray-800 rounded-xl p-8 text-center">
                  <div className="text-4xl mb-4">{icon}</div>
                  <div className="text-blue-400 text-sm font-medium mb-2">Step {step}</div>
                  <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
                  <p className="text-gray-400">{description}</p>
                </div>
            ))}
          </div>
        </section>

        {/* Features */}
        <section className="max-w-6xl mx-auto px-4 py-16">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Everything You Need
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: '🧠', title: 'Personality Sliders', desc: 'Control humor, empathy, formality, energy, and creativity with simple sliders.' },
              { icon: '💬', title: 'Streaming Chat', desc: 'Responses appear word by word, just like a real conversation.' },
              { icon: '🔗', title: 'Shareable Links', desc: 'Every bot gets a unique URL. Share it anywhere — no account needed to chat.' },
              { icon: '❤️', title: 'Like & Discover', desc: 'Explore bots created by the community. Like your favorites.' },
              { icon: '🔒', title: 'Public or Private', desc: 'Keep your bot to yourself or share it with the world.' },
              { icon: '⚡', title: 'Fast AI Models', desc: 'Powered by open-source LLaMA models. Fast, capable, no censorship.' },
            ].map(({ icon, title, desc }) => (
                <div key={title} className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                  <div className="text-3xl mb-3">{icon}</div>
                  <h3 className="text-white font-semibold mb-2">{title}</h3>
                  <p className="text-gray-400 text-sm">{desc}</p>
                </div>
            ))}
          </div>
        </section>

        {/* Pricing Preview */}
        <section className="max-w-4xl mx-auto px-4 py-16 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Simple Pricing</h2>
          <p className="text-gray-400 mb-8">Start free. No credit card required.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[
              { name: 'Free', price: '$0', features: ['1 bot', '30 msgs/day'] },
              { name: 'Pro', price: '$9/mo', features: ['5 bots', 'Unlimited msgs'], popular: true },
              { name: 'Creator', price: '$19/mo', features: ['Unlimited bots', 'Unlimited msgs'] },
            ].map(({ name, price, features, popular }) => (
                <div
                    key={name}
                    className={`bg-gray-900 border rounded-xl p-6 ${popular ? 'border-blue-500' : 'border-gray-800'}`}
                >
                  {popular && <p className="text-blue-400 text-xs font-medium mb-2">MOST POPULAR</p>}
                  <h3 className="text-white font-bold text-lg">{name}</h3>
                  <p className="text-2xl font-bold text-white my-2">{price}</p>
                  <div className="space-y-1">
                    {features.map((f) => (
                        <p key={f} className="text-gray-400 text-sm">✓ {f}</p>
                    ))}
                  </div>
                </div>
            ))}
          </div>
          <Link
              href="/pricing"
              className="text-blue-400 hover:text-blue-300 text-sm transition"
          >
            See full pricing details →
          </Link>
        </section>

        {/* CTA */}
        <section className="max-w-4xl mx-auto px-4 py-20 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to Build Your AI Companion?
          </h2>
          <p className="text-gray-400 mb-8">
            Join the community. Create your first bot in minutes.
          </p>
          <Link
              href="/auth/signup"
              className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-xl font-semibold text-lg transition"
          >
            Get Started Free →
          </Link>
        </section>
      </div>
  );
}