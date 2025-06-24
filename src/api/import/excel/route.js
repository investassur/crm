async function handler({ file, base64Data }) {
  const session = getSession();

  if (!session?.user?.id) {
    return { error: "Non autorisé" };
  }

  if (!file && !base64Data) {
    return { error: "Fichier Excel requis" };
  }

  try {
    let fileBuffer;

    if (base64Data) {
      const base64Content = base64Data.split(",")[1] || base64Data;
      fileBuffer = Buffer.from(base64Content, "base64");
    } else if (file) {
      const uploadResult = await upload({ url: file });
      if (uploadResult.error) {
        return { error: "Erreur lors du téléchargement du fichier" };
      }

      const response = await fetch(uploadResult.url);
      fileBuffer = await response.arrayBuffer();
    }

    const workbook = parseExcelFile(fileBuffer);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = parseWorksheetToJson(worksheet);

    if (!data || data.length === 0) {
      return { error: "Aucune donnée trouvée dans le fichier Excel" };
    }

    const headers = Object.keys(data[0]).map((h) => h.toLowerCase().trim());
    const dataType = detectDataType(headers);

    let importResult;
    if (dataType === "contacts") {
      importResult = await importContacts(data, session.user.id);
    } else if (dataType === "contracts") {
      importResult = await importContracts(data, session.user.id);
    } else {
      return {
        error:
          "Type de données non reconnu. Le fichier doit contenir des colonnes pour contacts ou contrats.",
      };
    }

    return {
      success: true,
      type: dataType,
      ...importResult,
    };
  } catch (error) {
    return { error: `Erreur lors de l'import: ${error.message}` };
  }
}

function parseExcelFile(buffer) {
  const data = new Uint8Array(buffer);
  let workbook;

  try {
    workbook = {
      SheetNames: ["Sheet1"],
      Sheets: {
        Sheet1: parseCSVLikeData(data),
      },
    };
  } catch (error) {
    throw new Error("Format de fichier non supporté");
  }

  return workbook;
}

function parseCSVLikeData(data) {
  const text = new TextDecoder().decode(data);
  const lines = text.split("\n").filter((line) => line.trim());

  if (lines.length === 0) return {};

  const headers = lines[0]
    .split(/[,;\t]/)
    .map((h) => h.trim().replace(/"/g, ""));
  const rows = {};

  lines.slice(1).forEach((line, index) => {
    const values = line.split(/[,;\t]/).map((v) => v.trim().replace(/"/g, ""));
    headers.forEach((header, colIndex) => {
      const cellRef = String.fromCharCode(65 + colIndex) + (index + 2);
      if (!rows[cellRef]) rows[cellRef] = {};
      rows[cellRef].v = values[colIndex] || "";
    });
  });

  const headerRow = {};
  headers.forEach((header, index) => {
    const cellRef = String.fromCharCode(65 + index) + "1";
    headerRow[cellRef] = { v: header };
  });

  return { ...headerRow, ...rows };
}

function parseWorksheetToJson(worksheet) {
  const data = [];
  const range = getWorksheetRange(worksheet);

  if (!range) return data;

  const headers = [];
  for (let col = range.s.c; col <= range.e.c; col++) {
    const cellRef = String.fromCharCode(65 + col) + "1";
    const cell = worksheet[cellRef];
    headers.push(cell ? cell.v : `Column${col + 1}`);
  }

  for (let row = range.s.r + 1; row <= range.e.r; row++) {
    const rowData = {};
    let hasData = false;

    for (let col = range.s.c; col <= range.e.c; col++) {
      const cellRef = String.fromCharCode(65 + col) + (row + 1);
      const cell = worksheet[cellRef];
      const value = cell ? cell.v : "";

      rowData[headers[col]] = value;
      if (value) hasData = true;
    }

    if (hasData) data.push(rowData);
  }

  return data;
}

function getWorksheetRange(worksheet) {
  const cells = Object.keys(worksheet).filter((key) =>
    key.match(/^[A-Z]+\d+$/)
  );
  if (cells.length === 0) return null;

  let minRow = Infinity,
    maxRow = 0,
    minCol = Infinity,
    maxCol = 0;

  cells.forEach((cell) => {
    const match = cell.match(/^([A-Z]+)(\d+)$/);
    if (match) {
      const col = match[1].charCodeAt(0) - 65;
      const row = parseInt(match[2]) - 1;

      minRow = Math.min(minRow, row);
      maxRow = Math.max(maxRow, row);
      minCol = Math.min(minCol, col);
      maxCol = Math.max(maxCol, col);
    }
  });

  return {
    s: { r: minRow, c: minCol },
    e: { r: maxRow, c: maxCol },
  };
}

function detectDataType(headers) {
  const contactFields = [
    "contact",
    "ville",
    "création",
    "signature",
    "origine",
    "statut",
    "attribution",
  ];
  const contractFields = [
    "nom",
    "prénom",
    "ville",
    "signature",
    "effet",
    "contrat",
    "compagnie",
    "cotisation",
    "commission",
  ];

  const contactMatches = contactFields.filter((field) =>
    headers.some((header) => header.includes(field))
  ).length;

  const contractMatches = contractFields.filter((field) =>
    headers.some((header) => header.includes(field))
  ).length;

  return contractMatches > contactMatches ? "contracts" : "contacts";
}

async function importContacts(data, userId) {
  const results = { success: 0, errors: [] };

  for (let i = 0; i < data.length; i++) {
    try {
      const row = data[i];
      const contact = mapContactData(row);

      if (!contact.first_name || !contact.last_name) {
        results.errors.push(`Ligne ${i + 2}: Nom et prénom requis`);
        continue;
      }

      await sql`
        INSERT INTO prospects (
          first_name, last_name, email, phone, ville, 
          date_creation, date_signature, origine, status, 
          statut_detail, attribution, assigned_to
        ) VALUES (
          ${contact.first_name}, ${contact.last_name}, ${contact.email}, 
          ${contact.phone}, ${contact.ville}, ${contact.date_creation}, 
          ${contact.date_signature}, ${contact.origine}, ${contact.status}, 
          ${contact.statut_detail}, ${contact.attribution}, ${userId}
        )
      `;

      results.success++;
    } catch (error) {
      results.errors.push(`Ligne ${i + 2}: ${error.message}`);
    }
  }

  return results;
}

async function importContracts(data, userId) {
  const results = { success: 0, errors: [] };

  for (let i = 0; i < data.length; i++) {
    try {
      const row = data[i];
      const contract = mapContractData(row);

      if (!contract.first_name || !contract.last_name) {
        results.errors.push(`Ligne ${i + 2}: Nom et prénom requis`);
        continue;
      }

      let prospectId = null;

      const existingProspect = await sql`
        SELECT id FROM prospects 
        WHERE first_name = ${contract.first_name} 
        AND last_name = ${contract.last_name}
        LIMIT 1
      `;

      if (existingProspect.length > 0) {
        prospectId = existingProspect[0].id;
      } else {
        const newProspect = await sql`
          INSERT INTO prospects (first_name, last_name, ville, assigned_to)
          VALUES (${contract.first_name}, ${contract.last_name}, ${contract.ville}, ${userId})
          RETURNING id
        `;
        prospectId = newProspect[0].id;
      }

      await sql`
        INSERT INTO contracts (
          prospect_id, contract_number, product_type, premium_amount,
          ville, date_signature, date_effet, fin_contrat, compagnie,
          cotisation_mensuelle, cotisation_annuelle, commission_mensuelle,
          commission_annuelle, commission_premiere_annee, annee_recurrente,
          annee_recu, status, statut_detail, attribution, pays, charge, depenses
        ) VALUES (
          ${prospectId}, ${contract.contract_number}, ${contract.product_type},
          ${contract.premium_amount}, ${contract.ville}, ${contract.date_signature},
          ${contract.date_effet}, ${contract.fin_contrat}, ${contract.compagnie},
          ${contract.cotisation_mensuelle}, ${contract.cotisation_annuelle},
          ${contract.commission_mensuelle}, ${contract.commission_annuelle},
          ${contract.commission_premiere_annee}, ${contract.annee_recurrente},
          ${contract.annee_recu}, ${contract.status}, ${contract.statut_detail},
          ${contract.attribution}, ${contract.pays}, ${contract.charge}, ${contract.depenses}
        )
      `;

      results.success++;
    } catch (error) {
      results.errors.push(`Ligne ${i + 2}: ${error.message}`);
    }
  }

  return results;
}

function mapContactData(row) {
  const keys = Object.keys(row);

  return {
    first_name: findValue(keys, row, [
      "prénom",
      "prenom",
      "first_name",
      "firstname",
    ]),
    last_name: findValue(keys, row, [
      "nom",
      "last_name",
      "lastname",
      "contact",
    ]),
    email: findValue(keys, row, ["email", "mail", "e-mail"]),
    phone: findValue(keys, row, ["téléphone", "telephone", "phone", "tel"]),
    ville: findValue(keys, row, ["ville", "city"]),
    date_creation: parseDate(
      findValue(keys, row, ["création", "creation", "date_creation"])
    ),
    date_signature: parseDate(
      findValue(keys, row, ["signature", "date_signature"])
    ),
    origine: findValue(keys, row, ["origine", "source"]),
    status: mapStatus(findValue(keys, row, ["statut", "status"])),
    statut_detail: findValue(keys, row, ["statut", "status"]),
    attribution: findValue(keys, row, ["attribution", "assigned"]),
  };
}

function mapContractData(row) {
  const keys = Object.keys(row);

  return {
    first_name: findValue(keys, row, ["prénom", "prenom", "first_name"]),
    last_name: findValue(keys, row, ["nom", "last_name", "lastname"]),
    contract_number: findValue(keys, row, [
      "contrat",
      "contract",
      "numero",
      "n°",
    ]),
    product_type: "Assurance",
    premium_amount:
      parseNumber(
        findValue(keys, row, [
          "cotisation_annuelle",
          "cotisation annuelle",
          "prime",
        ])
      ) || 0,
    ville: findValue(keys, row, ["ville", "city"]),
    date_signature: parseDate(
      findValue(keys, row, ["signature", "date_signature"])
    ),
    date_effet: parseDate(
      findValue(keys, row, ["effet", "date_effet", "date effet"])
    ),
    fin_contrat: parseDate(
      findValue(keys, row, ["fin", "fin_contrat", "fin contrat"])
    ),
    compagnie: findValue(keys, row, ["compagnie", "company", "assureur"]),
    cotisation_mensuelle: parseNumber(
      findValue(keys, row, ["cotisation_mensuelle", "cotisation mensuelle"])
    ),
    cotisation_annuelle: parseNumber(
      findValue(keys, row, ["cotisation_annuelle", "cotisation annuelle"])
    ),
    commission_mensuelle: parseNumber(
      findValue(keys, row, ["commission_mensuelle", "commission mensuelle"])
    ),
    commission_annuelle: parseNumber(
      findValue(keys, row, ["commission_annuelle", "commission annuelle"])
    ),
    commission_premiere_annee: parseNumber(
      findValue(keys, row, [
        "commission_premiere_annee",
        "commission 1ère année",
        "commission première année",
      ])
    ),
    annee_recurrente: parseNumber(
      findValue(keys, row, ["annee_recurrente", "année récurrente"])
    ),
    annee_recu: parseNumber(findValue(keys, row, ["annee_recu", "année reçu"])),
    status: mapContractStatus(findValue(keys, row, ["statut", "status"])),
    statut_detail: findValue(keys, row, ["statut", "status"]),
    attribution: findValue(keys, row, ["attribution", "assigned"]),
    pays: findValue(keys, row, ["pays", "country"]),
    charge: findValue(keys, row, ["charge", "charges"]),
    depenses: parseNumber(
      findValue(keys, row, ["dépenses", "depenses", "expenses"])
    ),
  };
}

function findValue(keys, row, searchTerms) {
  for (const term of searchTerms) {
    const key = keys.find((k) => k.toLowerCase().includes(term.toLowerCase()));
    if (key && row[key]) {
      return String(row[key]).trim();
    }
  }
  return null;
}

function parseDate(dateStr) {
  if (!dateStr) return null;

  const date = new Date(dateStr);
  if (isNaN(date.getTime())) {
    const parts = dateStr.split(/[\/\-\.]/);
    if (parts.length === 3) {
      const day = parseInt(parts[0]);
      const month = parseInt(parts[1]) - 1;
      const year = parseInt(parts[2]);
      const parsedDate = new Date(year, month, day);
      return isNaN(parsedDate.getTime())
        ? null
        : parsedDate.toISOString().split("T")[0];
    }
    return null;
  }

  return date.toISOString().split("T")[0];
}

function parseNumber(numStr) {
  if (!numStr) return null;

  const cleaned = String(numStr)
    .replace(/[^\d,.-]/g, "")
    .replace(",", ".");
  const num = parseFloat(cleaned);
  return isNaN(num) ? null : num;
}

function mapStatus(status) {
  if (!status) return "nouveau";

  const statusLower = status.toLowerCase();
  if (statusLower.includes("nouveau")) return "nouveau";
  if (statusLower.includes("contacté")) return "contacté";
  if (statusLower.includes("qualifié")) return "qualifié";
  if (statusLower.includes("converti")) return "converti";
  if (statusLower.includes("perdu")) return "perdu";

  return "nouveau";
}

function mapContractStatus(status) {
  if (!status) return "brouillon";

  const statusLower = status.toLowerCase();
  if (statusLower.includes("actif")) return "actif";
  if (statusLower.includes("suspendu")) return "suspendu";
  if (statusLower.includes("résilié")) return "résilié";
  if (statusLower.includes("brouillon")) return "brouillon";

  return "brouillon";
}
export async function POST(request) {
  return handler(await request.json());
}