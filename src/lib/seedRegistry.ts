import { ShippingLine, Vessel, Port, CustomsOffice, RegistryService } from "./registryService";

export const seedRegistryDatabase = async () => {
  const lines: ShippingLine[] = [
    {
      id: "MSC",
      name: "Mediterranean Shipping Company (MSC)",
      countryOfOrigin: "Switzerland",
      foundedYear: 1970,
      website: "msc.com",
      description: "MSC is a privately owned global organization operating a network of over 600 offices in 155 countries. It is currently the world's largest container shipping line.",
      globalRank: 1,
      fleetSize: 730,
      teuCapacity: 4800000
    },
    {
      id: "MAERSK",
      name: "A.P. Møller – Mærsk",
      countryOfOrigin: "Denmark",
      foundedYear: 1904,
      website: "maersk.com",
      description: "Maersk is an integrated logistics company, and prior to 2022, was the largest container shipping line and vessel operator in the world.",
      globalRank: 2,
      fleetSize: 686,
      teuCapacity: 4100000
    },
    {
      id: "CMACGM",
      name: "CMA CGM",
      countryOfOrigin: "France",
      foundedYear: 1978,
      website: "cma-cgm.com",
      description: "CMA CGM S.A. is a French container transportation and shipping company. It is a leading worldwide shipping group, using 200 shipping routes between 420 ports.",
      globalRank: 3,
      fleetSize: 593,
      teuCapacity: 3400000
    },
    {
      id: "HAPAGLLOYD",
      name: "Hapag-Lloyd",
      countryOfOrigin: "Germany",
      foundedYear: 1970,
      website: "hapag-lloyd.com",
      description: "Hapag-Lloyd is a German multinational shipping company. It was formed by a merger of Hamburg-American Line and North German Lloyd.",
      globalRank: 5,
      fleetSize: 250,
      teuCapacity: 1800000
    },
    {
      id: "EVERGREEN",
      name: "Evergreen Marine Corporation",
      countryOfOrigin: "Taiwan",
      foundedYear: 1968,
      website: "evergreen-marine.com",
      description: "Evergreen Marine is a Taiwanese container transportation and shipping company. Its principal trading routes are between the Far East area and North America, Central America and the Caribbean.",
      globalRank: 7,
      fleetSize: 211,
      teuCapacity: 1600000
    }
  ];

  const vessels: Vessel[] = [
    {
      id: "9619476",
      imo: "9619476",
      name: "MSC ADELAIDE",
      vesselType: "Container Ship",
      flag: "Panama",
      builtYear: 2013,
      grossTonnage: 104028,
      deadweight: 120560,
      length: 299,
      beam: 48,
      teuCapacity: 8800,
      operatorId: "MSC",
      status: "Active"
    },
    {
      id: "9526954",
      imo: "9526954",
      name: "MAERSK LIMA",
      vesselType: "Container Ship",
      flag: "Hong Kong",
      builtYear: 2011,
      grossTonnage: 88272,
      deadweight: 105800,
      length: 299,
      beam: 45,
      teuCapacity: 7450,
      operatorId: "MAERSK",
      status: "Active"
    },
    {
      id: "9722687",
      imo: "9722687",
      name: "CMA CGM COLUMBIA",
      vesselType: "Container Ship",
      flag: "Malta",
      builtYear: 2015,
      grossTonnage: 95256,
      deadweight: 114000,
      length: 299,
      beam: 48,
      teuCapacity: 9200,
      operatorId: "CMACGM",
      status: "Active"
    },
    {
      id: "9811000",
      imo: "9811000",
      name: "EVER GIVEN",
      vesselType: "Container Ship",
      flag: "Panama",
      builtYear: 2018,
      grossTonnage: 219079,
      deadweight: 199692,
      length: 399,
      beam: 58,
      teuCapacity: 20124,
      operatorId: "EVERGREEN",
      status: "Active"
    },
    {
      id: "9469558",
      imo: "9469558",
      name: "MSC KATRINA",
      vesselType: "Container Ship",
      flag: "Panama",
      builtYear: 2012,
      grossTonnage: 143521,
      deadweight: 153000,
      length: 366,
      beam: 48,
      teuCapacity: 12400,
      operatorId: "MSC",
      status: "Active"
    }
  ];

  const ports: Port[] = [
    {
      id: "VE PBL",
      name: "Puerto Cabello",
      locode: "VE PBL",
      country: "Venezuela",
      city: "Puerto Cabello",
      coordinates: "10.485, -68.016",
      terminalsCount: 5,
      description: "Puerto Cabello es el principal complejo portuario de Venezuela, manejando la mayor parte de las importaciones y exportaciones del país con conexiones globales clave.",
      isCustomsEnabled: true
    },
    {
      id: "VE LGU",
      name: "La Guaira",
      locode: "VE LGU",
      country: "Venezuela",
      city: "La Guaira",
      coordinates: "10.603, -66.938",
      terminalsCount: 3,
      description: "El Puerto de La Guaira es el segundo puerto marítimo más importante de Venezuela en términos de volumen de carga, ubicado cerca de la capital, Caracas.",
      isCustomsEnabled: true
    },
    {
      id: "VE GUA",
      name: "Guanta",
      locode: "VE GUA",
      country: "Venezuela",
      city: "Guanta",
      coordinates: "10.233, -64.583",
      terminalsCount: 2,
      description: "El Puerto de Guanta es fundamental en el oriente venezolano, principalmente para carga general, suelta y repuestos para la industria petrolera local.",
      isCustomsEnabled: true
    },
    {
      id: "VE MAR",
      name: "Maracaibo",
      locode: "VE MAR",
      country: "Venezuela",
      city: "Maracaibo",
      coordinates: "10.612, -71.603",
      terminalsCount: 3,
      description: "Ubicado en el Lago de Maracaibo, este puerto apoya fuertemente a la zona occidental del país y ha sido vital para la industria zuliana.",
      isCustomsEnabled: true
    }
  ];

  const customs: CustomsOffice[] = [
    {
      id: "ADU-2001",
      name: "Aduana Principal Marítima de Puerto Cabello",
      code: "2001",
      jurisdiction: "Estado Carabobo, Yaracuy (parte)",
      locationId: "VE PBL",
      description: "Autoridad aduanera primaria y tribunal de apelación inicial para todos los trámites de importación y exportación gestionados en Puerto Cabello.",
      established: "1994 (Reforma SENIAT)"
    },
    {
      id: "ADU-2002",
      name: "Aduana Principal Marítima de La Guaira",
      code: "2002",
      jurisdiction: "Estado La Guaira, Región Capital",
      locationId: "VE LGU",
      description: "Custodia el ingreso de bienes hacia el área metropolitana de Caracas y maneja un volumen sustancial del comercio general de la nación.",
      established: "1994 (Reforma SENIAT)"
    }
  ];

  try {
    await RegistryService.seedInitialEntities(lines, vessels, ports, customs);
    console.log("Registry seeded successfully with real verified information");
  } catch (error) {
    console.error("Error seeding registry", error);
  }
};
