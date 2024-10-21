import DebugLog from '../DebugLog.js';
import DebugTable from '../DebugTable.js';
import LoCharges from '../LoCharges.js';
import LoCustomers from '../LoCustomers.js';
import LoDepartureOrders from '../LoDepartureOrders.js';
import LoLockers from '../LoLockers.js';
import LoTransitPackages from '../LoTransitPackages.js';
import PaAddress from '../PaAddress.js';
import PaCities from '../PaCities.js';
import PaContries from '../PaContries.js';
import PaEmails from '../PaEmails.js';
import PaPeople from '../PaPeople.js';
import PaPhones from '../PaPhones.js';
import PaStates from '../PaStates.js';
import RelClientesLockers from '../RelClientesLockers.js';
import RelPeopleAddresses from '../RelPeopleAddresses.js';
import SeObjetos from '../SeObjetos.js';
import SePermisos from '../SePermisos.js';
import SeRoles from '../SeRoles.js';
import SeUsers from '../SeUsers.js';
import PayInvoices from '../PayInvoices.js';

function setupAssociations() {
  // Relaciones de usuarios y roles
  SeUsers.belongsTo(SeRoles, { foreignKey: 'COD_ROL' });
  SeRoles.hasMany(SeUsers, { foreignKey: 'COD_ROL' });

  // Relaciones de personas
  SeUsers.belongsTo(PaPeople, { foreignKey: 'COD_PEOPLE' });
  PaPeople.hasMany(SeUsers, { foreignKey: 'COD_PEOPLE' });
  
  // Relación de personas con correos, teléfonos y direcciones
  PaEmails.belongsTo(PaPeople, { foreignKey: 'COD_PEOPLE' });
  PaPeople.hasMany(PaEmails, { foreignKey: 'COD_PEOPLE' });  
  
  PaPhones.belongsTo(PaPeople, { foreignKey: 'COD_PEOPLE' });
  PaPeople.hasMany(PaPhones, { foreignKey: 'COD_PEOPLE' });

  RelPeopleAddresses.belongsTo(PaPeople, { foreignKey: 'COD_PEOPLE' });
  PaPeople.hasMany(RelPeopleAddresses, { foreignKey: 'COD_PEOPLE' });

  RelPeopleAddresses.belongsTo(PaAddress, { foreignKey: 'COD_ADDRESS' });
  PaAddress.hasMany(RelPeopleAddresses, { foreignKey: 'COD_ADDRESS' });

  PaAddress.belongsTo(PaCities, { foreignKey: 'COD_CITY' });
  PaCities.hasMany(PaAddress, { foreignKey: 'COD_CITY' });

  PaAddress.belongsTo(PaStates, { foreignKey: 'COD_STATE' });
  PaStates.hasMany(PaAddress, { foreignKey: 'COD_STATE' });

  PaAddress.belongsTo(PaContries, { foreignKey: 'COD_COUNTRY' });
  PaContries.hasMany(PaAddress, { foreignKey: 'COD_COUNTRY' });

  // Relaciones de clientes y lockers
  RelClientesLockers.belongsTo(LoCustomers, { foreignKey: 'COD_CUSTOMER' });
  LoCustomers.hasMany(RelClientesLockers, { foreignKey: 'COD_CUSTOMER' });

  RelClientesLockers.belongsTo(LoLockers, { foreignKey: 'COD_LOCKER' });
  LoLockers.hasMany(RelClientesLockers, { foreignKey: 'COD_LOCKER' });

  // Paquetes en tránsito
  LoTransitPackages.belongsTo(LoCustomers, { foreignKey: 'COD_CUSTOMER' });
  LoCustomers.hasMany(LoTransitPackages, { foreignKey: 'COD_CUSTOMER' });

  LoTransitPackages.belongsTo(LoDepartureOrders, { foreignKey: 'COD_ORDEN' });
  LoDepartureOrders.hasMany(LoTransitPackages, { foreignKey: 'COD_ORDEN' });

  LoTransitPackages.belongsTo(LoLockers, { foreignKey: 'COD_LOCKER' });
  LoLockers.hasMany(LoTransitPackages, { foreignKey: 'COD_LOCKER' });

  // Cargos
  LoCharges.belongsTo(LoTransitPackages, { foreignKey: 'COD_PAQUETETRANSITO' });
  LoTransitPackages.hasMany(LoCharges, { foreignKey: 'COD_PAQUETETRANSITO' });

  // Facturas
  LoCharges.belongsTo(PayInvoices, { foreignKey: 'COD_INVOICE' });
  PayInvoices.hasMany(LoCharges, { foreignKey: 'COD_INVOICE' });

  // Relaciones de permisos
  SePermisos.belongsTo(SeRoles, { foreignKey: 'COD_ROL' });
  SeRoles.hasMany(SePermisos, { foreignKey: 'COD_ROL' });

  SePermisos.belongsTo(SeObjetos, { foreignKey: 'COD_OBJETO' });
  SeObjetos.hasMany(SePermisos, { foreignKey: 'COD_OBJETO' });

  // Debug logs y errores
  DebugLog.belongsTo(SeUsers, { foreignKey: 'COD_USER' });
  DebugTable.belongsTo(SeUsers, { foreignKey: 'COD_USER' });
}

export default setupAssociations;
