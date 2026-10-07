# UMOJA 2 — Présentation interactive

Présentation Web premium à trois parcours : Vodacom, Frères des Écoles Chrétiennes et BTL Africa.

## Développement

```bash
npm run build
npm run check
npm start
```

Le bundle GitHub Pages est généré dans `public/`. Le workflow `.github/workflows/pages.yml` le déploie automatiquement depuis `main`.

## Accès

L’interface propose un accès distinct pour chaque audience. Le Preview WebDev utilise le serveur Node pour filtrer les parcours côté serveur.

**Important pour GitHub Pages :** GitHub Pages ne fournit pas de serveur applicatif. La version Pages utilise donc une barrière côté navigateur ; les contenus chargés dans le bundle statique peuvent être inspectés par une personne techniquement avancée. Pour une confidentialité forte du document BTL, utiliser le Preview WebDev ou un hébergement avec backend.
