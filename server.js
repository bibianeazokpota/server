const express = require("express");
const tachesRoutes = require("./routes/taches");

const server = express();
const port = 8000;

// Middleware pour parser le JSON
server.use(express.json());

// Routes
server.use("/api/taches", tachesRoutes);

// Middleware pour les routes non trouvées
server.use((req, res, next) => {
  res.status(404).json({ message: "Route non trouvée" });
});

// Middleware pour la gestion des erreurs
server.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Erreur serveur" });
});

// Démarrage du serveur
server.listen(port, () => {
  console.log(`Serveur en écoute sur le port ${port}`);
});

let taches = [];
let idCounter = 1;

class Tache {
  constructor(titre, description, statut = "en cours") {
    this.id = idCounter++;
    this.titre = titre;
    this.description = description;
    this.statut = statut;
  }
}

module.exports = { Tache, taches };


const { Tache, taches } = require("../models/taches");

exports.creerTache = (req, res) => {
  const { titre, description, statut } = req.body;
  const nouvelleTache = new Tache(titre, description, statut);
  taches.push(nouvelleTache);
  res.status(201).json(nouvelleTache);
};

exports.obtenirTaches = (req, res) => {
  res.json(taches);
};

exports.obtenirTacheParId = (req, res) => {
  const tache = taches.find((t) => t.id === parseInt(req.params.id));
  if (tache) {
    res.json(tache);
  } else {
    res.status(404).json({ message: "Tâche non trouvée" });
  }
};

exports.mettreAJourTache = (req, res) => {
  const tache = taches.find((t) => t.id === parseInt(req.params.id));
  if (tache) {
    const { titre, description, statut } = req.body;
    tache.titre = titre || tache.titre;
    tache.description = description || tache.description;
    tache.statut = statut || tache.statut;
    res.json(tache);
  } else {
    res.status(404).json({ message: "Tâche non trouvée" });
  }
};

exports.supprimerTache = (req, res) => {
  const index = taches.findIndex((t) => t.id === parseInt(req.params.id));
  if (index !== -1) {
    taches.splice(index, 1);
    res.status(204).send();
  } else {
    res.status(404).json({ message: "Tâche non trouvée" });
  }
};


const express = require("express");
const router = express.Router();
const tachesController = require("../controllers/taches");

// Routes
router.post("/", tachesController.creerTache);
router.get("/", tachesController.obtenirTaches);
router.get("/:id", tachesController.obtenirTacheParId);
router.put("/:id", tachesController.mettreAJourTache);
router.delete("/:id", tachesController.supprimerTache);

module.exports = router;



