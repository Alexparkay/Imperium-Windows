import { useState } from 'react';
import { MdCheck, MdStar, MdStarBorder, MdRocketLaunch, MdDiamond, MdWorkspaces, MdAdd } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { IconType } from 'react-icons';

interface PricingCardProps {
  title: string;
  monthlyPrice: number;
  description: string;
  features: string[];
  credits: string;
  icon: IconType;
  isPopular?: boolean;
  gradientFrom?: string;
  gradientTo?: string;
  isAnnual: boolean;
  roi?: string;
  isDecoy?: boolean;
}

interface CreditPackProps {
  credits: number;
  price: number;
}

const Pricing = () => {
  const [isAnnual, setIsAnnual] = useState(false);
  const [showCreditPacks, setShowCreditPacks] = useState(false);
  const navigate = useNavigate();

  // Format currency with $ and commas
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Calculate annual price with 20% discount
  const getAnnualPrice = (monthlyPrice: number) => {
    const annualPrice = monthlyPrice * 12;
    const discount = annualPrice * 0.2;
    return annualPrice - discount;
  };

  const creditPacks: CreditPackProps[] = [
    { credits: 250, price: 149 },
    { credits: 500, price: 249 },
    { credits: 1000, price: 449 },
  ];

  const PricingCard: React.FC<PricingCardProps> = ({ 
    title, 
    monthlyPrice, 
    description, 
    features, 
    credits,
    icon: Icon,
    isPopular = false,
    gradientFrom = "from-gray-500",
    gradientTo = "to-gray-600",
    isAnnual,
    roi,
    isDecoy = false
  }) => {
    const displayPrice = isAnnual ? getAnnualPrice(monthlyPrice) / 12 : monthlyPrice;
    const billingPeriod = isAnnual ? "/mo (billed annually)" : "/mo";
    
    const isEnterprise = title === "Enterprise";
    
    return (
      <div className={`relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden group hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 ${isPopular ? 'scale-105' : ''} ${isDecoy ? 'opacity-95' : ''}`}>
        {/* Decorative corner accent */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-amber-500/5 to-transparent"></div>
        
        {isPopular && (
          <div className="absolute top-5 right-5">
            <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-white text-sm font-medium px-3 py-1 rounded-full shadow-sm">
              Most Popular
            </div>
          </div>
        )}

        <div className="p-8 relative z-10">
          <div className="flex items-center gap-4 mb-6">
            <div className={`bg-gradient-to-r ${gradientFrom} ${gradientTo} p-4 rounded-xl text-white shadow-md`}>
              <Icon className="text-2xl" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h3>
          </div>

          <div className="mb-6">
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-bold text-gray-900 dark:text-white">
                {isEnterprise ? 'Contact Sales' : monthlyPrice === 0 ? 'Free' : formatCurrency(displayPrice)}
              </span>
              {!isEnterprise && monthlyPrice !== 0 && (
                <span className="text-gray-500 dark:text-gray-400">{billingPeriod}</span>
              )}
            </div>
            {isAnnual && monthlyPrice !== 0 && !isEnterprise && (
              <div className="mt-2 text-sm text-amber-500">
                Save {formatCurrency(monthlyPrice * 12 * 0.2)} per year
              </div>
            )}
            <p className="text-gray-500 dark:text-gray-400 mt-2">{description}</p>
            
            {roi && (
              <div className="mt-3 p-2 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-100 dark:border-green-800">
                <p className="text-green-600 dark:text-green-400 text-sm font-medium">{roi}</p>
              </div>
            )}
          </div>

          <div className="space-y-4 mb-8">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="flex-shrink-0 w-5 h-5 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <MdCheck className="text-green-500 text-sm" />
                </div>
                <span className="text-gray-600 dark:text-gray-300">{feature}</span>
              </div>
            ))}
          </div>

          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 mb-8">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Credits Included:</h4>
            <p className="text-gray-600 dark:text-gray-300">{credits}</p>
          </div>

          <button 
            onClick={() => navigate(isEnterprise ? '/contact-sales' : '/login')}
            className={`w-full py-3 px-4 rounded-xl font-medium transition-all shadow-md hover:shadow-xl
              ${isPopular 
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white' 
                : isEnterprise
                  ? 'bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white'
              }`}
          >
            {isEnterprise ? 'Contact Sales' : 'Get Started'}
          </button>
        </div>
      </div>
    );
  };

  const CreditPack: React.FC<CreditPackProps> = ({ credits, price }) => {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 p-6 hover:shadow-lg transition-all">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{credits} Credits</h3>
          <span className="text-xl font-bold text-gray-900 dark:text-white">{formatCurrency(price)}</span>
        </div>
        <button className="w-full py-2 px-4 bg-amber-100 dark:bg-amber-900/30 hover:bg-amber-200 dark:hover:bg-amber-800/40 text-amber-600 dark:text-amber-400 rounded-lg font-medium transition-colors">
          Add to Plan
        </button>
      </div>
    );
  };

  return (
    <div className="w-full">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Simple, Transparent Pricing
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Choose the perfect plan for your solar automation needs
        </p>
        <p className="text-lg text-amber-600 dark:text-amber-400 mt-2 font-medium">
          One closed deal pays for a full year of service — 10x ROI guaranteed
        </p>
      </div>

      {/* Pricing Toggle */}
      <div className="flex justify-center items-center gap-4 mb-12">
        <span className={`text-lg ${!isAnnual ? 'text-gray-900 dark:text-white font-medium' : 'text-gray-500 dark:text-gray-400'}`}>
          Monthly
        </span>
        <label className="relative inline-flex items-center cursor-pointer">
          <input 
            type="checkbox" 
            className="sr-only peer" 
            checked={isAnnual}
            onChange={() => setIsAnnual(!isAnnual)}
          />
          <div className="w-16 h-8 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-amber-300 dark:peer-focus:ring-amber-800 rounded-full peer peer-checked:after:translate-x-8 peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-amber-500"></div>
        </label>
        <span className={`text-lg ${isAnnual ? 'text-gray-900 dark:text-white font-medium' : 'text-gray-500 dark:text-gray-400'}`}>
          Annual
          <span className="ml-2 text-sm text-amber-500">(Save 20%)</span>
        </span>
      </div>

      {/* Pricing Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 lg:gap-6 mb-12">
        <PricingCard 
          title="Free Trial"
          monthlyPrice={0}
          description="Perfect for testing our platform"
          icon={MdStarBorder}
          features={[
            "Access to the Energy Cost Calculator for up to 20 facilities",
            "Manual data entry or selection via an interactive map",
            "Basic reporting features"
          ]}
          credits="20 credits for facility analysis"
          gradientFrom="from-gray-500"
          gradientTo="to-gray-600"
          isAnnual={isAnnual}
        />

        <PricingCard 
          title="Starter"
          monthlyPrice={299}
          description="Ideal for early-stage companies"
          icon={MdStar}
          features={[
            "Access to the Energy Cost Calculator for up to 100 facilities",
            "Enhanced data entry options",
            "Basic reporting and exports",
            "Data enrichment capabilities"
          ]}
          credits="1,000 credits per month for data enrichment"
          gradientFrom="from-green-500"
          gradientTo="to-green-600"
          isAnnual={isAnnual}
          roi="3x ROI with just one small deal"
        />

        <PricingCard 
          title="Basic"
          monthlyPrice={579}
          description="Great for small businesses"
          icon={MdStar}
          features={[
            "Full access to the customer database",
            "Enhanced Energy Cost Calculator functionalities",
            "Limited outreach (1 sequence/month)",
            "Ability to export data reports",
            "Advanced data enrichment"
          ]}
          credits="3,000 credits per month for data enrichment and analysis"
          gradientFrom="from-blue-500"
          gradientTo="to-blue-600"
          isAnnual={isAnnual}
          roi="5x ROI with average deal size"
        />

        <PricingCard 
          title="Professional"
          monthlyPrice={1489}
          description="Perfect for growing companies"
          icon={MdRocketLaunch}
          isPopular={true}
          features={[
            "All features of the Basic plan",
            "Automated, hyper-personalized outreach capabilities",
            "Advanced analytics and reporting tools",
            "Priority support and training",
            "Full database access",
            "Unlimited outreach sequences"
          ]}
          credits="7,500 credits per month for comprehensive usage"
          gradientFrom="from-amber-500"
          gradientTo="to-amber-600"
          isAnnual={isAnnual}
          roi="10x ROI based on average commercial deal"
        />

        <PricingCard 
          title="Enterprise"
          monthlyPrice={-1}
          description="For large-scale operations"
          icon={MdDiamond}
          features={[
            "Custom deployment options",
            "Dedicated account management",
            "Premium support and training",
            "Custom integrations and API access",
            "White-label reporting"
          ]}
          credits="Flexible credits based on organizational needs (10,000+ credits available)"
          gradientFrom="from-purple-500"
          gradientTo="to-purple-600"
          isAnnual={isAnnual}
          roi="20x+ ROI with optimized workflow & higher volume"
        />
      </div>

      {/* Credit Packs Section */}
      <div className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <MdAdd className="text-amber-500" />
            Credit Pack Add-ons
          </h2>
          <button 
            onClick={() => setShowCreditPacks(!showCreditPacks)}
            className="text-amber-600 dark:text-amber-400 font-medium hover:underline"
          >
            {showCreditPacks ? 'Hide Options' : 'View Options'}
          </button>
        </div>

        {showCreditPacks && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
            {creditPacks.map((pack, index) => (
              <CreditPack key={index} credits={pack.credits} price={pack.price} />
            ))}
          </div>
        )}
        
        <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-xl">
          <p className="text-amber-700 dark:text-amber-300 text-sm">
            Need more flexibility? Add extra credits to any plan without upgrading tiers. Perfect for seasonal usage spikes or special projects.
          </p>
        </div>
      </div>

      {/* Features Comparison */}
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-8 mb-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 flex items-center gap-3">
          <MdWorkspaces className="text-amber-500" />
          Compare Features
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-200 dark:border-gray-700">
                <th className="text-left py-4 px-4 text-gray-500 dark:text-gray-400">Feature</th>
                <th className="text-center py-4 px-4 text-gray-500 dark:text-gray-400">Free Trial</th>
                <th className="text-center py-4 px-4 text-gray-500 dark:text-gray-400">Starter</th>
                <th className="text-center py-4 px-4 text-gray-500 dark:text-gray-400">Basic</th>
                <th className="text-center py-4 px-4 text-gray-500 dark:text-gray-400">Professional</th>
                <th className="text-center py-4 px-4 text-gray-500 dark:text-gray-400">Enterprise</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              <tr>
                <td className="py-4 px-4 text-gray-900 dark:text-white">Energy Cost Calculator</td>
                <td className="text-center py-4 px-4">Up to 20</td>
                <td className="text-center py-4 px-4">Up to 100</td>
                <td className="text-center py-4 px-4">Up to 1,000</td>
                <td className="text-center py-4 px-4">Up to 2,500</td>
                <td className="text-center py-4 px-4">Unlimited</td>
              </tr>
              <tr>
                <td className="py-4 px-4 text-gray-900 dark:text-white">Interactive Map Selection</td>
                <td className="text-center py-4 px-4"><MdCheck className="mx-auto text-green-500" /></td>
                <td className="text-center py-4 px-4"><MdCheck className="mx-auto text-green-500" /></td>
                <td className="text-center py-4 px-4"><MdCheck className="mx-auto text-green-500" /></td>
                <td className="text-center py-4 px-4"><MdCheck className="mx-auto text-green-500" /></td>
                <td className="text-center py-4 px-4"><MdCheck className="mx-auto text-green-500" /></td>
              </tr>
              <tr>
                <td className="py-4 px-4 text-gray-900 dark:text-white">Customer Database Access</td>
                <td className="text-center py-4 px-4">-</td>
                <td className="text-center py-4 px-4">-</td>
                <td className="text-center py-4 px-4">Full Access</td>
                <td className="text-center py-4 px-4">Full Access</td>
                <td className="text-center py-4 px-4">Full Access</td>
              </tr>
              <tr>
                <td className="py-4 px-4 text-gray-900 dark:text-white">Data Export</td>
                <td className="text-center py-4 px-4">Basic CSV</td>
                <td className="text-center py-4 px-4">CSV + PDF</td>
                <td className="text-center py-4 px-4">CSV + Excel</td>
                <td className="text-center py-4 px-4">All Formats</td>
                <td className="text-center py-4 px-4">Custom Formats</td>
              </tr>
              <tr>
                <td className="py-4 px-4 text-gray-900 dark:text-white">Automated Outreach</td>
                <td className="text-center py-4 px-4">-</td>
                <td className="text-center py-4 px-4">-</td>
                <td className="text-center py-4 px-4">Limited (1/mo)</td>
                <td className="text-center py-4 px-4">Unlimited</td>
                <td className="text-center py-4 px-4">Custom</td>
              </tr>
              <tr>
                <td className="py-4 px-4 text-gray-900 dark:text-white">Analytics & Reporting</td>
                <td className="text-center py-4 px-4">Basic</td>
                <td className="text-center py-4 px-4">Standard</td>
                <td className="text-center py-4 px-4">Enhanced</td>
                <td className="text-center py-4 px-4">Advanced</td>
                <td className="text-center py-4 px-4">Custom</td>
              </tr>
              <tr>
                <td className="py-4 px-4 text-gray-900 dark:text-white">Support</td>
                <td className="text-center py-4 px-4">Community</td>
                <td className="text-center py-4 px-4">Email (72h)</td>
                <td className="text-center py-4 px-4">Email (48h)</td>
                <td className="text-center py-4 px-4">Priority (24h)</td>
                <td className="text-center py-4 px-4">24/7 Dedicated</td>
              </tr>
              <tr>
                <td className="py-4 px-4 text-gray-900 dark:text-white">ROI Estimate</td>
                <td className="text-center py-4 px-4">-</td>
                <td className="text-center py-4 px-4">3x</td>
                <td className="text-center py-4 px-4">5x</td>
                <td className="text-center py-4 px-4">10x</td>
                <td className="text-center py-4 px-4">20x+</td>
              </tr>
              <tr>
                <td className="py-4 px-4 text-gray-900 dark:text-white">Monthly Credits</td>
                <td className="text-center py-4 px-4">20</td>
                <td className="text-center py-4 px-4">1,000</td>
                <td className="text-center py-4 px-4">3,000</td>
                <td className="text-center py-4 px-4">7,500</td>
                <td className="text-center py-4 px-4">10,000+</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-amber-500 to-amber-600 rounded-2xl p-8 text-white text-center">
        <h2 className="text-2xl font-bold mb-4">Ready to get started?</h2>
        <p className="mb-6">Join thousands of companies already using our platform to close more solar deals</p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button 
            onClick={() => navigate('/login')}
            className="bg-white text-amber-600 py-3 px-8 rounded-xl font-medium hover:bg-gray-50 transition-colors shadow-md hover:shadow-xl"
          >
            Start Your Free Trial
          </button>
          <button 
            onClick={() => navigate('/contact-sales')}
            className="bg-transparent border border-white text-white py-3 px-8 rounded-xl font-medium hover:bg-white/10 transition-colors"
          >
            Talk to Sales
          </button>
        </div>
        <p className="mt-6 text-white/80 text-sm">Average customer ROI is 10x after just 3 months</p>
      </div>
    </div>
  );
};

export default Pricing; 