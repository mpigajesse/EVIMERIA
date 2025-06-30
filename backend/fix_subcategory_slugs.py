#!/usr/bin/env python
"""
Script pour corriger les slugs des sous-catégories et les rendre uniques
"""
import os
import sys
import django

# Configuration Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'jaelleshop.settings')
django.setup()

from products.models import SubCategory
from django.utils.text import slugify

def fix_subcategory_slugs():
    """Corrige les slugs des sous-catégories pour les rendre uniques"""
    print("🔧 Correction des slugs des sous-catégories...")
    
    # Récupérer toutes les sous-catégories
    subcategories = SubCategory.objects.all()
    
    print(f"📊 {subcategories.count()} sous-catégories trouvées")
    
    # Grouper par slug pour identifier les doublons
    slug_groups = {}
    for sc in subcategories:
        if sc.slug not in slug_groups:
            slug_groups[sc.slug] = []
        slug_groups[sc.slug].append(sc)
    
    # Identifier les slugs dupliqués
    duplicated_slugs = {slug: scs for slug, scs in slug_groups.items() if len(scs) > 1}
    
    if not duplicated_slugs:
        print("✅ Aucun slug dupliqué trouvé")
        return
    
    print(f"⚠️  {len(duplicated_slugs)} slugs dupliqués trouvés:")
    for slug, scs in duplicated_slugs.items():
        print(f"  - '{slug}': {len(scs)} sous-catégories")
        for sc in scs:
            print(f"    → {sc.category.name} - {sc.name} (ID: {sc.id})")
    
    # Corriger les slugs dupliqués
    updated_count = 0
    for slug, scs in duplicated_slugs.items():
        print(f"\n🔄 Correction du slug '{slug}'...")
        
        for i, sc in enumerate(scs):
            # Créer un nouveau slug unique: "catégorie-sous-catégorie"
            new_slug = slugify(f"{sc.category.slug}-{sc.name}")
            
            # Vérifier que le nouveau slug n'existe pas déjà
            counter = 1
            original_new_slug = new_slug
            while SubCategory.objects.filter(slug=new_slug).exclude(id=sc.id).exists():
                new_slug = f"{original_new_slug}-{counter}"
                counter += 1
            
            if new_slug != sc.slug:
                old_slug = sc.slug
                sc.slug = new_slug
                sc.save()
                updated_count += 1
                print(f"  ✅ {sc.category.name} - {sc.name}: '{old_slug}' → '{new_slug}'")
            else:
                print(f"  ⏭️  {sc.category.name} - {sc.name}: slug déjà correct")
    
    print(f"\n🎉 Correction terminée ! {updated_count} sous-catégories mises à jour")

def verify_uniqueness():
    """Vérifie que tous les slugs sont maintenant uniques"""
    print("\n🔍 Vérification de l'unicité des slugs...")
    
    slugs = SubCategory.objects.values_list('slug', flat=True)
    unique_slugs = set(slugs)
    
    if len(slugs) == len(unique_slugs):
        print("✅ Tous les slugs sont uniques !")
    else:
        print(f"❌ Il reste {len(slugs) - len(unique_slugs)} doublons")
        
        # Afficher les doublons restants
        from collections import Counter
        slug_counts = Counter(slugs)
        duplicates = {slug: count for slug, count in slug_counts.items() if count > 1}
        if duplicates:
            print("Doublons restants:")
            for slug, count in duplicates.items():
                print(f"  - '{slug}': {count} occurrences")

if __name__ == "__main__":
    try:
        fix_subcategory_slugs()
        verify_uniqueness()
        
        print("\n📋 Nouveau mapping des sous-catégories:")
        for sc in SubCategory.objects.all().order_by('category__name', 'name'):
            print(f"  - {sc.category.name} → {sc.name}: '{sc.slug}'")
            
    except Exception as e:
        print(f"❌ Erreur: {e}")
        sys.exit(1) 