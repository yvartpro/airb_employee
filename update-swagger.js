const fs = require('fs');
const path = require('path');

const routesDir = path.join(__dirname, 'routes');

const schemasDef = {
  assignments: `/**
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
`,
  commissions: `/**
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
`,
  employees: `/**
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
`,
  partners: `/**
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
`,
  salary: `/**
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
`,
  users: `/**
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
`
};

function processFile(filepath) {
  let content = fs.readFileSync(filepath, 'utf8');
  const filename = path.basename(filepath);
  const nameNoExt = filename.replace('.js', '');

  // 1. Add schema definition at the top if it exists
  if (schemasDef[nameNoExt] && !content.includes('components:')) {
    content = content.replace('/**', schemasDef[nameNoExt] + '\n/**', 1);
  }

  const lines = content.split('\n');
  const newLines = [];
  
  let i = 0;
  let changed = false;
  
  while (i < lines.length) {
    const line = lines[i];
    newLines.push(line);
    
    if (line.includes('responses:')) {
      if (i + 1 < lines.length && /\\s*\\*\\s*(200|201):/.test(lines[i + 1])) {
        i++;
        newLines.push(lines[i]);
        
        if (i + 1 < lines.length && lines[i + 1].includes('description:')) {
          i++;
          const descLine = lines[i];
          newLines.push(descLine);
          
          const indentMatch = descLine.match(/^(\\s*\\*\\s*)description:/);
          if (indentMatch) {
            const prefix = indentMatch[1];
            
            let schemaName = nameNoExt;
            if (schemaName === 'salary') schemaName = 'SalarySetting';
            else if (schemaName === 'assignments') schemaName = 'Assignment';
            else if (schemaName === 'commissions') schemaName = 'Commission';
            else if (schemaName === 'employees') schemaName = 'Employee';
            else if (schemaName === 'partners') schemaName = 'Partner';
            else if (schemaName === 'users') schemaName = 'User';
            else schemaName = 'Object';
            
            const isArray = descLine.toLowerCase().includes('list') || descLine.toLowerCase().includes('all');
            const isDelete = descLine.toLowerCase().includes('delete');
            
            let dataType = '';
            if (isDelete) {
              dataType = \`\${prefix}          type: object\`;
            } else if (isArray) {
              dataType = \`\${prefix}          type: array\\n\${prefix}          items:\\n\${prefix}            $ref: '#/components/schemas/\${schemaName}'\`;
            } else {
              dataType = \`\${prefix}          $ref: '#/components/schemas/\${schemaName}'\`;
            }
            
            if (i + 1 < lines.length && lines[i + 1].includes('content:')) {
              // skip if already has content
            } else {
              const injection = \`\${prefix}content:
\${prefix}  application/json:
\${prefix}    schema:
\${prefix}      type: object
\${prefix}      properties:
\${prefix}        success:
\${prefix}          type: boolean
\${prefix}        message:
\${prefix}          type: string
\${prefix}        data:
\${dataType}\`;
              newLines.push(injection);
              changed = true;
            }
          }
        }
      }
    }
    i++;
  }

  if (changed || (schemasDef[nameNoExt] && !content.includes('components:'))) {
    fs.writeFileSync(filepath, newLines.join('\n'), 'utf8');
    console.log(\`Processed \${filepath}\`);
  }
}

const files = fs.readdirSync(routesDir);
for (const file of files) {
  if (file.endsWith('.js')) {
    processFile(path.join(routesDir, file));
  }
}
