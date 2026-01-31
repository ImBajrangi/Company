import os
import json
import requests
from PIL import Image
import pillow_avif
from io import BytesIO

def fix_images():
    base_dir = "/Users/mr.bajrangi/Code/Company"
    json_path = os.path.join(base_dir, "Vrindopnishad Web/class/json/images.json")
    output_dir = os.path.join(base_dir, "Vrindopnishad Web/Pictures/main/images")
    
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
        
    with open(json_path, 'r') as f:
        data = json.load(f)
        
    images = data.get('images', [])
    print(f"Starting conversion for {len(images)} images...")
    
    for img in images:
        img_id = img['id']
        url = img['src']
        output_path = os.path.join(output_dir, f"{img_id}.jpg")
        
        if os.path.exists(output_path):
            print(f"Skipping {img_id}, already exists.")
            continue
            
        print(f"Downloading {img_id} from {url}...")
        try:
            response = requests.get(url, timeout=15)
            response.raise_for_status()
            
            # Open image from bytes
            img_data = Image.open(BytesIO(response.content))
            
            # Convert to RGB (in case of RGBA) and save as JPEG
            # Postimages AVIF might be handled by Pillow if pillow-avif-plugin exists, 
            # but standard Pillow 10+ might handle some AVIF. 
            # Actually, standard Pillow doesn't always handle AVIF without plugin.
            # Let's try.
            
            img_data = img_data.convert("RGB")
            img_data.save(output_path, "JPEG", quality=90)
            print(f"Successfully saved {output_path}")
            
        except Exception as e:
            print(f"Error processing {img_id}: {e}")

if __name__ == "__main__":
    fix_images()
