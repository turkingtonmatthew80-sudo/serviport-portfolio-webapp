import React, { useState } from 'react';
import { UploadCloud, CheckCircle2, FileJson, Loader2 } from 'lucide-react';

export function NavieraManifiestos() {
  const [isUploading, setIsUploading] = useState(false);
  const [isDone, setIsDone] = useState(false);

  const simulateUpload = () => {
    setIsUploading(true);
    setTimeout(() => {
      setIsUploading(false);
      setIsDone(true);
    }, 2000);
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Manifiestos de Carga</h1>
          <p className="text-muted-foreground text-sm mt-1">Importación masiva y gestión de manifiestos estructurados.</p>
        </div>
      </div>

      {!isDone ? (
        <div className="border-2 border-dashed border-gray-300 dark:border-gray-800 rounded-xl p-12 flex flex-col items-center justify-center bg-gray-50/50 dark:bg-gray-900/50 transition-colors hover:bg-gray-50 dark:hover:bg-gray-900">
          <div className="p-4 bg-primary/10 rounded-full mb-4">
            <UploadCloud className="w-8 h-8 text-primary" />
          </div>
          <h3 className="text-lg font-medium mb-1">Cargar Archivo de Manifiesto</h3>
          <p className="text-sm text-muted-foreground mb-6 text-center max-w-sm">
            Arrastra y suelta tu archivo JSON o Excel aquí, o haz clic para seleccionar. Aceptamos archivos hasta 100MB listos para el backend.
          </p>
          <button className="bg-primary text-white font-medium px-4 py-2 rounded text-sm disabled:opacity-50 flex items-center justify-center" onClick={simulateUpload} disabled={isUploading}>
            {isUploading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Procesando Lote...
              </>
            ) : (
              "Seleccionar Archivo"
            )}
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="p-4 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-900/30 rounded-lg flex items-center gap-3 animate-in fade-in slide-in-from-top-4">
            <CheckCircle2 className="w-5 h-5" />
            <div>
              <p className="font-medium text-sm">Manifiesto Procesado Exitosamente a través de Transaction SQL</p>
              <p className="text-xs opacity-90 mt-0.5">5,000 contenedores insertados en 142ms.</p>
            </div>
            <button className="ml-auto bg-transparent border border-green-300 text-green-700 hover:bg-green-100 dark:hover:bg-green-900/40 px-3 py-1.5 rounded text-xs font-medium" onClick={() => setIsDone(false)}>Cargar Nuevo</button>
          </div>

          <div className="border rounded-lg overflow-hidden">
             <div className="bg-muted px-4 py-3 border-b border-border flex items-center justify-between">
                <span className="font-medium text-sm flex items-center gap-2"><FileJson className="w-4 h-4 text-muted-foreground"/> Lote: PC-HOR-169854</span>
                <span className="text-xs px-2 py-1 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded-full font-medium">Oficializado</span>
             </div>
             <table className="w-full text-sm text-left">
               <thead className="bg-muted/50 text-muted-foreground">
                 <tr>
                   <th className="px-4 py-3 font-medium">Contenedor (BIC)</th>
                   <th className="px-4 py-3 font-medium">Tipo ISO</th>
                   <th className="px-4 py-3 font-medium">Consignatario</th>
                   <th className="px-4 py-3 font-medium">Estado</th>
                   <th className="px-4 py-3 font-medium">Posición Estiba</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-border">
                 <tr className="hover:bg-muted/30">
                   <td className="px-4 py-3 font-mono font-medium">MSKU9081232</td>
                   <td className="px-4 py-3">40R1</td>
                   <td className="px-4 py-3">Alimentos Polar C.A.</td>
                   <td className="px-4 py-3"><span className="px-2 py-1 rounded-md bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 text-xs">EN_BUQUE</span></td>
                   <td className="px-4 py-3 font-mono text-xs">02-04-06</td>
                 </tr>
                 <tr className="hover:bg-muted/30">
                   <td className="px-4 py-3 font-mono font-medium">HLBU8190013</td>
                   <td className="px-4 py-3">20G1</td>
                   <td className="px-4 py-3">Distribuidora Sur</td>
                   <td className="px-4 py-3"><span className="px-2 py-1 rounded-md bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 text-xs">EN_BUQUE</span></td>
                   <td className="px-4 py-3 font-mono text-xs">08-01-02</td>
                 </tr>
                 <tr className="hover:bg-muted/30">
                   <td className="px-4 py-3 font-mono font-medium">MRSU1294819</td>
                   <td className="px-4 py-3">40HC</td>
                   <td className="px-4 py-3">Tecno Import C.A.</td>
                   <td className="px-4 py-3"><span className="px-2 py-1 rounded-md bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 text-xs">EN_BUQUE</span></td>
                   <td className="px-4 py-3 font-mono text-xs">10-00-82</td>
                 </tr>
                 <tr className="hover:bg-muted/30">
                   <td className="px-4 py-3 font-mono font-medium">ZIMU8391032</td>
                   <td className="px-4 py-3">20G1</td>
                   <td className="px-4 py-3">Ferretería EPA</td>
                   <td className="px-4 py-3"><span className="px-2 py-1 rounded-md bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 text-xs">EN_BUQUE</span></td>
                   <td className="px-4 py-3 font-mono text-xs">14-05-06</td>
                 </tr>
               </tbody>
             </table>
             <div className="px-4 py-2 border-t text-xs text-muted-foreground text-center bg-muted/20">
               Mostrando 4 de 5,000 registros (Paginación SQL OFFSET/LIMIT en Backend)
             </div>
          </div>
        </div>
      )}
    </div>
  );
}
