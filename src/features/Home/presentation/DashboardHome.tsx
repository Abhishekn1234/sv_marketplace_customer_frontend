
import CategoriesRow from "./components/home/CategoriesRow";
import ServicesByCategory from "./components/home/ServicesByCategories";

export default function WebsiteHome() {
  return (
    
    <div className="min-h-screen bg-background text-foreground">
      
      <section className="relative overflow-hidden">
        
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10" />

        <div className="relative py-32 px-6 text-center max-w-6xl mx-auto">
          <span className="inline-block mb-6 rounded-full bg-primary/10 px-6 py-2 text-sm font-medium text-primary tracking-wide">
            Trusted • Professional • Reliable
          </span>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold mb-8 leading-tight tracking-tight">
            Premium Services
            <span className="block bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Tailored for You
            </span>
          </h1>

          <p className="text-xl sm:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Discover top-quality services delivered by verified professionals.
            Browse, compare, and book the perfect service — all in one place.
          </p>
        </div>
      </section>

     
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-semibold text-center mb-12">
            Explore Service Categories
          </h2>
          <CategoriesRow />
        </div>
      </section>


      <section className="py-24 px-6 bg-muted/30">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            Quality Services, Delivered Right
          </h2>

          <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed">
            We connect you with trusted professionals across a wide range of services.
            From everyday needs to specialized expertise, our platform ensures
            reliability, transparency, and customer satisfaction at every step.
          </p>

          <div className="mt-10 flex justify-center gap-6 flex-wrap">
            <div className="px-6 py-4 rounded-xl bg-background shadow-sm border">
              <p className="text-lg font-semibold">Verified Experts</p>
              <p className="text-sm text-muted-foreground">
                Skilled professionals you can trust
              </p>
            </div>

            <div className="px-6 py-4 rounded-xl bg-background shadow-sm border">
              <p className="text-lg font-semibold">Transparent Pricing</p>
              <p className="text-sm text-muted-foreground">
                No hidden costs, ever
              </p>
            </div>

            <div className="px-6 py-4 rounded-xl bg-background shadow-sm border">
              <p className="text-lg font-semibold">Seamless Booking</p>
              <p className="text-sm text-muted-foreground">
                Book services in just a few clicks
              </p>
            </div>
          </div>
        </div>
      </section>

     
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-semibold text-center mb-12">
            Services You’ll Love
          </h2>
          <ServicesByCategory />
        </div>
      </section>
    </div>
  );
}

