# Carnet de recettes

Petite application web, à installer sur le téléphone, pour :

- **ranger ses recettes** : photo, ingrédients, étapes, notes, favoris ;
- **les trier** par saison 🌱☀️🍂❄️, par temps (≤ 15 min, ≤ 30 min, ≤ 1 h…), par catégorie ou avec la recherche ;
- **planifier la semaine** (midi et soir), en ajustant le nombre de portions ;
- **obtenir la liste de courses** automatiquement : les ingrédients sont additionnés, convertis (g/kg, cl/l…) et rangés par rayon. On coche ce qu'on a déjà, on ajoute des articles en plus et on partage la liste (WhatsApp, SMS…) ;
- **estimer le prix** : on note le prix d'un produit une seule fois (par exemple celui de La Vie Claire, le bouton 🔎 lance la recherche sur lavieclaire.com) et l'appli calcule le coût des recettes et des courses.

## Écrire les ingrédients

Un ingrédient par ligne, comme dans un livre de cuisine :

```
200 g de farine
3 œufs
2 c. à soupe d'huile d'olive
1/2 l de lait
sel, poivre
```

L'appli comprend la quantité, l'unité et le nom, et affiche ce qu'elle a compris sous le champ.

## Utilisation

Aucune installation et aucun compte : il suffit d'ouvrir `index.html` servi par n'importe quel hébergement statique
(GitHub Pages par exemple). Sur téléphone : menu du navigateur → « Ajouter à l'écran d'accueil ».
L'appli fonctionne ensuite hors connexion.

Les données sont enregistrées **sur le téléphone**. Le menu ⋯ permet d'exporter une sauvegarde (fichier `.json`)
et de l'importer sur un autre appareil, pour sauvegarder ou s'échanger des recettes.

Pour tester en local : `python3 -m http.server` puis ouvrir http://localhost:8000.

## La Vie Claire

La Vie Claire ne propose pas d'accès public à ses prix. Les prix ne peuvent donc pas être récupérés automatiquement :
on les saisit soi-même (une fois par produit), et l'appli les garde en mémoire avec leur date.
