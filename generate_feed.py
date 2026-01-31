import json
import os

def generate_feed():
    base_dir = "/Users/mr.bajrangi/Code/Company"
    json_path = os.path.join(base_dir, "Vrindopnishad Web/class/json/images.json")
    feed_path = os.path.join(base_dir, "google-shopping-feed.xml")
    
    # URL Base for the hosted images
    image_url_base = "https://vrindopnishad.in/Vrindopnishad%20Web/Pictures/main/images/"
    # URL Base for the gallery pages
    gallery_url_base = "https://vrindopnishad.in/Vrindopnishad%20Web/Pictures/main/Gallery.html"

    with open(json_path, 'r') as f:
        data = json.load(f)
    
    images = data.get('images', [])
    
    xml_content = '<?xml version="1.0" encoding="UTF-8"?>\n'
    xml_content += '<rss xmlns:g="http://base.google.com/ns/1.0" version="2.0">\n'
    xml_content += '  <channel>\n'
    xml_content += '    <title>Chitra Vrinda - Vrindopnishad</title>\n'
    xml_content += f'    <link>{gallery_url_base}</link>\n'
    xml_content += '    <description>Divine spiritual art and photography from Vrindavan.</description>\n'
    
    for img in images:
        img_id = img['id']
        title = img.get('title', img.get('alt', 'Divine Art'))
        # Ensure description is at least 100 characters for GMC if possible, 
        # or at least not too short.
        desc = img.get('description', '')
        if len(desc) < 50:
            desc = f"{title} - A beautiful divine artwork from the Chitra Vrinda collection at Vrindopnishad."
            
        xml_content += '    <item>\n'
        xml_content += f'      <g:id>{img_id}</g:id>\n'
        xml_content += f'      <g:title>{title}</g:title>\n'
        xml_content += f'      <g:description>{desc}</g:description>\n'
        xml_content += f'      <g:link>{gallery_url_base}?id={img_id}</g:link>\n'
        # Point to the local JPEG hosted on GitHub
        xml_content += f'      <g:image_link>{image_url_base}{img_id}.jpg</g:image_link>\n'
        xml_content += '      <g:condition>new</g:condition>\n'
        xml_content += '      <g:availability>in_stock</g:availability>\n'
        # Fixed price of 499.00 INR to resolve GMC disapproval
        xml_content += '      <g:price>499.00 INR</g:price>\n'
        xml_content += '      <g:brand>Vrindopnishad</g:brand>\n'
        xml_content += '      <g:identifier_exists>no</g:identifier_exists>\n'
        xml_content += '      <g:shipping>\n'
        xml_content += '        <g:country>IN</g:country>\n'
        xml_content += '        <g:service>Standard</g:service>\n'
        xml_content += '        <g:price>0.00 INR</g:price>\n'
        xml_content += '      </g:shipping>\n'
        xml_content += '      <g:google_product_category>Arts &amp; Entertainment &gt; Hobbies &gt; Creative Arts &gt; Visual Arts</g:google_product_category>\n'
        xml_content += '    </item>\n'
        
    xml_content += '  </channel>\n'
    xml_content += '</rss>\n'
    
    with open(feed_path, 'w', encoding='utf-8') as f:
        f.write(xml_content)
    
    print(f"Successfully generated {feed_path} with {len(images)} items.")

if __name__ == "__main__":
    generate_feed()
