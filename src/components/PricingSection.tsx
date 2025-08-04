import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Zap, Users, Building } from "lucide-react";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "",
    description: "Perfect for testing the waters",
    icon: Zap,
    features: [
      "3 website analyses",
      "Basic insights",
      "Core recommendations",
      "Email support"
    ],
    limitations: ["Limited to 3 sites", "Basic feedback only"],
    cta: "Get Started Free",
    popular: false
  },
  {
    name: "Pro",
    price: "$10",
    period: "/month",
    description: "For serious growth optimization",
    icon: Users,
    features: [
      "Unlimited analyses",
      "Industry-specific insights",
      "Expert playbooks",
      "Benchmark comparisons",
      "A/B testing suggestions",
      "Priority support"
    ],
    limitations: [],
    cta: "Start Pro Trial",
    popular: true
  },
  {
    name: "Team",
    price: "$49",
    period: "/month",
    description: "For teams and agencies",
    icon: Building,
    features: [
      "Everything in Pro",
      "Team collaboration",
      "Usage history & trends",
      "White-label reports",
      "API access",
      "Custom integrations",
      "Dedicated support"
    ],
    limitations: [],
    cta: "Contact Sales",
    popular: false
  }
];

const payAsYouGo = {
  name: "Pay-as-you-go",
  price: "$1",
  period: "/analysis",
  description: "Perfect for hackathons and one-off needs",
  features: [
    "No monthly commitment",
    "Full Pro features per analysis",
    "Instant results",
    "Valid for 24 hours"
  ]
};

export const PricingSection = () => {
  return (
    <div className="w-full max-w-6xl mx-auto py-12 space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
          Simple, Outcome-Based Pricing
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Pay for results, not usage. Choose the plan that fits your growth stage.
        </p>
      </div>

      {/* Main Plans */}
      <div className="grid md:grid-cols-3 gap-6">
        {plans.map((plan) => {
          const Icon = plan.icon;
          return (
            <Card 
              key={plan.name} 
              className={`relative transition-all duration-300 hover:shadow-elegant ${
                plan.popular ? 'border-2 border-primary shadow-glow' : 'border'
              }`}
            >
              {plan.popular && (
                <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-primary">
                  Most Popular
                </Badge>
              )}
              
              <CardHeader className="text-center pb-4">
                <div className="mx-auto mb-4 w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center">
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-xl font-bold">{plan.name}</CardTitle>
                <div className="space-y-2">
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-3xl font-bold">{plan.price}</span>
                    <span className="text-muted-foreground">{plan.period}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{plan.description}</p>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <Check className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                {plan.limitations.length > 0 && (
                  <div className="pt-2 border-t">
                    <p className="text-xs text-muted-foreground font-medium mb-2">Limitations:</p>
                    <ul className="space-y-1">
                      {plan.limitations.map((limitation, index) => (
                        <li key={index} className="text-xs text-muted-foreground">
                          • {limitation}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <Button 
                  className={`w-full mt-6 ${
                    plan.popular 
                      ? 'bg-gradient-primary hover:shadow-glow' 
                      : 'variant-outline'
                  }`}
                >
                  {plan.cta}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Pay-as-you-go Option */}
      <Card className="border-dashed border-2 bg-gradient-subtle">
        <CardContent className="py-6">
          <div className="text-center space-y-4">
            <Badge variant="secondary" className="mb-2">
              No Commitment
            </Badge>
            <h3 className="text-xl font-bold">{payAsYouGo.name}</h3>
            <div className="flex items-baseline justify-center gap-1">
              <span className="text-2xl font-bold">{payAsYouGo.price}</span>
              <span className="text-muted-foreground">{payAsYouGo.period}</span>
            </div>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              {payAsYouGo.description}
            </p>
            
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              {payAsYouGo.features.map((feature, index) => (
                <span key={index} className="flex items-center gap-1">
                  <Check className="h-3 w-3 text-success" />
                  {feature}
                </span>
              ))}
            </div>

            <Button variant="outline" className="mt-4">
              Buy Single Analysis
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Expert Endorsement */}
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="py-6 text-center space-y-3">
          <div className="text-sm font-medium text-primary">
            💡 Expert Insight
          </div>
          <blockquote className="text-lg italic max-w-3xl mx-auto">
            "90% of successful fintech apps optimize their onboarding within the first 30 days. 
            The ones that don't see 40% higher churn rates."
          </blockquote>
          <p className="text-sm text-muted-foreground">
            Based on insights from top PLG operators and real founder data
          </p>
        </CardContent>
      </Card>
    </div>
  );
};