const testimonials = [
  {
    body: "Site Sensei's AI chat agent has transformed how our customers find information. Our support tickets dropped by 45% within the first month.",
    author: {
      name: "Sarah Chen",
      role: "Head of Customer Success",
      company: "TechFlow Solutions",
      image:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    },
  },
  {
    body: "The AI's ability to understand context and provide accurate answers is remarkable. It's like having a 24/7 product expert on our site.",
    author: {
      name: "Michael Torres",
      role: "E-commerce Director",
      company: "StyleHub",
      image:
        "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    },
  },
  {
    body: "Implementation was seamless, and the AI quickly learned our extensive documentation. Our customers love getting instant, accurate answers.",
    author: {
      name: "Emily Roberts",
      role: "CTO",
      company: "DevStack",
      image:
        "https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    },
  },
];

const logos = [
  {
    name: "TechFlow",
    logo: "https://tailwindui.com/img/logos/158x48/transistor-logo-gray-900.svg",
  },
  {
    name: "StyleHub",
    logo: "https://tailwindui.com/img/logos/158x48/reform-logo-gray-900.svg",
  },
  {
    name: "DevStack",
    logo: "https://tailwindui.com/img/logos/158x48/tuple-logo-gray-900.svg",
  },
  {
    name: "Quantum Inc",
    logo: "https://tailwindui.com/img/logos/158x48/savvycal-logo-gray-900.svg",
  },
  {
    name: "DataSphere",
    logo: "https://tailwindui.com/img/logos/158x48/statamic-logo-gray-900.svg",
  },
];

export function Testimonials() {
  return (
    <div className="relative isolate bg-background pb-32 pt-24 sm:pt-32">
      <div className="absolute inset-x-0 top-1/2 -z-10 -translate-y-1/2 transform-gpu overflow-hidden opacity-20 dark:opacity-10">
        <div
          className="ml-[max(50%,38rem)] aspect-[1313/771] w-[82.0625rem] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc]"
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
        />
      </div>
      <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
        <div
          className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-20 dark:opacity-10 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
        />
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-xl text-center">
          <h2 className="text-lg font-semibold leading-8 tracking-tight text-primary">
            Testimonials
          </h2>
        </div>
        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 grid-rows-1 gap-8 text-sm leading-6 text-foreground sm:mt-20 sm:grid-cols-2 xl:mx-0 xl:max-w-none xl:grid-flow-col xl:grid-cols-3">
          {testimonials.map((testimonial) => (
            <figure
              key={testimonial.author.name}
              className="rounded-2xl bg-card shadow-lg ring-1 ring-border p-6"
            >
              <blockquote className="text-foreground">
                <p>{`"${testimonial.body}"`}</p>
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-x-4">
                <img
                  className="h-10 w-10 rounded-full bg-muted"
                  src={testimonial.author.image}
                  alt=""
                />
                <div>
                  <div className="font-semibold text-foreground">
                    {testimonial.author.name}
                  </div>
                  <div className="text-muted-foreground">{`${testimonial.author.role}, ${testimonial.author.company}`}</div>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
        <div className="relative mt-16">
          <div
            className="absolute inset-0 flex items-center"
            aria-hidden="true"
          >
            <div className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center"></div>
        </div>
      </div>
    </div>
  );
}
