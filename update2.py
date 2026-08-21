import os
import re

routes_dir = 'routes'

schemas_def = {
    'assignments': """/**
 * @swagger
 * components:
 *   schemas:
 *     Assignment:
 *       type: object
 *       required:
 *         - startDate
 *       properties:
 *         id:
 *           type: integer
 *         employeeId:
 *           type: integer
 *         partnerId:
 *           type: integer
 *         contractType:
 *           type: string
 *         startDate:
 *           type: string
 *           format: date-time
 *         durationMonths:
 *           type: integer
 *         renewable:
 *           type: boolean
 *         endDate:
 *           type: string
 *           format: date-time
 *         status:
 *           type: string
 *           enum: [actif, termine, a_renouveler]
 */

""",
    'commissions': """/**
 * @swagger
 * components:
 *   schemas:
 *     Commission:
 *       type: object
 *       required:
 *         - amount
 *         - transactionDate
 *       properties:
 *         id:
 *           type: integer
 *         salarySetting_id:
 *           type: integer
 *         employeeId:
 *           type: integer
 *         partnerId:
 *           type: integer
 *         amount:
 *           type: number
 *         period:
 *           type: string
 *           enum: [jour, mois, trimestre, annee]
 *         transactionDate:
 *           type: string
 *           format: date-time
 */

""",
    'employees': """/**
 * @swagger
 * components:
 *   schemas:
 *     Employee:
 *       type: object
 *       required:
 *         - firstName
 *         - lastName
 *       properties:
 *         id:
 *           type: integer
 *         firstName:
 *           type: string
 *         lastName:
 *           type: string
 *         phone:
 *           type: string
 *         origin:
 *           type: string
 *         photoUrl:
 *           type: string
 *         availability:
 *           type: string
 *           enum: [disponible, indisponible]
 *         createdBy:
 *           type: integer
 */

""",
    'partners': """/**
 * @swagger
 * components:
 *   schemas:
 *     Partner:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 *         contactPhone:
 *           type: string
 *         status:
 *           type: string
 *           enum: [actif, a_revoir, expire]
 *         defaultCommissionRate:
 *           type: number
 *         avatarUrl:
 *           type: string
 */

""",
    'salary': """/**
 * @swagger
 * components:
 *   schemas:
 *     SalarySetting:
 *       type: object
 *       required:
 *         - grossSalary
 *         - effectiveMonth
 *       properties:
 *         id:
 *           type: integer
 *         assignmentId:
 *           type: integer
 *         grossSalary:
 *           type: number
 *         commissionRate:
 *           type: number
 *         commissionAmount:
 *           type: number
 *         netSalary:
 *           type: number
 *         effectiveMonth:
 *           type: string
 *           format: date
 */

""",
    'users': """/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - fullName
 *         - email
 *       properties:
 *         id:
 *           type: integer
 *         fullName:
 *           type: string
 *         role:
 *           type: string
 *           enum: [admin, gestionnaire, lecture_seule]
 *         email:
 *           type: string
 *         phone:
 *           type: string
 *         avatarUrl:
 *           type: string
 */

"""
}

def process_file(filepath):
    with open(filepath, 'r') as f:
        content = f.read()

    filename = os.path.basename(filepath)
    name_no_ext = filename.replace('.js', '')

    # 1. Add schema definition at the top if it exists in schemas_def
    if name_no_ext in schemas_def and 'components:' not in content:
        # replace the first '/**'
        content = content.replace('/**', schemas_def[name_no_ext] + '/**', 1)

    lines = content.split('\n')
    new_lines = []
    
    i = 0
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
                        
                        schema_name = name_no_ext
                        if schema_name == 'salary': schema_name = 'SalarySetting'
                        elif schema_name == 'assignments': schema_name = 'Assignment'
                        elif schema_name == 'commissions': schema_name = 'Commission'
                        elif schema_name == 'employees': schema_name = 'Employee'
                        elif schema_name == 'partners': schema_name = 'Partner'
                        elif schema_name == 'users': schema_name = 'User'
                        else: schema_name = 'Object'
                        
                        is_array = 'list' in desc_line.lower() or 'all' in desc_line.lower()
                        is_delete = 'delete' in desc_line.lower()
                        
                        # proper indentation
                        if is_delete:
                            data_type = f"{prefix}          type: object"
                        elif is_array:
                            data_type = f"{prefix}          type: array\n{prefix}          items:\n{prefix}            $ref: '#/components/schemas/{schema_name}'"
                        else:
                            data_type = f"{prefix}          $ref: '#/components/schemas/{schema_name}'"
                            
                        # If this route already has a content section defined natively, we skip
                        if i + 1 < len(lines) and 'content:' in lines[i+1]:
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
        i += 1

    with open(filepath, 'w') as f:
        f.write('\n'.join(new_lines))
    print(f"Processed {filepath}")

for filename in os.listdir(routes_dir):
    if filename.endswith('.js'):
        process_file(os.path.join(routes_dir, filename))
