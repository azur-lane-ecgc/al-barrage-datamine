import json
import re
from typing import Dict, List, Set, Any, Optional
from pathlib import Path


def load_json(file_path: str) -> Dict[str, Any]:
    """Load JSON data from file."""
    with open(file_path, 'r', encoding='utf-8') as f:
        return json.load(f)


def save_json(data: Dict[str, Any], file_path: str) -> None:
    """Save data to JSON file with sorted keys."""
    with open(file_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False, sort_keys=True)


def create_ship_barrages_json() -> None:
    """Gather and write enhanced output/barrages.json (SHIP barrages)."""
    print("Creating ship barrages JSON...")
    
    # Load data
    ships = load_json("AzurLaneData/data/ships.json")
    barrages = load_json("AzurLaneData/data/barrages.json")
    augments = load_json("AzurLaneData/data/augments.json")
    
    all_skill_ids: Set[int] = set()
    skill_to_ships: Dict[int, Set[str]] = {}
    
    def add_skill_and_ship(skill_id: int, ship_name: str) -> None:
        all_skill_ids.add(skill_id)
        if skill_id not in skill_to_ships:
            skill_to_ships[skill_id] = set()
        skill_to_ships[skill_id].add(ship_name)
    
    # Process ships
    for ship in ships.values():
        # Regular skills
        for skill_group in ship.get("skills", []):
            if isinstance(skill_group, list):
                for skill_id in skill_group:
                    add_skill_and_ship(skill_id, ship["name"])
        
        # Retrofit skills
        if "retro" in ship and ship["retro"] and "skills" in ship["retro"]:
            for skill in ship["retro"]["skills"]:
                if "with" in skill and skill["with"]:
                    add_skill_and_ship(skill["with"], ship["name"])
        
        # Research skills
        if "research" in ship and ship["research"]:
            for level in ship["research"]:
                if "fate" in level and level["fate"] and "skills" in level["fate"]:
                    for skill in level["fate"]["skills"]:
                        if "with" in skill and skill["with"]:
                            add_skill_and_ship(skill["with"], ship["name"])
        
        # Unique augment skills
        if "unique_aug" in ship and ship["unique_aug"]:
            augment_id = ship["unique_aug"]
            if str(augment_id) in augments:
                augment = augments[str(augment_id)]
                if "skill_upgrades" in augment and augment["skill_upgrades"]:
                    for upgrade in augment["skill_upgrades"]:
                        if "with" in upgrade and upgrade["with"]:
                            add_skill_and_ship(upgrade["with"], ship["name"])
    
    # Build result
    result = {}
    for skill_id in sorted(all_skill_ids):
        skill_id_str = str(skill_id)
        if skill_id_str in barrages:
            barrage_array = barrages[skill_id_str]
            enhanced_barrages = []
            
            for barrage in barrage_array:
                enhanced_barrage = barrage.copy()
                # Replace parentheses pattern
                enhanced_barrage["name"] = re.sub(
                    r'\s*\(([^)]+)\)$', 
                    r'\n(\1)', 
                    barrage["name"]
                )
                enhanced_barrages.append(enhanced_barrage)
            
            result[skill_id_str] = {
                "barrages": enhanced_barrages,
                "ships": sorted(list(skill_to_ships.get(skill_id, [])))
            }
    
    save_json(result, "output/barrages.json")
    print(f"output/barrages.json written with {len(result)} entries.")


def create_equip_and_aug_barrage_json() -> None:
    """Write enhanced output/barrages2.json (EQUIP + AUGMENT barrages)."""
    print("Creating equipment and augment barrages JSON...")
    
    # Load data
    barrages = load_json("AzurLaneData/data/barrages.json")
    augments = load_json("AzurLaneData/data/augments.json")
    equips = load_json("AzurLaneData/data/equipments.json")
    
    all_skill_ids: Set[int] = set()
    skill_to_items: Dict[int, Set[str]] = {}
    
    def add_skill_and_item(skill_id: int, item_name: str) -> None:
        all_skill_ids.add(skill_id)
        if skill_id not in skill_to_items:
            skill_to_items[skill_id] = set()
        skill_to_items[skill_id].add(item_name)
    
    # Process equipment
    for equip in equips.values():
        if "skills" in equip and equip["skills"]:
            for skill_id in equip["skills"]:
                add_skill_and_item(skill_id, equip["name"])
    
    # Process augments
    for augment in augments.values():
        if "skills" in augment and augment["skills"]:
            for skill_id in augment["skills"]:
                add_skill_and_item(skill_id, augment["name"])
    
    # Build result
    result = {}
    for skill_id in sorted(all_skill_ids):
        skill_id_str = str(skill_id)
        if skill_id_str in barrages:
            barrage_array = barrages[skill_id_str]
            enhanced_barrages = []
            
            for barrage in barrage_array:
                enhanced_barrage = barrage.copy()
                # Replace parentheses pattern
                enhanced_barrage["name"] = re.sub(
                    r'\s*\(([^)]+)\)$', 
                    r'\n(\1)', 
                    barrage["name"]
                )
                enhanced_barrages.append(enhanced_barrage)
            
            result[skill_id_str] = {
                "barrages": enhanced_barrages,
                "equips": sorted(list(skill_to_items.get(skill_id, [])))
            }
    
    save_json(result, "output/barrages2.json")
    print(f"output/barrages2.json written with {len(result)} entries.")


def apply_targeting_to_all() -> None:
    """Overwrite aim_type in both barrage JSON files."""
    print("Applying targeting data...")
    
    # Load scraped data
    scraped = load_json("src/barrages3.json")

    def patch_file(file_path: str) -> None:
        data = load_json(file_path)
        
        for sid_str, entry in data.items():
            sid = int(sid_str)
            
            # Try exact match first, then fallback to base ID
            exact = scraped.get(str(sid))
            fallback = scraped.get(str((sid // 10) * 10))
            variants = exact or fallback or []
            
            for vi, variant in enumerate(entry["barrages"]):
                if vi >= len(variants):
                    continue
                    
                sv = variants[vi]
                if "parts" not in sv or len(sv["parts"]) != len(variant["parts"]):
                    continue
                
                for pi, part in enumerate(variant["parts"]):
                    # Find matching part by damage and count
                    matching_part = None
                    for sp in sv["parts"]:
                        if (sp.get("damage") == part.get("damage") and 
                            sp.get("count") == part.get("count")):
                            matching_part = sp
                            break
                    
                    part["aim_type"] = matching_part.get("targetting", 0) if matching_part else 0
        
        save_json(data, file_path)
        print(f"Patched targeting in {file_path}")
    
    # Patch both files
    patch_file("output/barrages.json")
    patch_file("output/barrages2.json")


def lua_convert(input_path: str, output_path: str) -> None:
    """Convert JSON to Lua module."""
    def is_valid_lua_id(k: str) -> bool:
        return re.match(r'^[A-Za-z_]\w*$', k) is not None
    
    def escape_str(s: str) -> str:
        return '"' + s.replace('\\', '\\\\').replace('"', '\\"').replace('\n', '\\n') + '"'
    
    def to_lua(v: Any, indent: str = "") -> str:
        if isinstance(v, list):
            if not v:
                return "{}"
            items = [to_lua(x, indent) for x in v]
            return "{ " + ", ".join(items) + " }"
        
        elif isinstance(v, dict):
            if not v:
                return "{}"
            
            lines = []
            # Sort dictionary keys for consistent output
            for k in sorted(v.keys(), key=lambda x: (x.isdigit(), int(x) if x.isdigit() else x)):
                val = v[k]
                key = k if is_valid_lua_id(k) else f'["{k}"]'
                lines.append(f'{indent}  {key} = {to_lua(val, indent + "  ")}')
            
            return "{\n" + ",\n".join(lines) + f"\n{indent}}}"
        
        elif isinstance(v, str):
            return escape_str(v)
        
        elif isinstance(v, (int, float)):
            return str(v)
        
        elif isinstance(v, bool):
            return "true" if v else "false"
        
        else:
            return "nil"
    
    # Load and convert
    data = load_json(input_path)
    lua_body = to_lua(data)
    output_content = f"local p = {lua_body}\n\nreturn p\n"
    
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(output_content)
    
    print(f"Lua module written to {output_path}")


def main() -> None:
    """Run all conversions in order."""
    try:
        create_ship_barrages_json()
        create_equip_and_aug_barrage_json()
        apply_targeting_to_all()
        
        lua_convert("output/barrages.json", "output/data.lua")
        lua_convert("output/barrages2.json", "output/data2.lua")
        
        print("All barrage data written successfully.")
        
    except Exception as err:
        print(f"Error: {err}")
        exit(1)


if __name__ == "__main__":
    main()