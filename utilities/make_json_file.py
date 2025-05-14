import os
import json

def collect_images(base_folder='images'):
    image_data = []

    # Traverse the first-level folders (A, B, C, ...)
    for top_folder in os.listdir(base_folder):
        top_folder_path = os.path.join(base_folder, top_folder)

        if not os.path.isdir(top_folder_path):
            continue

        # Get second-level subfolders (chihuahua, muffin | banana, duck | ...)
        subfolders = [
            name for name in os.listdir(top_folder_path)
            if os.path.isdir(os.path.join(top_folder_path, name))
        ]

        # Create a tag a or b for each pair of second-level subfolders
        for i, subfolder in enumerate(subfolders):
            subfolder_path = os.path.join(top_folder_path, subfolder)
            tag = 'a' if i == 0 else 'b'

            # List image files
            for file in os.listdir(subfolder_path):
                if file.lower().endswith(('.png', '.jpg', '.jpeg', '.bmp', '.gif')):
                    relative_path = os.path.join(base_folder, top_folder, subfolder, file)
                    image_data.append({
                        'path': relative_path,
                        'category': top_folder,
                        # 'label': subfolder,
                        'tag': tag
                    })

    return image_data

def save_json(data, output_file='images_data.json'):
    with open(output_file, 'w') as f:
        json.dump(data, f, indent=4)

if __name__ == '__main__':
    images_info = collect_images('images')
    save_json(images_info)
    print(f"Saved {len(images_info)} image entries to 'images_data.json'")
