function Footer() {

  return (

    <footer className="bg-gradient-to-r from-[#34306F] to-[#FF7F50] text-white p-14 mt-20">

      <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-10">

        <div>

          <h2 className="text-xl font-bold mb-4">
            Renyou
          </h2>

          <p>(+216) 52 00 00 00</p>
          <p>contact@renyouapp.com</p>

        </div>

        <div>

          <h3 className="font-semibold mb-3">
            Informations
          </h3>

          <p>Espace client</p>
          <p>Mes commandes</p>
          <p>Nouveaux produits</p>
          <p>Conditions d'utilisation</p>

        </div>

        <div>

          <h3 className="font-semibold mb-3">
            Les catégories
          </h3>

          <p>Visage</p>
          <p>Cheveux</p>
          <p>Corps</p>
          <p>Bébé maman</p>

        </div>

        <div>

          <h3 className="font-semibold mb-3">
            Newsletter
          </h3>

          <input
            placeholder="Votre adresse e-mail"
            className="px-4 py-2 rounded text-black w-full"
          />

          <button className="mt-3 bg-white text-black px-4 py-2 rounded">
            S'abonner
          </button>

        </div>

      </div>

      <div className="text-center mt-10 text-sm opacity-80">
        Copyright © 2026 - Renyouapp.com
      </div>

    </footer>

  );

}

export default Footer;