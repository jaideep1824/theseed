interface PricingCardProps {
    name: string;
    price: number | null;
    description: string;
    features: string[];
    isCurrent?: boolean;
    isPopular?: boolean;
    onUpgrade?: () => void;
    upgrading?: boolean;
}

export default function PricingCard({
                                        name,
                                        price,
                                        description,
                                        features,
                                        isCurrent,
                                        isPopular,
                                        onUpgrade,
                                        upgrading,
                                    }: PricingCardProps) {
    return (
        <div className={`bg-gray-900 rounded-xl border p-8 flex flex-col relative ${
            isPopular ? 'border-blue-500' : 'border-gray-800'
        }`}>
            {isPopular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="bg-blue-600 text-white text-xs font-medium px-3 py-1 rounded-full">
            Most Popular
          </span>
                </div>
            )}

            <div className="mb-6">
                <h3 className="text-xl font-bold text-white">{name}</h3>
                <p className="text-gray-400 text-sm mt-1">{description}</p>
            </div>

            <div className="mb-6">
                {price === null ? (
                    <p className="text-4xl font-bold text-white">Free</p>
                ) : (
                    <div className="flex items-end gap-1">
                        <p className="text-4xl font-bold text-white">${price}</p>
                        <p className="text-gray-400 mb-1">/month</p>
                    </div>
                )}
            </div>

            <ul className="space-y-3 mb-8 flex-1">
                {features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                        <span className="text-green-400 mt-0.5">✓</span>
                        {feature}
                    </li>
                ))}
            </ul>

            {isCurrent ? (
                <div className="w-full text-center py-2.5 bg-gray-800 text-gray-400 rounded-lg text-sm">
                    Current Plan
                </div>
            ) : price === null ? (
                <a
                    href="/auth/signup"
                    className="w-full text-center py-2.5 bg-gray-800 hover:bg-gray-700 text-white rounded-lg text-sm transition"
                >
                    Get Started Free
                </a>
            ) : (
                <button
                    onClick={onUpgrade}
                    disabled={upgrading}
                    className={`w-full py-2.5 rounded-lg text-sm font-medium transition disabled:opacity-50 ${
                        isPopular
                            ? 'bg-blue-600 hover:bg-blue-700 text-white'
                            : 'bg-gray-800 hover:bg-gray-700 text-white'
                    }`}
                >
                    {upgrading ? 'Redirecting...' : `Upgrade to ${name}`}
                </button>
            )}
        </div>
    );
}