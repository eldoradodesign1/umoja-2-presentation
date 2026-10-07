# UMOJA 2 — Présentation interactive

## Direction générale

Construire une présentation web privée à trois parcours, pensée comme un film éditorial interactif plutôt qu’un diaporama statique. L’expérience commence par une porte d’entrée BTL, puis adapte la narration, le niveau de confidentialité et les informations financières au profil choisi.

## Design

- **Mouvement** : éditorial digital premium, entre brand film, dossier de partenariat et interface de projection.
- **Principes** : narration par le mouvement, respiration visuelle, contraste entre bleu BTL et scènes chaudes de communauté, information révélée progressivement.
- **Palette** : bleu BTL électrique `#0877E8` comme couleur propriétaire ; rouge Vodacom `#E60000` pour la performance, la connexion et l’énergie ; bleu/jaune La Salle pour l’ancrage institutionnel ; bleu nuit pour l’espace cinématique ; crème pour les pauses éditoriales.
- **Paradigme de mise en page** : sections plein écran empilées verticalement, contenus qui entrent dans le champ au scroll, compositions asymétriques et repères de progression latéraux.
- **Signatures** : éclair BTL, ligne verticale de progression, halos de lumière et stills vidéo traités comme des fenêtres cinématographiques.
- **Interaction** : la navigation donne l’impression d’avancer dans un film. Les boutons changent de poids au survol, les chapitres apparaissent par séquences, et les données sensibles sont réservées au parcours BTL serveur.
- **Animation** : transitions par fondu et translation courte, reveal par clip-path, images avec mouvement de profondeur lent, chiffres qui s’incrémentent, sections qui se superposent légèrement. Respecter `prefers-reduced-motion`.
- **Typographie** : `Manrope` pour la structure, `Space Grotesk` pour les repères et chiffres, petites capitales et interlettrage généreux pour les labels.
- **Essence de marque** : BTL transforme une idée événementielle en expérience vécue, mesurable et mémorable. Personnalité : audacieuse, humaine, précise.
- **Voix** : phrases courtes, confiantes, concrètes. Exemples : “La fête est le début, pas la fin.” / “Une plateforme qui rassemble avant de convertir.”
- **Logo** : le logo BTL est le sceau de l’entrée et du parcours interne ; Vodacom et La Salle deviennent des signatures de navigation et de chapitre dans leurs espaces respectifs.
- **Couleurs signatures** : bleu BTL électrique, rouge Vodacom, bleu/jaune La Salle.

## Architecture fonctionnelle

- `public/index.html` : shell unique de présentation, porte d’entrée et application après authentification locale.
- `public/main.js` : état utilisateur, validation des accès, routage, thème par marque, progression, animations et rendu des scènes.
- `public/styles.css` : système visuel, responsive, composants sur mesure, transitions et mode réduit.
- `public/decks.js` : bundle statique généré pour GitHub Pages.
- `server.js` : mode Preview avec filtrage serveur des parcours.
- `public/assets/` : logos, images générées et frames extraites des vidéos.
- `public/manus-routes.json` : route racine déclarée pour le Preview WebDev.
- `.github/workflows/pages.yml` : build et déploiement GitHub Pages.

## Contenu par audience

- **Vodacom** : expliquer d’abord ce qu’est UMOJA, qui il sert, pourquoi la journée existe et comment le déroulé fonctionne, puis détailler l’expérience, le Village Vodacom, M-Pesa avant / pendant / après, les indicateurs et le reporting ROI. Aucun montant de sponsoring et aucune information de partage des bénéfices.
- **Frères** : présentation institutionnelle et sociale centrée sur l’ADN lasallien, les enfants de familles de militaires, la mobilisation communautaire, la gouvernance et la remise officielle. Le parcours suit l’identité La Salle fournie et ne montre aucun détail commercial interne.
- **BTL** : version complète avec stratégie, production, sponsoring, billetterie, stands, hypothèses de revenus, budget de travail, KPI, processus de donation, séparation sponsoring / business / collecte et partage 60/40 du résultat distribuable. Le parcours conserve le branding BTL.

## Déploiement

Le Preview WebDev utilise un serveur Node et permet une séparation serveur des contenus. Le bundle GitHub Pages fonctionne sans backend, grâce à un fallback côté navigateur, mais cette version ne doit pas être considérée comme une protection cryptographique : les données embarquées peuvent être inspectées dans les fichiers statiques. Si le document BTL doit rester réellement confidentiel, la version serveur doit être privilégiée.
