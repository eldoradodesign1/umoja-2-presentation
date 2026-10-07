# UMOJA 2 — Présentation interactive

## Direction générale

Construire une présentation web privée à trois parcours, pensée comme un film éditorial interactif plutôt qu’un diaporama statique. L’expérience commence par une porte d’entrée BTL, puis adapte la narration, le niveau de confidentialité et les informations financières au profil choisi.

## Design

- **Mouvement** : éditorial digital premium, entre brand film, dossier de partenariat et interface de projection.
- **Principes** : narration par le mouvement, respiration visuelle, contraste entre bleu BTL et scènes chaudes de communauté, information révélée progressivement.
- **Palette** : bleu BTL électrique `#0877E8` comme couleur propriétaire et signal de marque ; bleu nuit `#07111F` pour l’espace cinématique ; crème `#F4F0E8` pour les pauses éditoriales ; vert sauge désaturé et corail discret pour l’impact et les interactions.
- **Paradigme de mise en page** : sections plein écran empilées verticalement, contenus qui entrent dans le champ au scroll, compositions asymétriques et repères de progression latéraux.
- **Signatures** : éclair BTL en motif graphique ; ligne verticale de progression qui se remplit ; halos de lumière et “stills” vidéo traités comme des fenêtres cinématographiques.
- **Interaction** : la navigation donne l’impression d’avancer dans un film. Les boutons changent de poids au survol, les chapitres apparaissent par séquences, et les données sensibles sont réservées au parcours BTL.
- **Animation** : transitions par fondu et translation courte, reveal par clip-path, images avec mouvement de profondeur lent, chiffres qui s’incrémentent, sections qui se superposent légèrement. Respecter `prefers-reduced-motion`.
- **Typographie** : `Manrope` pour la structure, `Space Grotesk` pour les repères et chiffres, petites capitales et interlettrage généreux pour les labels.
- **Essence de marque** : BTL transforme une idée événementielle en expérience vécue, mesurable et mémorable. Personnalité : audacieuse, humaine, précise.
- **Voix** : phrases courtes, confiantes, concrètes. Exemples : “La fête est le début, pas la fin.” / “Une plateforme qui rassemble avant de convertir.”
- **Logo** : logo BTL fourni, utilisé comme sceau de l’interface, avec une version compacte dans la barre de progression et une version plus imposante sur la porte d’entrée.
- **Couleur signature** : bleu BTL électrique `#0877E8`.

## Architecture fonctionnelle

- `index.html` : shell unique de présentation, porte d’entrée et application après authentification locale.
- `src/main.js` : état utilisateur, validation des accès, routage entre les trois parcours, progression, animations et rendu des scènes.
- `src/styles.css` : système visuel, responsive, composants sur mesure, transitions et mode réduit.
- `public/assets/` : logo BTL, images générées, frames extraites des vidéos et médias éventuellement servis en arrière-plan.
- `public/manus-routes.json` : route racine déclarée pour le Preview WebDev.
- `app.config.ts` : métadonnée de logo projet.

## Contenu par audience

- **Vodacom** : expérience, exclusivité de catégorie, Village Vodacom, M-Pesa comme fil fonctionnel avant / pendant / après, indicateurs de performance, reporting ROI. Aucun montant de sponsoring et aucune information de partage des bénéfices.
- **Frères** : mission, ADN lasallien, enfants de militaires, mobilisation communautaire, sélection et protection des bénéficiaires, gouvernance, calendrier de la remise. Aucun détail de répartition des bénéfices, aucun montant de sponsoring, aucune hypothèse commerciale détaillée.
- **BTL** : version complète avec stratégie, production, billetterie, stands, hypothèses de revenus, budget de travail, KPI, processus de donation, reporting, séparation sponsoring / business / collecte et partage 60/40 du résultat distribuable.

## Animation narrative

Chaque parcours est composé de chapitres plein écran. Un chapitre n’affiche d’abord que son titre et son image, puis révèle ses éléments secondaires avec un léger délai. Le scroll déclenche l’activation de la section et met à jour la ligne de progression. Les boutons “suivant” et “retour” gardent une navigation fiable au clavier et sur mobile.

## Assets

Réutiliser les frames extraites des vidéos de la première édition pour l’authenticité. Ajouter une série d’images générées montrant la scène musicale, la Kids Zone, la Christmas Zone, le Food Village, le mur participatif et la remise officielle, avec une représentation digne et positive des enfants et familles. Le logo fourni reste la référence de branding et ne doit pas être réinterprété par l’IA.

## Contraintes importantes

- L’écran de connexion est une barrière d’accès de présentation, pas un système d’authentification de production.
- Les informations financières internes ne doivent apparaître que dans le parcours BTL.
- Les parcours externes ne mentionnent pas le montant de sponsoring.
- L’ensemble est responsive et doit rester lisible en projection 16:9 comme sur mobile.
