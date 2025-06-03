import csv
import uuid
from datetime import datetime
import os

EXISTING_DIR = "./existing"
NEW_PATH = "./new.csv"
OUTPUT_PATH = "./merged.csv"

FIELDS = [
    "id", "level", "word", "meaning", "example", "topic", "subtopic",
    "is_wrong", "is_favorite", "created_at", "is_verb",
    "past_tense", "past_participle", "du_form", "er_form"
]

def read_csv(path):
    with open(path, newline='', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        return list(reader)

def write_csv(path, data):
    with open(path, "w", newline='', encoding='utf-8') as f:
        writer = csv.DictWriter(f, fieldnames=FIELDS)
        writer.writeheader()
        writer.writerows(data)

def print_entry(label, row):
    print(f"> {label} :")
    print(f" level: {row['level']}, word: {row['word']}, meaning: {row['meaning']}")
    print(f" example: {row['example']}")
    print(f" topic: {row['topic']}, subtopic: {row['subtopic']}, is_verb: {row['is_verb']}")
    print(f" past_tense: {row['past_tense']}, past_participle: {row['past_participle']}, du_form: {row['du_form']}, er_form: {row['er_form']}")
    print()

def normalize(word):
    return word.strip().lower()

def collect_existing_by_level():
    all_existing = {}
    for filename in os.listdir(EXISTING_DIR):
        if not filename.endswith(".csv"):
            continue
        path = os.path.join(EXISTING_DIR, filename)
        rows = read_csv(path)
        for row in rows:
            word_key = normalize(row["word"])
            if word_key not in all_existing:
                all_existing[word_key] = []
            all_existing[word_key].append(row)
    return all_existing

def read_existing_by_level(level):
    filepath = os.path.join(EXISTING_DIR, f"{level} Table.csv")
    return read_csv(filepath), filepath

def main():
    new_rows = read_csv(NEW_PATH)
    all_existing_words = collect_existing_by_level()

    if not new_rows:
        print("new.csv is empty.")
        return

    level = new_rows[0]["level"]
    existing_rows, existing_path = read_existing_by_level(level)
    merged = existing_rows.copy()

    for new_row in new_rows:
        word_key = normalize(new_row["word"])

        if word_key in all_existing_words:
            duplicate_entries = all_existing_words[word_key]

            found_in_other_level = any(entry["level"] != level for entry in duplicate_entries)
            found_in_current_level = any(entry["level"] == level for entry in duplicate_entries)

            if found_in_other_level:
                print(f"⚠️ Word '{new_row['word']}' already exists in another level. Skipping it from B1 merge.")
                continue

            if found_in_current_level:
                print("Duplicate Word already exists in Existing File!")
                print_entry("New File", new_row)
                print_entry("Existing File", duplicate_entries[0])

                while True:
                    choice = input("Which one do you want to keep? (1 : New, 2 : Existing)\n> ").strip()
                    if choice == "1":
                        merged = [row for row in merged if normalize(row["word"]) != word_key]
                        merged.append(new_row)
                        break
                    elif choice == "2":
                        break
                    else:
                        print("Invalid input. Please enter 1 or 2.")
        else:
            merged.append(new_row)

    write_csv(OUTPUT_PATH, merged)
    print(f"\n✅ Merge complete. Output saved to: {OUTPUT_PATH}")

if __name__ == "__main__":
    main()
