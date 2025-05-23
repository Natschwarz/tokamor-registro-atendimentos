
import React, { useState } from 'react';
import { ArrowLeft, Search, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Person {
  id: number;
  name: string;
  age: string;
  gender: string;
  city: string;
  hospitalId: string;
  phone: string;
  address: string;
  notes: string;
  createdAt: string;
}

interface PeopleListProps {
  onBack: () => void;
  people: Person[];
}

const PeopleList = ({ onBack, people }: PeopleListProps) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPeople = people.filter(person =>
    person.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    person.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
    person.hospitalId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <Button
          onClick={onBack}
          variant="outline"
          className="mb-4 text-lg px-6 py-3"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Voltar
        </Button>
        <div className="flex items-center gap-3 mb-4">
          <Users className="w-8 h-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-800">Pessoas Cadastradas</h1>
        </div>
        <p className="text-lg text-gray-600">Total: {people.length} pessoas</p>
      </div>

      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Buscar por nome, cidade ou ID do hospital..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 text-lg py-3"
            />
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {filteredPeople.length > 0 ? (
          filteredPeople.map((person) => (
            <Card key={person.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                      {person.name}
                    </h3>
                    <div className="space-y-1 text-gray-600">
                      <div><strong>Idade:</strong> {person.age} anos</div>
                      <div><strong>Sexo:</strong> {person.gender}</div>
                      <div><strong>Cidade:</strong> {person.city}</div>
                    </div>
                  </div>
                  
                  <div className="space-y-1 text-gray-600">
                    {person.hospitalId && (
                      <div><strong>ID Hospital:</strong> {person.hospitalId}</div>
                    )}
                    {person.phone && (
                      <div><strong>Telefone:</strong> {person.phone}</div>
                    )}
                    {person.address && (
                      <div><strong>Endereço:</strong> {person.address}</div>
                    )}
                  </div>
                  
                  <div>
                    <div className="text-sm text-gray-500 mb-2">
                      Cadastrado em: {new Date(person.createdAt).toLocaleDateString('pt-BR')}
                    </div>
                    {person.notes && (
                      <div className="text-sm">
                        <strong>Observações:</strong>
                        <div className="mt-1 p-2 bg-gray-50 rounded text-gray-700">
                          {person.notes}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="p-8 text-center">
              <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                {searchTerm ? 'Nenhuma pessoa encontrada' : 'Nenhuma pessoa cadastrada'}
              </h3>
              <p className="text-gray-500">
                {searchTerm 
                  ? 'Tente buscar com outros termos'
                  : 'Comece cadastrando uma nova pessoa no sistema'
                }
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default PeopleList;
