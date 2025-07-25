import argparse
import json
from pathlib import Path


def read_json():
    array_1 = []
    array_2 = []
    parser = argparse.ArgumentParser(description="Read JSON data from a file")
    parser.add_argument(
        "json_file_1",
        type=Path,
        help="Path to the JSON file"
    )
    parser.add_argument(
        "json_file_2",
        type=Path,
        help="Path to the JSON file"
    )
    args = parser.parse_args()

    json_path_1 = args.json_file_1
    json_path_2 = args.json_file_2
    if not json_path_1.exists():
        print(f"Error: File {json_path_1} does not exist.")
        return

    if not json_path_1.is_file():
        print(f"Error: {json_path_1} is not a file.")
        return

    try:
        # Read and parse the JSON content
        data = json.loads(json_path_1.read_text())
        print("JSON data loaded successfully:")
        for key in data:
            if key == "paths":
                for subkey in data[key]:
                    if subkey.startswith("/api"):
                        array_1.append(subkey)
    except json.JSONDecodeError as e:
        print(f"Error decoding JSON: {e}")

    if not json_path_2.exists():
        print(f"Error: File {json_path_2} does not exist.")
        return

    if not json_path_2.is_file():
        print(f"Error: {json_path_2} is not a file.")
        return

    try:
        # Read and parse the JSON content
        data = json.loads(json_path_2.read_text())
        print("JSON data loaded successfully:")
        for key in data:
            if key == "paths":
                for subkey in data[key]:
                    if subkey.startswith("/api"):
                        array_2.append(subkey)
    except json.JSONDecodeError as e:
        print(f"Error decoding JSON: {e}")

    # compare
    print('shared')
    for x in array_1:
        if x in array_2:
            print(x)
    print('arr 1')
    for x in array_1:
        if x not in array_2:
            print(x)

    print('arr 2')
    for x in array_2:
        if x not in array_1:
            print(x)


if __name__ == "__main__":
    read_json()
