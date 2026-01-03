#!/usr/bin/env python3
"""
Database Viewer Script for FOG Platform
Allows admins to view users and content directly from the database
"""

import os
import sys
from datetime import datetime
try:
    from tabulate import tabulate
except ImportError:
    print("Installing tabulate...")
    import subprocess
    subprocess.check_call([sys.executable, "-m", "pip", "install", "tabulate"])
    from tabulate import tabulate

# Add the current directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from database import SessionLocal
from models import User, LibraryItem, PrayerRequest
from sqlalchemy import func

def view_users():
    """Display all users in a formatted table."""
    db = SessionLocal()
    try:
        users = db.query(User).order_by(User.created_at.desc()).all()
        
        if not users:
            print("No users found in database.")
            return
        
        table_data = []
        for user in users:
            table_data.append([
                user.id,
                user.full_name,
                user.email,
                user.username,
                user.phone or "N/A",
                user.location or "N/A",
                "Admin" if user.is_admin else "Member",
                "Active" if user.is_active else "Inactive",
                user.created_at.strftime("%Y-%m-%d") if user.created_at else "N/A"
            ])
        
        headers = ["ID", "Full Name", "Email", "Username", "Phone", "Location", "Role", "Status", "Joined"]
        print("\n" + "="*120)
        print("USERS DATABASE")
        print("="*120)
        print(tabulate(table_data, headers=headers, tablefmt="grid"))
        print(f"\nTotal Users: {len(users)}")
        
        # Statistics
        active_count = sum(1 for u in users if u.is_active)
        admin_count = sum(1 for u in users if u.is_admin)
        print(f"Active Users: {active_count}")
        print(f"Administrators: {admin_count}")
        print(f"Inactive Users: {len(users) - active_count}")
        
    finally:
        db.close()

def view_content_summary():
    """Display content summary."""
    db = SessionLocal()
    try:
        # Library items
        library_count = db.query(LibraryItem).count()
        
        # Prayer requests
        prayer_count = db.query(PrayerRequest).count()
        pending_prayers = db.query(PrayerRequest).filter(PrayerRequest.status == "pending").count()
        
        print("\n" + "="*120)
        print("CONTENT SUMMARY")
        print("="*120)
        
        content_data = [
            ["Library Items", library_count],
            ["Prayer Requests", prayer_count],
            ["Pending Prayers", pending_prayers],
        ]
        
        print(tabulate(content_data, headers=["Content Type", "Count"], tablefmt="grid"))
        
        # Recent library items
        recent_library = db.query(LibraryItem).order_by(LibraryItem.created_at.desc()).limit(5).all()
        if recent_library:
            print("\nRecent Library Items:")
            library_table = []
            for item in recent_library:
                library_table.append([
                    item.id,
                    item.title,
                    item.type,
                    item.category,
                    item.created_at.strftime("%Y-%m-%d") if item.created_at else "N/A"
                ])
            print(tabulate(library_table, headers=["ID", "Title", "Type", "Category", "Created"], tablefmt="grid"))
        
    finally:
        db.close()

def search_user(search_term):
    """Search for users by name, email, or username."""
    db = SessionLocal()
    try:
        users = db.query(User).filter(
            (User.full_name.ilike(f"%{search_term}%")) |
            (User.email.ilike(f"%{search_term}%")) |
            (User.username.ilike(f"%{search_term}%"))
        ).all()
        
        if not users:
            print(f"No users found matching '{search_term}'")
            return
        
        table_data = []
        for user in users:
            table_data.append([
                user.id,
                user.full_name,
                user.email,
                user.username,
                user.phone or "N/A",
                "Admin" if user.is_admin else "Member",
                "Active" if user.is_active else "Inactive"
            ])
        
        headers = ["ID", "Full Name", "Email", "Username", "Phone", "Role", "Status"]
        print(f"\nSearch Results for '{search_term}':")
        print(tabulate(table_data, headers=headers, tablefmt="grid"))
        
    finally:
        db.close()

def export_users_csv():
    """Export users to CSV file."""
    import csv
    db = SessionLocal()
    try:
        users = db.query(User).all()
        
        filename = f"users_export_{datetime.now().strftime('%Y%m%d_%H%M%S')}.csv"
        with open(filename, 'w', newline='', encoding='utf-8') as csvfile:
            fieldnames = ['ID', 'Full Name', 'Email', 'Username', 'Phone', 'Location', 'Role', 'Status', 'Created At']
            writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
            writer.writeheader()
            
            for user in users:
                writer.writerow({
                    'ID': user.id,
                    'Full Name': user.full_name,
                    'Email': user.email,
                    'Username': user.username,
                    'Phone': user.phone or '',
                    'Location': user.location or '',
                    'Role': 'Admin' if user.is_admin else 'Member',
                    'Status': 'Active' if user.is_active else 'Inactive',
                    'Created At': user.created_at.strftime("%Y-%m-%d %H:%M:%S") if user.created_at else ''
                })
        
        print(f"\n✓ Users exported to {filename}")
        print(f"  Total users exported: {len(users)}")
        
    finally:
        db.close()

def main():
    """Main menu."""
    while True:
        print("\n" + "="*60)
        print("FOG PLATFORM - DATABASE VIEWER")
        print("="*60)
        print("1. View All Users")
        print("2. View Content Summary")
        print("3. Search User")
        print("4. Export Users to CSV")
        print("5. Exit")
        print("="*60)
        
        choice = input("\nSelect an option (1-5): ").strip()
        
        if choice == "1":
            view_users()
        elif choice == "2":
            view_content_summary()
        elif choice == "3":
            search_term = input("Enter search term (name, email, or username): ").strip()
            if search_term:
                search_user(search_term)
            else:
                print("Please enter a search term.")
        elif choice == "4":
            export_users_csv()
        elif choice == "5":
            print("Goodbye!")
            break
        else:
            print("Invalid option. Please try again.")

if __name__ == "__main__":
    main()

