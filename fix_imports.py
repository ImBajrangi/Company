import os

files = [
    'login.html',
    'index.html',
    'Vrindopnishad Web/Pictures/main/Gallery.html',
    'Vrindopnishad Web/Pictures/main/photos.html',
    'Projects/Vrinda-Tours/vrinda-tours.html',
    'Projects/Cloud-Kitchen/kitchen.html'
]

for file in files:
    try:
        with open(file, 'r') as f:
            content = f.read()
            
        if '"firebase/database"' not in content and '"firebase/analytics"' in content:
            # Replace target content 
            target1 = '"firebase/analytics": "https://www.gstatic.com/firebasejs/10.8.0/firebase-analytics.js"'
            replacement1 = '"firebase/analytics": "https://www.gstatic.com/firebasejs/10.8.0/firebase-analytics.js",\n          "firebase/database": "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js"'
            
            target2 = '"firebase/analytics": "https://www.gstatic.com/firebasejs/10.8.0/firebase-analytics.js"\n        }'
            replacement2 = '"firebase/analytics": "https://www.gstatic.com/firebasejs/10.8.0/firebase-analytics.js",\n            "firebase/database": "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js"\n        }'
            
            if target2 in content:
                content = content.replace(target2, replacement2)
            elif target1 in content:
                content = content.replace(target1, replacement1)
                
            with open(file, 'w') as f:
                f.write(content)
            print(f"Updated {file}")
        else:
            print(f"Skipped {file}")
            
    except Exception as e:
        print(f"Error processing {file}: {e}")
