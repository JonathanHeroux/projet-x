# Déploiement Hostinger — Projet X

## Configuration des avatars

Le backend PHP est hébergé dans `projet-x-backend/`, à l'extérieur du dossier public.

Pour permettre l'affichage des nouveaux avatars, ajouter cette configuration dans le fichier privé `projet-x-backend/config/database.php` sur Hostinger :

```php
putenv(
    "AVATAR_UPLOAD_DIR=" .
    dirname(__DIR__, 2) .
    "/public_html/x/uploads/avatars"
);
```

Le dossier `public_html/x/uploads/avatars/` doit exister et être accessible en écriture par PHP.

En local, si `AVATAR_UPLOAD_DIR` n'est pas définie, `AuthController.php` utilise automatiquement `backend/public/uploads/avatars/`.

## Sécurité

Ne jamais publier les identifiants MySQL de production sur GitHub.
