import truckIcon from "@/asset/icons/truck.svg";
import expertIcon from "@/asset/icons/expert.svg";
import supportIcon from "@/asset/icons/support.svg";
import bg from "@/asset/images/pattern.png";

export default function InfoSection() {
  return (
    <section className="px-10 py-24 relative overflow-hidden bg-[#FAFAFC]">

      {/* 🔥 BACKGROUND PATTERN */}
      <div
  className="absolute inset-0 pointer-events-none"
  style={{
    backgroundImage: `url(${bg})`,
    backgroundRepeat: "repeat",
    backgroundSize: "280px",
    opacity: 0.2,
  }}
/>
      {/* CONTENT */}
      <div className="relative max-w-5xl mx-auto text-[#2c2c54] space-y-10">

        {/* TITLE */}
        <div>
          <h2 className="text-lg font-semibold mb-2">
            Renyou Care Marketplace :
          </h2>

          <p className="text-xl font-medium">
            La Parapharmacie Digitale Engagée Pour La Santé Et Le Bien-Être En Tunisie
          </p>

          <p className="text-sm text-gray-600 mt-4 leading-relaxed">
            Renyou Care Marketplace est une parapharmacie en ligne nouvelle génération,
            pensée pour rendre la santé, le bien-être et la beauté accessibles à tous.
          </p>
        </div>

        {/* SECTION 1 */}
        <div>
          <h3 className="font-semibold mb-2">
            Une Vision Claire : Accessibilité, Choix, Expertise
          </h3>

          <ul className="text-sm text-gray-600 space-y-1 pl-4 list-disc">
            <li>Des prix bas au quotidien</li>
            <li>Une vaste sélection de produits</li>
            <li>Le conseil d’experts à votre écoute</li>
          </ul>
        </div>

        {/* SECTION 2 */}
        <div>
          <h3 className="font-semibold mb-2">
            Une Offre Locale & Internationale, Au Service De Votre Bien-Être
          </h3>

          <p className="text-sm text-gray-600 leading-relaxed">
            Nous collaborons avec plus de 900 marques et laboratoires reconnus,
            alliant innovations internationales et produits locaux de confiance.
          </p>
        </div>

        {/* SECTION 3 */}
        <div>
          <h3 className="font-semibold mb-2">
            Des Conseils À Portée De Clic
          </h3>

          <p className="text-sm text-gray-600">
            Nos pharmaciens et partenaires sont disponibles pour vous accompagner
            dans vos choix avec des recommandations personnalisées.
          </p>
        </div>

        {/* SECTION 4 */}
        <div>
          <h3 className="font-semibold mb-2">
            Des Offres Attractives Toute L’année
          </h3>

          <p className="text-sm text-gray-600">
            Profitez de promotions fréquentes, packs exclusifs et réductions sur
            les marques les plus recherchées.
          </p>
        </div>

        {/* 🔥 BOTTOM BOX */}
        <div className="border border-orange-300 rounded-2xl px-10 py-8 grid grid-cols-1 md:grid-cols-3 gap-8 text-center bg-white shadow-sm">

          {/* ITEM 1 */}
          <div className="flex flex-col items-center gap-2">
            <img src={truckIcon} alt="" className="h-10" />
            <p className="font-medium text-sm">Livraison gratuite</p>
            <p className="text-xs text-gray-500">
              Livraison gratuite à partir de 100 dt
            </p>
          </div>

          {/* ITEM 2 */}
          <div className="flex flex-col items-center gap-2">
            <img src={expertIcon} alt="" className="h-10" />
            <p className="font-medium text-sm">Conseils par des experts</p>
            <p className="text-xs text-gray-500">
              Disponibilité 7j/7
            </p>
          </div>

          {/* ITEM 3 */}
          <div className="flex flex-col items-center gap-2">
            <img src={supportIcon} alt="" className="h-10" />
            <p className="font-medium text-sm">Assistance en ligne</p>
            <p className="text-xs text-gray-500">
              Support rapide pour vos commandes
            </p>
          </div>

        </div>

      </div>
    </section>
  );
}