'use client';

export default function TransactionSkeleton() {
  return (
    <div className="animate-pulse">
      {/* Cabeçalho */}
      <div className="grid grid-cols-3 md:grid-cols-5 gap-2 md:gap-4">
        <div className="h-6 bg-gray-200 rounded"></div>
        <div className="h-6 bg-gray-200 rounded"></div>
        <div className="h-6 bg-gray-200 rounded"></div>
        <div className="h-6 bg-gray-200 rounded"></div>
        <div className="h-6 bg-gray-200 rounded"></div>
      </div>

      {/* Linhas (5 itens) */}
      {[...Array(5)].map((_, i) => (
        <div key={i} className="grid grid-cols-5 gap-4 py-3 border-b">
          {/* Data */}
          <div>
            <div className="h-5 bg-gray-100 rounded w-3/4"></div>
          </div>
          
          {/* Título */}
          <div>
            <div className="h-5 bg-gray-100 rounded-full w-full"></div>
          </div>
          
          {/* Categoria */}
          <div>
            <div className="h-5 bg-gray-100 rounded-full w-2/3"></div>
          </div>
          
          {/* Tipo */}
          <div>
            <div className="h-5 bg-gray-100 rounded-full w-1/2"></div>
          </div>
          
          {/* Valor */}
          <div className="text-right">
            <div className="h-5 bg-gray-100 rounded-full w-16 ml-auto"></div>
          </div>
        </div>
      ))}
    </div>
  );
}