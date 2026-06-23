import React, { useState } from 'react';

export function NavieraPerfilOperativo() {
  const [activeTab, setActiveTab] = useState('kyc');
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 tracking-tight">KYC y Configuración B2B</h1>
      <div className="flex gap-4 border-b mb-6 border-gray-200 dark:border-gray-800">
        <button onClick={() => setActiveTab('kyc')} className={`pb-2 ${activeTab === 'kyc' ? 'border-b-2 border-primary font-medium text-primary' : 'text-muted-foreground'}`}>Autoridades</button>
        <button onClick={() => setActiveTab('freetime')} className={`pb-2 ${activeTab === 'freetime' ? 'border-b-2 border-primary font-medium text-primary' : 'text-muted-foreground'}`}>Matriz de Free Time</button>
        <button onClick={() => setActiveTab('bancos')} className={`pb-2 ${activeTab === 'bancos' ? 'border-b-2 border-primary font-medium text-primary' : 'text-muted-foreground'}`}>Cuentas Bancarias</button>
      </div>

      {activeTab === 'kyc' && (
        <div className="space-y-4 max-w-md animate-in fade-in duration-300">
          <div className="space-y-2">
             <label className="text-sm font-medium">Código SROP (Bolipuertos)</label>
             <input className="w-full border p-2 rounded text-sm" defaultValue="SROP-99120" />
          </div>
          <div className="space-y-2">
             <label className="text-sm font-medium">Código SIDUNEA (SENIAT)</label>
             <input className="w-full border p-2 rounded text-sm" defaultValue="SID-VNZ-1002" />
          </div>
          <button className="bg-primary text-white font-medium px-4 py-2 rounded text-sm">Guardar Configuraciones</button>
        </div>
      )}

      {activeTab === 'freetime' && (
        <div className="space-y-4 max-w-xl animate-in fade-in duration-300">
          <p className="text-sm text-muted-foreground">Configura cuántos días libres otorgas a los importadores antes de generar cobro de demurrage.</p>
          <div className="grid grid-cols-3 gap-4 font-medium mb-2 border-b pb-2 text-sm text-muted-foreground">
            <div>Tipo de Equipo</div>
            <div>Días Libres Importación</div>
            <div>Días Libres Exportación</div>
          </div>
          <div className="grid grid-cols-3 gap-4 items-center">
             <div className="text-sm font-medium">Seco 20'/40'</div>
             <input className="w-full border p-2 rounded text-sm" type="number" defaultValue="7" />
             <input className="w-full border p-2 rounded text-sm" type="number" defaultValue="14" />
          </div>
          <div className="grid grid-cols-3 gap-4 items-center">
             <div className="text-sm font-medium">Reefer (Refrigerado)</div>
             <input className="w-full border p-2 rounded text-sm" type="number" defaultValue="3" />
             <input className="w-full border p-2 rounded text-sm" type="number" defaultValue="5" />
          </div>
          <button className="mt-4 bg-primary text-white font-medium px-4 py-2 rounded text-sm">Actualizar Matriz</button>
        </div>
      )}

      {activeTab === 'bancos' && (
        <div className="space-y-4 max-w-md animate-in fade-in duration-300">
           <div className="space-y-2">
              <label className="text-sm font-medium">Cuenta Custodia (USD) - Wire Transfer</label>
              <input className="w-full border p-2 rounded text-sm" defaultValue="001-2394-0012-392" />
           </div>
           <div className="space-y-2">
              <label className="text-sm font-medium">Cuenta Corriente (VES) - BCV</label>
              <input className="w-full border p-2 rounded text-sm" defaultValue="0102-0348-11-0001234567" />
           </div>
           <button className="bg-primary text-white font-medium px-4 py-2 rounded text-sm">Actualizar Cuentas</button>
        </div>
      )}
    </div>
  );
}
