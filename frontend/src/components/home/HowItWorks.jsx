import step1 from "@/asset/images/how1.png";
import step2 from "@/asset/images/how2.png";
import step3 from "@/asset/images/how3.png";
import aiIcon from "@/asset/icons/ai.svg";

export default function HowItWorks() {
  const steps = [
    {
      title: "Diagnose",
      desc: "It starts with your skin. The Renyou AI diagnosis tool uses a face scan to get to know your skin – it’s 98% as accurate as a derm.",
      img: step1,
    },
    {
      title: "Recommend",
      desc: "Renyou AI gives you personalised recommendations. Every match is based on 50+ years of skin and haircare science",
      img: step2,
    },
    {
      title: "Deliver",
      desc: "We deliver right to your door, fast. Not totally happy with your matches? We deliver on that too with a money-back guarantee.",
      img: step3,
    },
  ];

  const openAI = () => {
    window.dispatchEvent(
      new CustomEvent("open-ai-chat", {
        detail: { message: "Start my skincare diagnosis" },
      })
    );
  };

  return (
    <section className="px-10 py-20 select-none">

      {/* TITLE */}
      <h2 className="text-2xl font-semibold text-[#1e1e2f] mb-10">
        How it works
      </h2>

      {/* CARDS */}
      <div className="grid md:grid-cols-3 gap-6">

        {steps.map((step) => (
          <div
            key={step.title}
            className="bg-[#FFF2ED] rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition duration-300 hover:-translate-y-1"
          >

            {/* IMAGE */}
            <img
              src={step.img}
              alt={step.title}
              draggable="false"
              className="w-full h-[200px] object-cover"
            />

            {/* CONTENT */}
            <div className="p-5">

              <h3 className="text-2xl font-semibold text-[#34306F] mb-2">
                {step.title}
              </h3>

              <p className="text-sm text-gray-600 leading-relaxed">
                {step.desc}
              </p>

            </div>
          </div>
        ))}

      </div>

      {/* MAIN CTA */}
      <div className="flex justify-center">
        <button
          onClick={openAI}
          className="mt-12 flex items-center gap-2 px-8 py-3 rounded-full text-white font-medium shadow-md
          bg-gradient-to-r from-[#34306F] to-[#645CD5] hover:opacity-90 transition"
        >
          Start diagnosis
          <img src={aiIcon} alt="" className="h-5" />
        </button>
      </div>

    </section>
  );
}