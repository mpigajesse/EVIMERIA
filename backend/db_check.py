#!/usr/bin/env python
"""
Script pour vérifier la connexion à la base de données PostgreSQL.
"""
import os
import sys
import time
import psycopg2


def check_db_connection():
    """Vérifie la connexion à la base de données via DATABASE_URL."""
    print("Vérification de la connexion à la base de données...")
    db_url = os.environ.get("DATABASE_URL")
    if not db_url:
        print("Aucune variable DATABASE_URL trouvée")
        return False
    
    # Masquer les informations sensibles dans les logs
    masked_url = db_url
    if "@" in db_url:
        protocol_part = db_url.split("://")[0]
        credentials_host_part = db_url.split("://")[1]
        host_part = credentials_host_part.split("@")[1] if "@" in credentials_host_part else credentials_host_part
        masked_url = f"{protocol_part}://*****@{host_part}"
    
    print(f"Tentative de connexion avec: {masked_url}")
    
    try:
        conn = psycopg2.connect(db_url)
        cursor = conn.cursor()
        cursor.execute("SELECT 1")
        cursor.close()
        conn.close()
        print("Connexion à la base de données réussie!")
        return True
    except Exception as e:
        print(f"Erreur de connexion: {e}")
        return False


def main():
    """Point d'entrée principal."""
    # Essayer de se connecter plusieurs fois
    max_attempts = 30
    for i in range(1, max_attempts + 1):
        print(f"Tentative {i}/{max_attempts}...")
        if check_db_connection():
            sys.exit(0)
        time.sleep(1)
    
    print(f"Échec de connexion après {max_attempts} tentatives")
    sys.exit(1)


if __name__ == "__main__":
    main() 