import os
import re

routes_dir = 'routes'

def process_file(filepath):
    with open(filepath, 'r') as f:
        content = f.read()

    lines = content.split('\n')
    new_lines = []
    
    i = 0
    changed = False
    while i < len(lines):
        line = lines[i]
        new_lines.append(line)
        
        if 'responses:' in line:
            if i + 1 < len(lines) and re.search(r'\s*\*\s*(200|201):', lines[i+1]):
                i += 1
                new_lines.append(lines[i])
                
                if i + 1 < len(lines) and 'description:' in lines[i+1]:
                    i += 1
                    desc_line = lines[i]
                    new_lines.append(desc_line)
                    
                    indent_match = re.match(r'^(\s*\*\s*)description:', desc_line)
                    if indent_match:
                        prefix = indent_match.group(1)
                        
                        schema_name = os.path.basename(filepath).replace('.js', '')
                        if schema_name == 'salary': schema_name = 'SalarySetting'
                        elif schema_name == 'assignments': schema_name = 'Assignment'
                        elif schema_name == 'commissions': schema_name = 'Commission'
                        elif schema_name == 'employees': schema_name = 'Employee'
                        elif schema_name == 'partners': schema_name = 'Partner'
                        elif schema_name == 'users': schema_name = 'User'
                        else: schema_name = 'Object'
                        
                        is_array = 'list' in desc_line.lower() or 'all' in desc_line.lower()
                        is_delete = 'delete' in desc_line.lower()
                        
                        if is_delete:
                            data_type = f"{prefix}  type: object"
                        elif is_array:
                            data_type = f"{prefix}  type: array\n{prefix}  items:\n{prefix}    $ref: '#/components/schemas/{schema_name}'"
                        else:
                            data_type = f"{prefix}  $ref: '#/components/schemas/{schema_name}'"
                            
                        # If this route already has a content section defined natively, we don't want to duplicate.
                        if i + 1 < len(lines) and 'content:' in lines[i+1]:
                            # skip
                            pass
                        else:
                            injection = f"""{prefix}content:
{prefix}  application/json:
{prefix}    schema:
{prefix}      type: object
{prefix}      properties:
{prefix}        success:
{prefix}          type: boolean
{prefix}        message:
{prefix}          type: string
{prefix}        data:
{data_type}"""
                            new_lines.append(injection)
                            changed = True
        i += 1

    if changed:
        with open(filepath, 'w') as f:
            f.write('\n'.join(new_lines))
        print(f"Updated {filepath}")

for filename in os.listdir(routes_dir):
    if filename.endswith('.js'):
        process_file(os.path.join(routes_dir, filename))
