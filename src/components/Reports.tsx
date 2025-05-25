
import React from 'react';
import { ArrowLeft, Users, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { getDisplayAge } from '@/utils/ageCalculator';

interface Visit {
  id: number;
  personName: string;
  personCity: string;
  personGender: string;
  personAge: string;
  serviceType: string;
  date: string;
}

interface ReportsProps {
  onBack: () => void;
  visits: Visit[];
  people: any[];
}

const Reports = ({ onBack, visits, people }: ReportsProps) => {
  // Gender distribution
  const genderData = people.reduce((acc, person) => {
    const gender = person.gender === 'masculino' ? 'Masculino' : 'Feminino';
    acc[gender] = (acc[gender] || 0) + 1;
    return acc;
  }, {});

  const genderChartData = Object.entries(genderData).map(([gender, count]) => ({
    name: gender,
    value: count
  }));

  // Age groups - using current calculated age
  const ageGroups = people.reduce((acc, person) => {
    const age = parseInt(getDisplayAge(person));
    let group;
    if (age < 18) group = '0-17';
    else if (age < 30) group = '18-29';
    else if (age < 50) group = '30-49';
    else if (age < 65) group = '50-64';
    else group = '65+';
    
    acc[group] = (acc[group] || 0) + 1;
    return acc;
  }, {});

  const ageChartData = Object.entries(ageGroups).map(([group, count]) => ({
    age: group,
    pessoas: count
  }));

  // Cities distribution
  const cityData = people.reduce((acc, person) => {
    acc[person.city] = (acc[person.city] || 0) + 1;
    return acc;
  }, {});

  const cityChartData = Object.entries(cityData).map(([city, count]) => ({
    cidade: city,
    pessoas: count
  })).slice(0, 10); // Top 10 cities

  // Monthly visits for this year
  const currentYear = new Date().getFullYear();
  const monthlyVisits = visits
    .filter(visit => new Date(visit.date).getFullYear() === currentYear)
    .reduce((acc, visit) => {
      const month = new Date(visit.date).getMonth();
      const monthName = new Date(currentYear, month).toLocaleDateString('pt-BR', { month: 'short' });
      acc[monthName] = (acc[monthName] || 0) + 1;
      return acc;
    }, {});

  const monthlyChartData = [
    'jan', 'fev', 'mar', 'abr', 'mai', 'jun',
    'jul', 'ago', 'set', 'out', 'nov', 'dez'
  ].map(month => ({
    mês: month,
    visitas: monthlyVisits[month] || 0
  }));

  const COLORS = ['#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6'];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <Button
          onClick={onBack}
          variant="outline"
          className="mb-4 text-lg px-6 py-3"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Voltar
        </Button>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Relatórios e Estatísticas</h1>
        <p className="text-lg text-gray-600">Indicadores para gestão e captação de recursos</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-blue-700">
              Total de Pessoas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-800">
              {people.length}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-green-50 border-green-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-green-700">
              Total de Visitas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-800">
              {visits.length}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-purple-50 border-purple-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-purple-700">
              Cidades Atendidas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-800">
              {Object.keys(cityData).length}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-orange-50 border-orange-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-orange-700">
              Este Ano
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-800">
              {visits.filter(v => new Date(v.date).getFullYear() === currentYear).length}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gender Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Distribuição por Sexo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={genderChartData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {genderChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Age Groups */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Distribuição por Idade
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={ageChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="age" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="pessoas" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Cities */}
        <Card>
          <CardHeader>
            <CardTitle>Pessoas por Cidade</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={cityChartData} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="cidade" type="category" width={80} />
                <Tooltip />
                <Bar dataKey="pessoas" fill="#10B981" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Monthly Visits */}
        <Card>
          <CardHeader>
            <CardTitle>Visitas por Mês ({currentYear})</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={monthlyChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mês" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="visitas" stroke="#EF4444" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Summary for donors */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-xl">Resumo para Doadores</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-lg space-y-2">
            <p>
              <strong>Impacto Total:</strong> {people.length} pessoas cadastradas e {visits.length} atendimentos realizados
            </p>
            <p>
              <strong>Alcance Geográfico:</strong> Atendemos {Object.keys(cityData).length} cidades diferentes
            </p>
            <p>
              <strong>Crescimento:</strong> {visits.filter(v => new Date(v.date).getFullYear() === currentYear).length} atendimentos em {currentYear}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Reports;
