#!/usr/bin/env python3
"""
N.A.J Fashion House - Google Drive Image Sync & Manager
Connects store images directly with client's Google Drive.
Uses official Google Drive v3 API via existing token.
"""

import os
import sys
import json
import mimetypes
import argparse

# Try importing Google Drive client from desktop utility
DRIVE_UTIL_PATH = '/Users/akterhossain/Desktop/drive'
if os.path.exists(DRIVE_UTIL_PATH):
    sys.path.append(DRIVE_UTIL_PATH)

try:
    from gdrive_manager import get_drive_service, list_files, upload_file, create_folder
    DRIVE_AVAILABLE = True
except Exception as e:
    DRIVE_AVAILABLE = False
    print(f"Notice: Google Drive API loader ({e})")

NAJ_FOLDER_ID = "1sUFGleV_WKsrFntIiWRYUBltHYALF6rc"
CATALOG_PATH = os.path.join(os.path.dirname(__file__), "js", "products-data.js")

def list_drive_assets():
    """List all assets inside the N.A.J Fashion Google Drive folder"""
    if not DRIVE_AVAILABLE:
        print("Drive client not initialized.")
        return []
    service = get_drive_service()
    files = list_files(parent_id=NAJ_FOLDER_ID)
    print("\n📦 Google Drive Assets for N.A.J Fashion House:")
    print("-" * 75)
    print(f"{'TYPE':<8} {'FILE NAME':<35} {'DRIVE ID':<35}")
    print("-" * 75)
    for f in files:
        ftype = "FOLDER" if f.get('mimeType') == 'application/vnd.google-apps.folder' else "IMAGE"
        print(f"{ftype:<8} {f.get('name'):<35} {f.get('id'):<35}")
        print(f"         Direct CDN: https://lh3.googleusercontent.com/d/{f.get('id')}")
    print("-" * 75)
    return files

def upload_product_image(file_path):
    """Upload an image to the N.A.J Fashion Drive folder and make it public"""
    if not DRIVE_AVAILABLE:
        print("Drive client not initialized.")
        return None
    if not os.path.exists(file_path):
        print(f"Error: File '{file_path}' does not exist.")
        return None

    service = get_drive_service()
    file_id = upload_file(file_path, parent_id=NAJ_FOLDER_ID)
    if file_id:
        # Make public for CDN embedding
        service.permissions().create(fileId=file_id, body={'type': 'anyone', 'role': 'reader'}).execute()
        cdn_url = f"https://lh3.googleusercontent.com/d/{file_id}"
        print(f"\n✅ Uploaded successfully!")
        print(f"Drive File ID : {file_id}")
        print(f"Direct CDN URL: {cdn_url}")
        print(f"Use in products-data.js: \"gdrive:{file_id}\" or \"{cdn_url}\"\n")
        return file_id
    return None

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description="N.A.J Fashion House - Google Drive Asset Manager")
    parser.add_argument("--list", action="store_true", help="List assets currently in Google Drive folder")
    parser.add_argument("--upload", type=str, help="Upload local image to Google Drive folder")
    args = parser.parse_args()

    if args.list:
        list_drive_assets()
    elif args.upload:
        upload_product_image(args.upload)
    else:
        print("NAJ Fashion House Google Drive Asset Sync")
        print(f"Target Drive Folder ID: {NAJ_FOLDER_ID}")
        print("Usage:")
        print("  python3 drive_sync.py --list")
        print("  python3 drive_sync.py --upload /path/to/dress-image.jpg")
