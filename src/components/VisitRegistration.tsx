
import React, { useState } from 'react';
import { ArrowLeft, Save, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

interface Person {
  id: number;
  name: string;
  age: string;
  gender: string;
  city: string;
}

interface VisitRegistrationProps {
  onBack: () => void;
  onSave: (visit: any) => void;
  people: Person[];
}

const VisitRegistration = ({ onBack, onSave, people }: VisitRegistrationProps) => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [visitData, setVisitData] = useState({
    serviceType: '',
    description: '',
    notes: ''
  });

  const filteredPeople = people.filter(person =>
    person.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    person.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedPerson || !visitData.serviceType) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, selecione uma pessoa e tipo de atendimento.",
        variant: "destructive"
      });
      return;
    }

    const newVisit = {
      id: Date.now(),
      personId: selectedPerson.id,
      personName: selectedPerson.name,
      personCity: selectedPerson.city,
      personGender: selectedPerson.gender,
      personAge: selectedPerson.age,
      serviceType: visitData.serviceType,
      description: visitData.description,
      notes: visitData.notes,
      date: new Date().toISOString(),
      createdAt: new Date().toISOString()
    };

    onSave(newVisit);
    
    toast({
      title: "Visita registrada!",
      description: `Atendimento para ${selectedPerson.name} foi registrado com sucesso.`,
    });

    // Reset form
    setSelectedPerson(null);
    setSearchTerm('');
    setVisitData({
      serviceType: '',
      description: '',
      notes: ''
    });
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <Button
          onClick={onBack}
          variant="outline"
          className="mb-4 text-lg px-6 py-3"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Voltar
        </Button>
        <h1 className="text-3xl font-bold text-gray-800">Registrar Visita</h1>
      </div>

      <div className="space-y-6">
        {/* Person Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Selecionar Pessoa</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Buscar por nome ou cidade..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 text-lg py-3"
                />
              </div>
              
              {searchTerm && (
                <div className="max-h-60 overflow-y-auto border rounded-lg">
                  {filteredPeople.length > 0 ? (
                    filteredPeople.map((person) => (
                      <div
                        key={person.id}
                        onClick={() => {
                          setSelectedPerson(person);
                          setSearchTerm('');
                        }}
                        className={`p-3 border-b cursor-pointer hover:bg-gray-50 ${
                          selectedPerson?.id === person.id ? 'bg-blue-50' : ''
                        }`}
                      >
                        <div className="font-semibold">{person.name}</div>
                        <div className="text-sm text-gray-600">
                          {person.age} anos • {person.gender} • {person.city}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-3 text-gray-500">Nenhuma pessoa encontrada</div>
                  )}
                </div>
              )}

              {selectedPerson && (
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h3 className="font-semibold text-blue-800">Pessoa Selecionada:</h3>
                  <div className="text-blue-700">
                    <div className="font-medium">{selectedPerson.name}</div>
                    <div className="text-sm">
                      {selectedPerson.age} anos • {selectedPerson.gender} • {selectedPerson.city}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Visit Details */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Detalhes do Atendimento</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="serviceType" className="text-lg font-semibold">
                  Tipo de Atendimento *
                </Label>
                <Select
                  value={visitData.serviceType}
                  onValueChange={(value) => setVisitData(prev => ({ ...prev, serviceType: value }))}
                >
                  <SelectTrigger className="text-lg py-3">
                    <SelectValue placeholder="Selecione o tipo de atendimento" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="consulta-medica">Consulta Médica</SelectItem>
                    <SelectItem value="assistencia-social">Assistência Social</SelectItem>
                    <SelectItem value="entrega-medicamentos">Entrega de Medicamentos</SelectItem>
                    <SelectItem value="apoio-psicologico">Apoio Psicológico</SelectItem>
                    <SelectItem value="fisioterapia">Fisioterapia</SelectItem>
                    <SelectItem value="visita-domiciliar">Visita Domiciliar</SelectItem>
                    <SelectItem value="outros">Outros</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-lg font-semibold">
                  Descrição do Atendimento
                </Label>
                <textarea
                  id="description"
                  value={visitData.description}
                  onChange={(e) => setVisitData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Descreva o atendimento realizado"
                  className="w-full min-h-[120px] p-3 text-lg border border-gray-300 rounded-md resize-vertical"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes" className="text-lg font-semibold">
                  Observações
                </Label>
                <textarea
                  id="notes"
                  value={visitData.notes}
                  onChange={(e) => setVisitData(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Observações adicionais"
                  className="w-full min-h-[80px] p-3 text-lg border border-gray-300 rounded-md resize-vertical"
                />
              </div>

              <Button
                type="submit"
                className="w-full text-lg py-4 bg-green-500 hover:bg-green-600"
                disabled={!selectedPerson}
              >
                <Save className="w-5 h-5 mr-2" />
                Registrar Visita
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VisitRegistration;
