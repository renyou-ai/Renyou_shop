import logo from "@/asset/images/big_logo.png";
import facebook from "@/asset/icons/facebook.svg";
import instagram from "@/asset/icons/insta.svg";

export default function Footer() {
  return (
    <footer className="mt-20 text-white bg-gradient-to-r from-[#34306F] to-[#FF7F50]">

      <div className="max-w-7xl mx-auto px-10 py-16 grid md:grid-cols-4 gap-12">

        {/* LEFT */}
        <div className="space-y-6">
          <img src={logo} alt="Renyou" className="h-10" />

          <div className="text-sm opacity-90 space-y-2">
            <p>(+216) 52 00 00 00</p>
            <p>contact@Renyouapp.com</p>
          </div>
        </div>

        {/* INFOS */}
        <div>
          <h3 className="font-semibold mb-4 uppercase text-sm tracking-wide">
            Informations
          </h3>

          <div className="space-y-2 text-sm opacity-90">
            <p>Espace client</p>
            <p>Mes commandes</p>
            <p>Nouveaux produits</p>
            <p>Meilleures ventes</p>
            <p>Conditions d’utilisation</p>
            <p>Contactez-nous</p>
          </div>
        </div>

        {/* CATEGORIES */}
        <div>
          <h3 className="font-semibold mb-4 uppercase text-sm tracking-wide">
            Les catégories
          </h3>

          <div className="space-y-2 text-sm opacity-90">
            <p>Visage</p>
            <p>Cheveux</p>
            <p>Corps</p>
            <p>Beauté cosmétique</p>
            <p>Bébé Maman</p>
            <p>Service SkinCare</p>
          </div>
        </div>

        {/* NEWSLETTER */}
        <div>
          <h3 className="font-semibold mb-4 uppercase text-sm tracking-wide">
            S'inscrire à la newsletter
          </h3>

          <p className="text-sm opacity-80 mb-5 leading-relaxed">
            Vous pouvez vous désinscrire à tout moment. Vous trouverez pour cela
            nos informations de contact dans les conditions d'utilisation du site.
          </p>

          {/* INPUT + BUTTON */}
          <div className="flex items-center w-full max-w-sm bg-white rounded-full overflow-hidden h-12 shadow-sm">

            <input
              type="email"
              placeholder="Votre adresse e-mail"
              className="flex-1 px-5 text-sm text-gray-500 outline-none h-full bg-transparent"
            />

            <button className="bg-[#34306F] text-white text-sm px-6 h-full flex items-center justify-center font-medium border-l border-white/20">
              S'abonne
            </button>

          </div>

          {/* SOCIAL */}
          <div className="flex gap-5 mt-6">

            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md hover:scale-105 transition">
              <img src={facebook} alt="facebook" className="h-5 w-5 object-contain" />
            </div>

            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md hover:scale-105 transition">
              <img src={instagram} alt="instagram" className="h-5 w-5 object-contain" />
            </div>

          </div>

        </div>

      </div>

      {/* BOTTOM */}
      <div className="border-t border-white/20 text-center py-5 text-sm opacity-80">
        Copyright © 2026 - Renyouapp.Com Tous Droits Réservés.
      </div>

    </footer>
  );
}