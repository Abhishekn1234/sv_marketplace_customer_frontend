export default function AboutTeam() {
  const team = [
    { name: "Sarah Chen", role: "Co-Founder & CEO" },
    { name: "Michael Rodriguez", role: "Co-Founder & CTO" },
    { name: "Emily Thompson", role: "Head of Operations" },
    { name: "David Park", role: "Head of Customer Success" },
  ];

  return (
    <section className="mb-8">

      {/* Section Title */}
      <h2 className="text-[32px] font-bold text-gray-900 text-center mb-8">
        Our Leadership Team
      </h2>

      {/* Grid */}
      <div className="grid gap-6 [grid-template-columns:repeat(auto-fit,minmax(250px,1fr))]">
        {team.map((member, index) => (
          <div
            key={index}
            className="bg-white rounded-[20px] p-8 border-2 border-gray-200 text-center transition-all duration-300 hover:border-blue-600 hover:shadow-xl"
          >
            {/* Avatar */}
            <div className="w-[100px] h-[100px] rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-5">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="w-[50px] h-[50px] text-blue-600"
              >
                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>

            {/* Name */}
            <h3 className="text-[18px] font-bold text-gray-900 mb-2">
              {member.name}
            </h3>

            {/* Role */}
            <p className="text-[14px] text-gray-500">
              {member.role}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
