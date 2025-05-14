import os

def rename_images(folder_path, base_name):
    # Supported image extensions
    image_extensions = ('.jpg', '.jpeg', '.png')
    
    # Get list of image files in folder
    images = [f for f in os.listdir(folder_path) if f.lower().endswith(image_extensions)]

    for i, image in enumerate(images, start=1):
        ext = os.path.splitext(image)[1]  # Get file extension
        new_name = f"{base_name}_{i:02d}{ext}"
        old_path = os.path.join(folder_path, image)
        new_path = os.path.join(folder_path, new_name)
        os.rename(old_path, new_path)
        print(f"Renamed '{image}' to '{new_name}'")

if __name__ == "__main__":
    folder = input("Enter the folder path: ").strip()
    base = input("Enter the base image name: ").strip()
    
    if os.path.isdir(folder):
        rename_images(folder, base)
    else:
        print("Invalid folder path.")
