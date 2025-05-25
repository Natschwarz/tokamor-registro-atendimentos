import React from 'react';
import { Users, UserPlus, ClipboardList, BarChart3 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
interface DashboardProps {
  onNavigate: (section: string) => void;
  stats: {
    totalPersons: number;
    totalVisits: number;
    thisMonth: number;
  };
}
const Dashboard = ({
  onNavigate,
  stats
}: DashboardProps) => {
  return <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Tok de Amor ❤️</h1>
        <p className="text-xl text-gray-600">
          Sistema de Registro de Atendimentos
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-blue-700 flex items-center gap-2">
              <Users className="w-6 h-6" />
              Pessoas Cadastradas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-800">
              {stats.totalPersons}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-green-50 border-green-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-green-700 flex items-center gap-2">
              <ClipboardList className="w-6 h-6" />
              Total de Visitas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-800">
              {stats.totalVisits}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-purple-50 border-purple-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-purple-700 flex items-center gap-2">
              <BarChart3 className="w-6 h-6" />
              Este Mês
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-800">
              {stats.thisMonth}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <button onClick={() => onNavigate('register')} className="bg-blue-500 hover:bg-blue-600 text-white p-8 rounded-lg shadow-lg transition-colors text-left group">
          <div className="flex items-center gap-4 mb-4">
            <UserPlus className="w-12 h-12 group-hover:scale-110 transition-transform" />
            <div>
              <h3 className="text-2xl font-bold">Cadastrar Pessoa</h3>
              <p className="text-blue-100 text-lg">
                Adicionar nova pessoa ao sistema
              </p>
            </div>
          </div>
        </button>

        <button onClick={() => onNavigate('visit')} className="bg-green-500 hover:bg-green-600 text-white p-8 rounded-lg shadow-lg transition-colors text-left group">
          <div className="flex items-center gap-4 mb-4">
            <ClipboardList className="w-12 h-12 group-hover:scale-110 transition-transform" />
            <div>
              <h3 className="text-2xl font-bold">Registrar Visita</h3>
              <p className="text-green-100 text-lg">
                Registrar atendimento realizado
              </p>
            </div>
          </div>
        </button>

        <button onClick={() => onNavigate('people')} className="bg-purple-500 hover:bg-purple-600 text-white p-8 rounded-lg shadow-lg transition-colors text-left group">
          <div className="flex items-center gap-4 mb-4">
            <Users className="w-12 h-12 group-hover:scale-110 transition-transform" />
            <div>
              <h3 className="text-2xl font-bold">Ver Pessoas</h3>
              <p className="text-purple-100 text-lg">
                Lista de pessoas cadastradas
              </p>
            </div>
          </div>
        </button>

        <button onClick={() => onNavigate('reports')} className="bg-orange-500 hover:bg-orange-600 text-white p-8 rounded-lg shadow-lg transition-colors text-left group">
          <div className="flex items-center gap-4 mb-4">
            <BarChart3 className="w-12 h-12 group-hover:scale-110 transition-transform" />
            <div>
              <h3 className="text-2xl font-bold">Relatórios</h3>
              <p className="text-orange-100 text-lg">
                Estatísticas e gráficos
              </p>
            </div>
          </div>
        </button>
      </div>
    </div>;
};
export default Dashboard;