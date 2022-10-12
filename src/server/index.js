// DataTime scalar definition
const { GraphQLScalarType, Kind } = require("graphql");

const dateScalar = new GraphQLScalarType({
  name: "Date",
  description: "Date custom scalar type",
  serialize(value) {
    return value.getTime(); // Convert outgoing Date to integer for JSON
  },
  parseValue(value) {
    return new Date(value); // Convert incoming integer to Date
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.INT) {
      return new Date(parseInt(ast.value, 10)); // Convert hard-coded AST string to integer and then to Date
    }
    return null; // Invalid hard-coded value (not an integer)
  },
});

// firebird connection config
var Firebird = require("node-firebird");

var options = {};
options.host = "192.168.50.6";
options.port = 3050;
options.database = "C:/Sekafi3SQL/DATABASE.FDB";
options.user = "SYSDBA";
options.password = "masterkey";
options.lowercase_keys = false; // set to true to lowercase keys
options.role = null; // default
options.pageSize = 4096; // default when creating database

let results = [];

function convertToPlain(rtf) {
  rtf = rtf.replace(/\\par[d]?/g, "");
  return rtf.replace(/\{\*?\\[^{}]+}|[{}]|\\\n?[A-Za-z]+\n?(?:-?\d+)?[ ]?/g, "").trim();
}


function updateComments(fv, noU){
  return(
  `
    UPDATE EWIDENCJA_SPRZETU 
    SET KOMENTARZ = COALESCE(KOMENTARZ, '') || ' ${fv}' || ' PU' 
    WHERE NR_UNIKAT LIKE ${noU.map((e, _, arr) => (
      arr.indexOf(e) < arr.length - 1) 
      ? `'${e}' OR NR_UNIKAT LIKE ` 
      : `'${e}'`
    ).join('')}

  `
  )
}

function newText(uText, noU){
  return(
  `
    UPDATE EWIDENCJA_SPRZETU 
    SET KOMENTARZ = '${uText}'
    WHERE NR_UNIKAT LIKE '${noU}'

  `
  )
}

function newBoxNumber(uText, noU){
  return(
  `
    UPDATE EWIDENCJA_SPRZETU 
    SET TRESC_OSTRZEZENIA = '${uText}'
    WHERE NR_UNIKAT LIKE '${noU}'

  `
  )
}

function endingDate(noU){
  return(
  `
    UPDATE EWIDENCJA_SPRZETU 
    SET DATA_PRZEKAZANIA_DO_US = CURRENT_TIMESTAMP
    WHERE NR_UNIKAT LIKE '${noU}'

  `  )
}

function setRecycling(noU){
  return(
  `
  UPDATE EWIDENCJA_SPRZETU 
  SET JEST_DO_RECYKLINGU = 'T'
  WHERE NR_UNIKAT LIKE '${noU}'

  `  )
}


    



    



const testSql = `

SELECT
E.NR_UNIKAT,
E.KOMENTARZ
FROM EWIDENCJA_SPRZETU E 	
WHERE E.NR_UNIKAT LIKE 'AGR08256640'

`



const getCloseRegistersLists = `

SELECT
E.NAZWA,
E.NR_FABRYCZNY,
E.NR_UNIKAT,
E.DATA_FISK,
E.TRESC_OSTRZEZENIA,
RF.NIP,
RF.NAZWA_FIRMY,
RL.NAZWA_MIEJSCA AS "NAZAWA_LOKALU",
RL.ULICA ||' ' ||
RL.NR_DOMU || '/' || 
RL.NR_LOKALU || ' ' ||
RL.KOD_POCZTOWY || ' ' ||
RL.MIASTO AS "ADRES_LOKALU",
COALESCE(PO.NR_DOK,'--') AS NR_ODCZYTU,
COALESCE(E.DATA_PRZEKAZANIA_DO_US, '--') AS DATA_WYDANIA,
CAST(E.KOMENTARZ AS VARCHAR(32000)) AS NR_FAKTURY,
COALESCE(E.JEST_DO_RECYKLINGU, '--') AS "RECYKLING",
E.DATA_RECYKLINGU  AS "R_DAT",
ZP.DATA_WYKONANIA,
DA.AKCJA_ID

FROM ((((((EWIDENCJA_SPRZETU E 	
LEFT JOIN REJESTR_FIRM RF ON E.FIRMA_ID = RF.FIRMA_ID)
LEFT JOIN REJESTR_LOKALIZACJI RL ON E.MIEJSCE_ID = RL.MIEJSCE_ID)
LEFT JOIN DANE_AKCJI DA ON E.SPRZET_ID = DA.ID_OBCE)
LEFT JOIN PROTOKOLY_ODCZYTU_MF PO ON PO.SPRZET_ID = E.SPRZET_ID)
LEFT JOIN ZLECENIA_URZADZENIA ZU ON ZU.SPRZET_ID = E.SPRZET_ID)
LEFT JOIN ZLECENIA_POZYCJE ZP ON ZP.ZLECENIE_ID = ZU.ZLECENIE_ID)

WHERE INDEKS_TU = 'O'
AND PO.DATA_UTWORZ BETWEEN '2019-01-01' AND '2022-12-31'
ORDER BY DATA_WYKONANIA DESC;

`;

const getNewFiscalization = `

SELECT

E.NAZWA,
E.NR_FABRYCZNY,
E.NR_UNIKAT,
E.DATA_FISK,
RF.NIP,
RF.NAZWA_FIRMY,
RL.NAZWA_MIEJSCA,
RL.ULICA ||' ' ||
RL.NR_DOMU || '/' || 
RL.NR_LOKALU || ' ' ||
RL.KOD_POCZTOWY || ' ' ||
RL.MIASTO
AS "ADRES",
ZU.SERWISANT_NAZWA AS WYKONAL_FISKALIZACJE,
ZP.POZYCJA_NAZWA AS USLUGA_WYKONANA,


CAST(E.OPIS AS VARCHAR(1256)) AS OPIS,
CAST(E.KOMENTARZ AS VARCHAR(1256)) AS KOMENTARZ,

ZP.DATA_WYKONANIA


FROM (((((EWIDENCJA_SPRZETU E 	
LEFT JOIN REJESTR_FIRM RF ON E.FIRMA_ID = RF.FIRMA_ID)
LEFT JOIN REJESTR_LOKALIZACJI RL ON E.MIEJSCE_ID = RL.MIEJSCE_ID)
LEFT JOIN DANE_AKCJI DA ON E.SPRZET_ID = DA.ID_OBCE)
LEFT JOIN ZLECENIA_URZADZENIA ZU ON ZU.SPRZET_ID = E.SPRZET_ID)
LEFT JOIN ZLECENIA_POZYCJE ZP ON ZP.ZLECENIE_ID = ZU.ZLECENIE_ID)

WHERE (E.DATA_FISK BETWEEN '2019-01-01' AND '2022-12-31')
AND (INDEKS_TU = 'F') 

ORDER BY DATA_FISK DESC;

`;

const getFullData = `

SELECT
E.FIRMA_ID,
E.NAZWA,
E.NR_FABRYCZNY,
E.NR_UNIKAT,
E.DATA_FISK,
RF.NIP,
RF.NAZWA_FIRMY,
RL.NAZWA_MIEJSCA,
RL.ULICA ||' ' || RL.NR_DOMU || '/' || RL.NR_LOKALU || ' ' || RL.MIASTO || ' ' || RL.KOD_POCZTOWY AS ADDRESS,
RL.MIASTO,
DF.NAZWA_AKCJI,
DA.DATA_NAST,
TL.NUMER_CYFRY,
AML.ADRES,
COALESCE(T.NUMER_CYFRY, '--') AS TEL_KLIENT,
COALESCE(TL.NUMER_CYFRY, '--') AS TEL_LOKAL,

CAST(E.KOMENTARZ AS VARCHAR(32000)) AS KOMENTARZ,
NT.NAVIGO_SZ_Y,
NT.NAVIGO_DL_X

FROM (((((((((EWIDENCJA_SPRZETU E 	
LEFT JOIN REJESTR_FIRM RF ON E.FIRMA_ID = RF.FIRMA_ID)
LEFT JOIN REJESTR_LOKALIZACJI RL ON E.MIEJSCE_ID = RL.MIEJSCE_ID)
LEFT JOIN DANE_AKCJI DA ON E.SPRZET_ID = DA.ID_OBCE)
LEFT JOIN DEFINICJE_AKCJI DF ON DA.DEFINICJA_ID = DF.AKCJA_ID)
LEFT JOIN TELEFONY T ON T.POLE_ID = E.FIRMA_ID)
LEFT JOIN TELEFONY TL ON TL.POLE_ID = RL.MIEJSCE_ID)
LEFT JOIN ADRESY_EMAIL AM ON AM.POLE_ID = RF.FIRMA_ID)
LEFT JOIN ADRESY_EMAIL AML ON AML.POLE_ID = RL.MIEJSCE_ID)
left JOIN NEWTABLE NT ON NT.MIEJSCE_ID = RL.MIEJSCE_ID)

WHERE (DATA_NAST BETWEEN '2021-05-01' AND '2024-01-20')
AND DF.CZY_AKTYWNA = 'T' 
ORDER BY DA.DATA_NAST, RL.NAZWA_MIEJSCA;

`;

const getFinishedJobs = `

SELECT
E.FIRMA_ID,
E.NAZWA,
E.NR_FABRYCZNY,
E.NR_UNIKAT,
E.DATA_FISK,
RF.NIP,
RF.NAZWA_FIRMY,
RL.NAZWA_MIEJSCA,
RL.ULICA ||' ' ||
RL.NR_DOMU || '/' || 
RL.NR_LOKALU || ' ' ||
RL.KOD_POCZTOWY || ' ' ||
RL.MIASTO
AS "ADRES",
ZU.SERWISANT_NAZWA AS WYKONAL_PRZEGLAD,
ZP.POZYCJA_NAZWA AS USLUGA_WYKONANA,
ZP.DATA_WYKONANIA,
CAST(E.KOMENTARZ AS VARCHAR(32000)) AS KOMENTARZ

FROM (((((((EWIDENCJA_SPRZETU E 	
LEFT JOIN REJESTR_FIRM RF ON E.FIRMA_ID = RF.FIRMA_ID)
LEFT JOIN REJESTR_LOKALIZACJI RL ON E.MIEJSCE_ID = RL.MIEJSCE_ID)
LEFT JOIN DANE_AKCJI DA ON E.SPRZET_ID = DA.ID_OBCE)
LEFT JOIN TELEFONY T ON T.POLE_ID = E.FIRMA_ID)
LEFT JOIN TELEFONY TL ON TL.POLE_ID = RL.MIEJSCE_ID)
LEFT JOIN ZLECENIA_URZADZENIA ZU ON ZU.SPRZET_ID = E.SPRZET_ID)
LEFT JOIN ZLECENIA_POZYCJE ZP ON ZP.ZLECENIE_ID = ZU.ZLECENIE_ID)

WHERE (ZP.DATA_WYKONANIA BETWEEN '2021-05-01' AND '2022-12-31')
AND INDEKS_TU = 'P'
ORDER BY DATA_WYKONANIA DESC

`;


function getData(sql) {
  return new Promise(function (resolve, reject) {
    Firebird.attach(options, (err, db) => {
      if (err) reject(err);

      db.query(sql, (err, result) => {
        if (err) reject(err);

        db.detach();
        return resolve(result);
      });
    });
  });
}

const { ApolloServer, gql } = require("apollo-server");

// The GraphQL schema
const typeDefs = gql`
  scalar Date

  type Query {
    "A simple type for getting started!"
    registers: [Register]
    finishedJobs: [FinishedJob]
    newFiscalizations: [NewFiscalization]
    closeRegistersLists: [CloseRegistersList]
    testSql: [TestSql]
  }

     

  type Mutation {
    editComments(fv: String, noU: [String]): TestSql 
    updateText(uText: String, noU: String): TestSql
    updateTextBox(uText: String, noU: String): TestSql
    setEndingDate(noU: String): TestSql
    setRecyclingPlan(noU: String): TestSql
  }

    

  type TestSql {
    KOMENTARZ: String
    NR_UNIKAT: String
    
  }



  

  type EditComments {
    KOMENTARZ: String
    NR_UNIKAT: String
  }

  type CloseRegistersList {
    NAZWA: String
    NR_FABRYCZNY: String
    NR_UNIKAT: String
    DATA_FISK: Date
    NIP: String
    NAZWA_FIRMY: String
    NAZAWA_LOKALU: String
    ADRES_LOKALU: String
    NR_ODCZYTU: String
    DATA_WYDANIA: Date
    NR_FAKTURY: String
    RECYKLING: String
    R_DAT: Date
    DATA_WYKONANIA: Date
    TRESC_OSTRZEZENIA: String
    AKCJA_ID: String
  }

  type Register {
    FIRMA_ID: Int
    NAZWA: String
    NR_FABRYCZNY: String
    NR_UNIKAT: String
    DATA_FISK: Date
    NIP: String
    NAZWA_FIRMY: String
    NAZWA_MIEJSCA: String
    ADDRESS: String
    ADRES: String
    MIASTO: String
    NAZWA_AKCJI: String
    DATA_NAST: Date
    NUMER_CYFRY: String
    KOMENTARZ: String
    NAVIGO_SZ_Y: Float
    NAVIGO_DL_X: Float
    TEL_KLIENT: String
    TEL_LOKAL: String

  }

  type FinishedJob {
    FIRMA_ID: Int
    NAZWA: String
    NR_FABRYCZNY: String
    NR_UNIKAT: String
    DATA_FISK: Date
    NIP: String
    NAZWA_FIRMY: String
    NAZWA_MIEJSCA: String
    ADRES: String
    WYKONAL_PRZEGLAD: String
    USLUGA_WYKONANA: String
    DATA_WYKONANIA: Date
    KOMENTARZ: String
  }

  type NewFiscalization {
    
    NAZWA: String
    NR_FABRYCZNY: String
    NR_UNIKAT: String
    NIP: String
    NAZWA_FIRMY: String
    NAZWA_MIEJSCA: String
    ADRES: String
    WYKONAL_FISKALIZACJE: String
    USLUGA_WYKONANA: String
    DATA_WYKONANIA: Date
    KOMENTARZ: String
    OPIS: String
   
  }
`;

// A map of functions which return data for the schema.
const resolvers = {
  Query: {
    registers: async () => await getData(getFullData),
    finishedJobs: async () => await getData(getFinishedJobs),
    newFiscalizations: async () => await getData(getNewFiscalization),
    closeRegistersLists: async () => await getData(getCloseRegistersLists),
    testSql: async () => await getData(testSql)
  },

  Mutation: {
    editComments: async (_, {fv, noU} ) => await getData(updateComments(fv, noU)),
    updateText: async(_, {uText, noU} ) => await getData(newText(uText, noU)),
    updateTextBox: async(_, {uText, noU} ) => await getData(newBoxNumber(uText, noU)),
    setEndingDate: async(_, {noU} ) => await getData(endingDate(noU)),
    setRecyclingPlan: async(_, {noU} ) => await getData(setRecycling(noU))
    

    
    
  }
};

const server = new ApolloServer({
  fetchOptions: {
    mode: 'no-cors',
  },
  typeDefs,
  resolvers,
  Firebird,
});




server.listen().then(({url}) => {
  console.log(`đźš€ Server ready at ${url}`);
  
});



