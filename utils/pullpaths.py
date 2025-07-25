import argparse
import json
from pathlib import Path


def read_json():
    parser = argparse.ArgumentParser(description="Read JSON data from a file")
    parser.add_argument(
        "json_file",
        type=Path,
        help="Path to the JSON file"
    )
    args = parser.parse_args()

    json_path = args.json_file
    if not json_path.exists():
        print(f"Error: File {json_path} does not exist.")
        return

    if not json_path.is_file():
        print(f"Error: {json_path} is not a file.")
        return

    try:
        # Read and parse the JSON content
        data = json.loads(json_path.read_text())
        print("JSON data loaded successfully:")
        for key in data:
            if key == "paths":
                for subkey in data[key]:
                    if subkey.startswith("/api"):
                        print(subkey)
    except json.JSONDecodeError as e:
        print(f"Error decoding JSON: {e}")


if __name__ == "__main__":
    read_json()
