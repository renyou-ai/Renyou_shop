import bg from "@/asset/images/testimonial-bg.png"; // ton background

export default function Testimonials() {
  const testimonials = [
    {
      text: `"Fastest delivery I've ever experienced. The pharmacist even called to confirm my prescription details before shipping. Highly recommended!"`,
      name: "Sarah Jenkins",
      avatar: "https://randomuser.me/api/portraits/women/32.jpg"
       
    },
    {
      text: `"RenyouApp makes refilling my monthly prescriptions completely hassle-free. The interface is clean, and the tracking updates are accurate."`,
      name: "Michael Torres",
      avatar: "https://randomuser.me/api/portraits/men/45.jpg"
    },
    {
      text: `"I found all my specific skincare brands in one place. The 20% discount on my first order was just the cherry on top! Great service."`,
      name: "Elena Martinez",
      avatar: "https://randomuser.me/api/portraits/women/65.jpg"
    },
  ];

  return (
    <section
      className="py-20 px-10 bg-cover bg-center"
      style={{ backgroundImage: `url(${bg})` }}
    >

      {/* TITLE */}
      <h2 className="text-4xl font-semibold text-center text-[#34306F] mb-14">
        What Our Customers Say
      </h2>

      {/* CARDS */}
      <div className="grid md:grid-cols-3 gap-8">

        {testimonials.map((t, i) => (
          <div
            key={i}
            className="bg-white/90 backdrop-blur rounded-2xl p-6 shadow-sm"
          >

            {/* STARS */}
            <div className="text-orange-400 mb-3 text-sm">
              ★★★★★
            </div>

            {/* TEXT */}
            <p className="text-sm text-gray-600 mb-6 leading-relaxed">
              {t.text}
            </p>

            {/* USER */}
            <div className="flex items-center gap-3">
              <img
                src={t.avatar}
                alt=""
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <p className="text-sm font-semibold text-[#1e1e2f]">
                  {t.name}
                </p>
                <p className="text-xs text-gray-400">
                  Verified Buyer
                </p>
              </div>
            </div>

          </div>
        ))}

      </div>

    </section>
  );
}