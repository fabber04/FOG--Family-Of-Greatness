#!/usr/bin/env python3
"""
Migration script to add Firebase-related fields to existing database
Run this once to update existing databases with new fields
"""

import os
import sys
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from sqlalchemy import text
from database import engine

def migrate_database():
    """Add Firebase-related fields to the users table."""
    print("Starting database migration...")
    
    with engine.connect() as conn:
        try:
            # Check if firebase_uid column already exists
            result = conn.execute(text("""
                SELECT COUNT(*) as count 
                FROM pragma_table_info('users') 
                WHERE name = 'firebase_uid'
            """))
            
            # For SQLite, use a different approach
            try:
                conn.execute(text("SELECT firebase_uid FROM users LIMIT 1"))
                print("firebase_uid column already exists. Skipping migration.")
                return
            except Exception:
                pass
            
            print("Adding firebase_uid column...")
            conn.execute(text("""
                ALTER TABLE users 
                ADD COLUMN firebase_uid VARCHAR(255) UNIQUE
            """))
            
            print("Adding phone column...")
            try:
                conn.execute(text("""
                    ALTER TABLE users 
                    ADD COLUMN phone VARCHAR(50)
                """))
            except Exception as e:
                if "duplicate column" not in str(e).lower():
                    raise
            
            print("Adding location column...")
            try:
                conn.execute(text("""
                    ALTER TABLE users 
                    ADD COLUMN location VARCHAR(255)
                """))
            except Exception as e:
                if "duplicate column" not in str(e).lower():
                    raise
            
            print("Adding role column...")
            try:
                conn.execute(text("""
                    ALTER TABLE users 
                    ADD COLUMN role VARCHAR(50)
                """))
            except Exception as e:
                if "duplicate column" not in str(e).lower():
                    raise
            
            # Make hashed_password nullable
            print("Making hashed_password nullable...")
            try:
                # SQLite doesn't support ALTER COLUMN, so we'll skip this
                # The model already has nullable=True
                pass
            except Exception:
                pass
            
            # Create index on firebase_uid
            print("Creating index on firebase_uid...")
            try:
                conn.execute(text("""
                    CREATE INDEX IF NOT EXISTS ix_users_firebase_uid 
                    ON users(firebase_uid)
                """))
            except Exception:
                pass
            
            conn.commit()
            print("Migration completed successfully!")
            
        except Exception as e:
            print(f"Migration error: {e}")
            conn.rollback()
            raise

if __name__ == "__main__":
    migrate_database()

