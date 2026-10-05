"""Consistency checks for the exported workflow.

- the workflow JSON parses
- every Code node's jsCode is identical to a file in src/ (and every src file is used)
- credentials are still placeholders (REPLACE_ME), not real credential ids

Run from the repository root: python scripts/check_consistency.py
"""
import glob
import json
import os
import sys

WORKFLOW = "workflow/linkedin-autopost.json"

with open(WORKFLOW, encoding="utf-8") as f:
    workflow = json.load(f)

sources = {}
for path in glob.glob("src/*.js"):
    with open(path, encoding="utf-8") as f:
        sources[os.path.basename(path)] = f.read().strip()

errors = []
used = set()
for node in workflow["nodes"]:
    if node["type"] != "n8n-nodes-base.code":
        continue
    code = node["parameters"].get("jsCode", "").strip()
    match = [name for name, text in sources.items() if text == code]
    if match:
        used.update(match)
    else:
        errors.append(f'Code node "{node["name"]}" does not match any file in src/')

for name in sorted(set(sources) - used):
    errors.append(f"src/{name} is not used by any Code node in the workflow")

if "REPLACE_ME" not in json.dumps(workflow):
    errors.append("no REPLACE_ME placeholder left: the export may contain real credential ids")

if errors:
    print("\n".join(errors))
    sys.exit(1)
print(f"OK: {len(used)} Code nodes match src/, credentials are placeholders")
