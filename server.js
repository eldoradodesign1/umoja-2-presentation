import http from 'node:http';
import { createReadStream, existsSync, statSync } from 'node:fs';
import { extname, join, normalize } from 'node:path';
import { randomUUID } from 'node:crypto';

const PORT = Number(process.env.PORT || 3000);
const PUBLIC_DIR = join(process.cwd(), 'public');
const sessions = new Map();

const passwords = {
  vodacom: 'vod@com123',
  brothers: 'DeLaSalleCongo',
  btl: 'Beyondtheline26',
};

const media = {
  logo: '/assets/btl-logo.jpeg',
  community: '/assets/community.jpg',
  dance: '/assets/dance.jpg',
  family: '/assets/family.jpg',
  spot: '/assets/spot.jpg',
  stage: '/assets/stage.jpg',
  kids: '/assets/kids_zone.jpg',
  christmas: '/assets/christmas_zone.jpg',
  food: '/assets/food_village.jpg',
  handover: '/assets/handover.jpg',
};

const common = {
  title: 'UMOJA 2 — Noël pour ceux qui veillent sur nous',
  signature: 'Une fête qui rassemble. Une marque qui s’implique. Un geste qui continue.',
};

const decks = {
  vodacom: {
    audience: 'PARTENAIRE OFFICIEL · VODACOM',
    tone: 'vodacom',
    chapters: [
      {
        type: 'cover',
        index: '01',
        eyebrow: 'UMOJA — ONE LASALLE · ÉDITION 2',
        title: 'Une fête qui devient<br><em>une plateforme.</em>',
        text: 'UMOJA crée un rendez-vous de Noël fort, puis prolonge son énergie par une mobilisation concrète, visible et mesurable.',
        image: media.community,
        tag: 'Expérience · Jeunesse · Impact',
      },
      {
        type: 'statement',
        index: '02',
        eyebrow: 'LE PARTENARIAT',
        title: 'Vodacom ne pose pas un logo.<br><em>Vodacom active UMOJA.</em>',
        text: 'L’enjeu est de faire de la marque un acteur de la journée, de la transaction et de l’impact — avec une présence utile à chaque étape du parcours participant.',
        pull: 'Expérience intégrée, pas sponsoring passif.',
      },
      {
        type: 'media-copy',
        index: '03',
        eyebrow: 'LE VILLAGE VODACOM',
        title: 'Une zone qui attire.<br>Une expérience qui convertit.',
        text: 'Un espace premium où les familles découvrent les offres, participent à des jeux, activent leurs services et prolongent la relation bien après la fête.',
        image: media.spot,
        chips: ['M-Pesa', 'Offres mobiles', 'Data', 'Jeux & concours', 'Démonstrations'],
      },
      {
        type: 'flow',
        index: '04',
        eyebrow: 'M-PESA AU CŒUR DU PARCOURS',
        title: 'Avant. Pendant.<br><em>Après.</em>',
        steps: [
          ['Avant', 'Ticket digital M-Pesa', 'Billet → paiement → QR code → confirmation'],
          ['Pendant', 'Expérience de paiement', 'Jeux, achats et interactions au Village'],
          ['Après', 'Don UMOJA', 'Une mobilisation solidaire naturellement reliée à l’événement'],
        ],
        note: 'Une intégration fonctionnelle qui fait de M-Pesa le fil de l’expérience, et non un simple support de marque.',
      },
      {
        type: 'experience',
        index: '05',
        eyebrow: 'UNE EXPÉRIENCE À VIVRE',
        title: 'Tout est conçu pour créer<br>du mouvement et du souvenir.',
        items: [
          ['Main Stage', 'Musique, danse, MC, artistes et challenges.', media.dance],
          ['Kids Zone', 'Jeux, ateliers créatifs, mini-tournois et rires.', media.kids],
          ['Christmas Zone', 'Photos, cadeaux, décor et moments de famille.', media.christmas],
          ['Food Village', 'Saveurs locales, partenaires et convivialité.', media.food],
        ],
      },
      {
        type: 'metrics',
        index: '06',
        eyebrow: 'UN RETOUR MESURABLE',
        title: 'Le rapport final ne dira pas :<br><em>“votre logo était partout.”</em>',
        metrics: [
          ['Transactions', 'Tickets M-Pesa, paiements sur site, dons'],
          ['Acquisition', 'Leads, activations, souscriptions, démos'],
          ['Audience', 'Participants, familles, trafic Village, taux de remplissage'],
          ['Contenu', 'Portée, vidéos vues, UGC, engagement, mentions'],
        ],
        note: 'Un reporting ROI associé à l’événement, à l’activation et à la contribution d’impact.',
      },
      {
        type: 'impact',
        index: '07',
        eyebrow: 'UNE FÊTE QUI CONTINUE',
        title: 'De décembre à janvier,<br><em>la mobilisation reste visible.</em>',
        text: 'La fête déclenche le mois du partage. Les contributions sont tracées, la remise est officielle, et l’impact est documenté avec les partenaires.',
        image: media.handover,
        tag: 'Fête → mobilisation → collecte → remise → rapport',
      },
      {
        type: 'closing',
        index: '08',
        eyebrow: 'PROCHAINE ÉTAPE',
        title: 'Construisons ensemble<br><em>l’expérience UMOJA.</em>',
        text: 'Une plateforme de Noël où la marque, la jeunesse et la communauté avancent dans la même direction.',
      },
    ],
  },
  brothers: {
    audience: 'PARTENAIRES INSTITUTIONNELS · FRÈRES DES ÉCOLES CHRÉTIENNES',
    tone: 'brothers',
    chapters: [
      {
        type: 'cover', index: '01', eyebrow: 'UMOJA — ONE LASALLE · ÉDITION 2',
        title: 'Noël pour ceux<br><em>qui veillent sur nous.</em>',
        text: 'Une célébration digne pour des centaines d’enfants de familles de militaires, portée par l’esprit lasallien de fraternité, de jeunesse et de solidarité.',
        image: media.family, tag: 'Unité · Famille · Reconnaissance · Jeunesse',
      },
      {
        type: 'statement', index: '02', eyebrow: 'LA PROMESSE',
        title: 'Célébrer les enfants<br><em>sans les réduire au besoin.</em>',
        text: 'UMOJA ne raconte pas une histoire de misère. Il rend hommage à ceux qui veillent sur la nation et offre à leurs enfants une journée de joie, de rencontre et de fierté.',
        pull: 'Une fête qui reconnaît avant de mobiliser.',
      },
      {
        type: 'media-copy', index: '03', eyebrow: 'UNE COMMUNAUTÉ EN MOUVEMENT',
        title: 'La communauté lasallienne<br>donne une profondeur au projet.',
        text: 'Les Frères portent la légitimité institutionnelle, l’esprit One La Salle et la capacité de mobiliser établissements, familles, jeunes et partenaires autour d’une même intention.',
        image: media.community,
        chips: ['Mission partagée', 'Réseau éducatif', 'Jeunesse', 'Solidarité', 'Fraternité'],
      },
      {
        type: 'flow', index: '04', eyebrow: 'UNE BOUCLE D’IMPACT',
        title: 'La fête n’est pas<br><em>la fin de l’histoire.</em>',
        steps: [
          ['Novembre', 'Annonce & préparation', 'Mobiliser la communauté et préparer une fête de qualité'],
          ['Décembre', 'UMOJA Noël', 'Créer un grand moment de célébration avec les familles'],
          ['Janvier', 'Mois du partage', 'Canaliser l’élan en contributions matérielles et digitales'],
          ['Fin janvier', 'Remise officielle', 'Restituer, remercier et documenter les résultats'],
        ],
        note: 'Une architecture qui donne une continuité réelle au geste solidaire et à la marque UMOJA.',
      },
      {
        type: 'experience', index: '05', eyebrow: 'UNE JOURNÉE À LEUR HAUTEUR',
        title: 'De la joie, du jeu,<br>de la musique et de la famille.',
        items: [
          ['Main Stage', 'Danse, artistes et moments de fierté collective.', media.dance],
          ['Kids Zone', 'Jeux, ateliers et espace de découverte.', media.kids],
          ['Christmas Zone', 'Photos, cadeaux, décor et chaleur de Noël.', media.christmas],
          ['UMOJA Wall', 'Des messages de Noël pour relier les participants.', media.spot],
        ],
      },
      {
        type: 'governance', index: '06', eyebrow: 'LE RÔLE DES FRÈRES',
        title: 'La mission sociale reste<br><em>la référence du projet.</em>',
        items: [
          ['Légitimité', 'Porter le concept One La Salle et l’intention institutionnelle.'],
          ['Bénéficiaires', 'Participer à l’identification, la validation et la protection des enfants concernés.'],
          ['Gouvernance', 'Siéger au comité et veiller au respect de la finalité sociale.'],
          ['Restitution', 'Être présent lors de la remise et de la publication de l’impact.'],
        ],
      },
      {
        type: 'impact', index: '07', eyebrow: 'TRANSPARENCE & DIGNITÉ',
        title: 'Ce qui est collecté pour la cause<br><em>reste affecté à la cause.</em>',
        text: 'Avant toute communication, la structure bénéficiaire ou une shortlist sérieuse est sécurisée. La collecte est tracée, consolidée et remise publiquement avec procès-verbal et preuves.',
        image: media.handover,
        tag: 'Sélection → Convention → Collecte → Vérification → Remise → Publication',
      },
      {
        type: 'closing', index: '08', eyebrow: 'ENSEMBLE',
        title: 'UMOJA rassemble.<br><em>UMOJA célèbre. UMOJA partage.</em>',
        text: 'Une occasion de faire grandir une marque annuelle au service de la jeunesse, de la fraternité et de la solidarité.',
      },
    ],
  },
  btl: {
    audience: 'DOCUMENT INTERNE · BTL AFRICA',
    tone: 'btl',
    chapters: [
      {
        type: 'cover', index: '01', eyebrow: 'DOCUMENT INTERNE · UMOJA 2',
        title: 'Le vrai produit n’est pas<br><em>la boum.</em>',
        text: 'UMOJA est une plateforme annuelle d’engagement communautaire : la fête crée l’attention, le business finance l’exécution, l’impact construit la marque.',
        image: media.stage, tag: 'Stratégie · Business · Production · Impact',
      },
      {
        type: 'statement', index: '02', eyebrow: 'LE MODÈLE EN UNE PHRASE',
        title: 'Une célébration de Noël,<br><em>une mécanique annuelle.</em>',
        text: 'Frères + BTL portent la plateforme. Décembre crée l’expérience. Janvier prolonge la mobilisation. La remise officielle transforme l’action en preuve d’impact.',
        pull: 'Une plateforme récurrente produit une marque, des partenaires, des revenus et de l’impact.',
      },
      {
        type: 'flow', index: '03', eyebrow: 'LE CALENDRIER AGRESSIF',
        title: 'De la validation à la remise,<br><em>une cadence claire.</em>',
        steps: [
          ['Octobre', 'Construction', 'Concept final, budget, juridique, lieu, bénéficiaires, dossier sponsor'],
          ['Novembre', 'Commercialisation', 'Annonce, billetterie, stands, contenus, prestataires et artistes'],
          ['Décembre', 'UMOJA Noël', 'Expérience, activation et contenus de campagne'],
          ['Janvier', 'Partage & remise', 'Collecte, vérification, donation, procès-verbal et rapport'],
        ],
        note: 'Le calendrier exige une validation rapide du concept, du lieu et de la gouvernance.',
      },
      {
        type: 'experience', index: '04', eyebrow: 'LE VILLAGE UMOJA',
        title: 'Un événement conçu<br>comme une destination.',
        items: [
          ['Main Stage', 'DJ, artistes, danse, MC, concours et challenges.', media.dance],
          ['Kids Zone', 'Jeux, gaming, ateliers et mini-tournois.', media.kids],
          ['Christmas Zone', 'Photo corner, cadeaux, décoration et cartes de Noël.', media.christmas],
          ['Food & Brand Village', 'Food, entreprises, artisans, stands et activations.', media.food],
        ],
      },
      {
        type: 'model', index: '05', eyebrow: 'COMMERCIALISATION',
        title: 'Billets, stands, M-Pesa.<br><em>Un parcours simple.</em>',
        lanes: [
          ['Billetterie', 'Standard $5 · Family Pack 4 $15 · Premium $15–20. Les bénéficiaires sont invités et ne sont pas assimilés à des clients payants.'],
          ['Stands', 'Standard $150 · Premium $250 · Corporate $500+. Emplacement, branding, visibilité digitale et activation selon le niveau.'],
          ['UMOJA PAY', 'Billet → M-Pesa → QR → Check-in, puis paiements sur site et don UMOJA.'],
          ['Cible de travail', '1 200 participants × $7 moyen = $8 400 · 20 stands × $200 = $4 000.'],
        ],
      },
      {
        type: 'model', index: '06', eyebrow: 'ARCHITECTURE DES RÔLES',
        title: 'Deux porteurs.<br><em>Une responsabilité partagée.</em>',
        lanes: [
          ['Frères', 'Légitimité institutionnelle, réseau lasallien, bénéficiaires, supervision sociale, gouvernance et présence officielle.'],
          ['BTL Africa', 'Stratégie, business model, sponsoring, tickets, stands, production, communication, digital et reporting ROI.'],
          ['Bénéficiaire', 'Structure identifiée ou shortlistée avant la communication et sécurisée par due diligence et convention.'],
          ['Comité', 'Validation du concept, suivi de la production, séparation des flux et publication des résultats.'],
        ],
      },
      {
        type: 'model', index: '07', eyebrow: 'LES QUATRE MOTEURS',
        title: 'Chaque flux a sa fonction.<br><em>Ils ne se mélangent jamais.</em>',
        lanes: [
          ['Sponsoring', 'Finance la production et vend des droits d’activation.'],
          ['Billetterie · Stands · Partenaires', 'Génèrent les revenus commerciaux d’exploitation.'],
          ['Collecte solidaire', 'Argent et dons en nature affectés exclusivement à la cause.'],
          ['Impact · Reporting', 'Transforme l’édition en plateforme récurrente et vendable.'],
        ],
      },
      {
        type: 'financial', index: '08', eyebrow: 'REVENUS D’EXPLOITATION',
        title: 'Trois scénarios de travail.<br><em>Pas des promesses.</em>',
        scenarios: [
          ['Prudent', '$9 300', '800 billets × $5 · 12 stands × $150 · partenaires secondaires · commissions'],
          ['Cible', '$19 400', '1 200 billets × $7 moyen · 20 stands × $200 · partenaires secondaires · commissions'],
          ['Ambitieux', '$32 150', '1 800 billets × $8 moyen · 25 stands × $250 · partenaires secondaires · commissions'],
        ],
        footnote: 'Hypothèses de travail à affiner avec le lieu, la capacité, les devis et les partenaires signés.',
      },
      {
        type: 'financial', index: '09', eyebrow: 'BUDGET DE TRAVAIL',
        title: 'La qualité d’exécution<br><em>reste non négociable.</em>',
        scenarios: [
          ['Production', 'Scène, son, lumière, aménagement du site et contingence.'],
          ['Expérience', 'Artistes, animation, cadeaux, sécurité, médical et staff.'],
          ['Croissance', 'Communication, contenus, digital, QR, data et billetterie.'],
        ],
        footnote: 'Le budget final est à calibrer sur les devis. Une contingence est indispensable au montage d’un événement à Kinshasa.',
      },
      {
        type: 'model', index: '10', eyebrow: 'GOUVERNANCE FINANCIÈRE',
        title: 'La règle qui protège<br><em>le projet et sa réputation.</em>',
        lanes: [
          ['Sponsoring', 'Finance la plateforme selon les droits négociés ; il n’entre pas automatiquement dans la masse à partager.'],
          ['Résultat distribuable', 'Revenus commerciaux — coûts directement imputables et validés.'],
          ['Partage', '60 % BTL Africa / 40 % Frères sur le résultat distribuable uniquement.'],
          ['Donation', 'Les fonds et dons collectés pour la cause sont isolés et affectés à 100 % à la cause.'],
        ],
      },
      {
        type: 'metrics', index: '11', eyebrow: 'TABLEAU DE BORD FINAL',
        title: 'BTL vend une exécution<br><em>et une preuve de valeur.</em>',
        metrics: [
          ['Business', 'Revenus, dépenses, billetterie, stands, partenaires et résultat'],
          ['Vodacom', 'Transactions, activations, audience, contenu, leads et ROI'],
          ['Impact', 'Montant collecté, dons en nature, valeur distribuée, bénéficiaires'],
          ['Opérations', 'Taux de remplissage, sécurité, parcours, satisfaction, production'],
        ],
        note: 'Le rapport UMOJA Impact & Business est la preuve qui permet de vendre l’édition suivante.',
      },
      {
        type: 'impact', index: '12', eyebrow: 'LE PROCESSUS DE DONATION',
        title: 'La crédibilité se gagne<br><em>avant la collecte.</em>',
        text: 'Le bénéficiaire est identifié ou shortlisté avant le lancement. Puis : due diligence, convention, collecte, consolidation, vérification, remise, procès-verbal et publication.',
        image: media.handover,
        tag: 'Sélection → Due diligence → Convention → Collecte → Vérification → Donation → PV → Publication',
      },
      {
        type: 'closing', index: '13', eyebrow: 'DÉCISION BTL',
        title: 'Valider. Chiffrer. Vendre.<br><em>Produire. Mesurer.</em>',
        text: 'BTL peut faire passer UMOJA du souvenir à une propriété événementielle annuelle : UMOJA 2026, UMOJA 2027, UMOJA 2028 — une marque qui reste, des causes qui évoluent.',
      },
    ],
  },
};

const MIME = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.svg': 'image/svg+xml',
};

function sendJson(res, status, payload) {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' });
  res.end(JSON.stringify(payload));
}

function readJson(req) {
  return new Promise((resolve, reject) => {
    let raw = '';
    req.on('data', chunk => { raw += chunk; if (raw.length > 10_000) req.destroy(); });
    req.on('end', () => { try { resolve(JSON.parse(raw || '{}')); } catch { reject(new Error('invalid_json')); } });
    req.on('error', reject);
  });
}

function serveStatic(req, res) {
  const requestPath = req.url === '/' ? '/index.html' : decodeURIComponent(req.url.split('?')[0]);
  const cleanPath = normalize(requestPath).replace(/^([.][.][/\\])+/, '');
  const filePath = join(PUBLIC_DIR, cleanPath);
  if (!filePath.startsWith(PUBLIC_DIR) || !existsSync(filePath) || !statSync(filePath).isFile()) {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Not found');
    return;
  }
  res.writeHead(200, { 'Content-Type': MIME[extname(filePath)] || 'application/octet-stream', 'Cache-Control': 'no-cache' });
  createReadStream(filePath).pipe(res);
}

const server = http.createServer(async (req, res) => {
  try {
    if (req.method === 'POST' && req.url === '/api/login') {
      const { profile, password } = await readJson(req);
      if (!passwords[profile] || passwords[profile] !== password) return sendJson(res, 401, { ok: false, message: 'Mot de passe incorrect.' });
      const token = randomUUID();
      sessions.set(token, { profile, createdAt: Date.now() });
      return sendJson(res, 200, { ok: true, token, profile });
    }
    if (req.method === 'GET' && req.url.startsWith('/api/deck')) {
      const url = new URL(req.url, `http://${req.headers.host}`);
      const session = sessions.get(url.searchParams.get('token'));
      if (!session || Date.now() - session.createdAt > 4 * 60 * 60 * 1000) return sendJson(res, 401, { ok: false, message: 'Session expirée. Reconnectez-vous.' });
      return sendJson(res, 200, { ok: true, deck: { ...decks[session.profile], common } });
    }
    if (req.method === 'POST' && req.url === '/api/logout') return sendJson(res, 200, { ok: true });
    if (req.method === 'GET') return serveStatic(req, res);
    sendJson(res, 405, { ok: false, message: 'Méthode non autorisée.' });
  } catch (error) {
    sendJson(res, 500, { ok: false, message: 'Une erreur interne est survenue.' });
  }
});

server.listen(PORT, '0.0.0.0', () => console.log(`UMOJA presentation listening on ${PORT}`));
