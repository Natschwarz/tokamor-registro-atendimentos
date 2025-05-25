import React, { useState } from 'react';
import { ArrowLeft, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

interface PersonRegistrationProps {
  onBack: () => void;
  onSave: (person: any) => void;
}

const PersonRegistration = ({
  onBack,
  onSave
}: PersonRegistrationProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    birthYear: '',
    gender: '',
    city: '',
    hospitalId: '',
    phone: '',
    address: '',
    notes: ''
  });

  const cities = [
    'São Paulo',
    'Rio de Janeiro',
    'Belo Horizonte',
    'Salvador',
    'Brasília',
    'Fortaleza',
    'Curitiba',
    'Recife',
    'Porto Alegre',
    'Manaus',
    'Belém',
    'Goiânia',
    'Guarulhos',
    'Campinas',
    'São Luís',
    'São Gonçalo',
    'Maceió',
    'Duque de Caxias',
    'Campo Grande',
    'Natal',
    'Teresina',
    'São Bernardo do Campo',
    'Nova Iguaçu',
    'João Pessoa',
    'Santo André',
    'São José dos Campos',
    'Jaboatão dos Guararapes',
    'Osasco',
    'Ribeirão Preto',
    'Uberlândia',
    'Contagem',
    'Sorocaba',
    'Aracaju',
    'Feira de Santana',
    'Cuiabá',
    'Joinville',
    'Juiz de Fora',
    'Londrina',
    'Aparecida de Goiânia',
    'Niterói',
    'Ananindeua',
    'Porto Velho',
    'Serra',
    'Caxias do Sul',
    'Vila Velha',
    'Florianópolis',
    'Macapá',
    'Campos dos Goytacazes',
    'São José do Rio Preto',
    'Mauá',
    'Carapicuíba',
    'Olinda',
    'Campina Grande',
    'São José dos Pinhais',
    'Mogi das Cruzes',
    'Diadema',
    'Betim',
    'Jundiaí',
    'Piracicaba',
    'Cariacica',
    'Bauru',
    'Montes Claros'
  ];

  const calculateAge = (birthYear: string): number => {
    if (!birthYear) return 0;
    const currentYear = new Date().getFullYear();
    const birth = parseInt(birthYear);
    return currentYear - birth;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.birthYear || !formData.gender || !formData.city) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    // Validate birth year
    const currentYear = new Date().getFullYear();
    const birth = parseInt(formData.birthYear);
    if (birth < 1900 || birth > currentYear) {
      toast({
        title: "Ano inválido",
        description: "Por favor, digite um ano de nascimento válido.",
        variant: "destructive"
      });
      return;
    }
    const newPerson = {
      ...formData,
      age: calculateAge(formData.birthYear).toString(),
      // Keep age for compatibility
      id: Date.now(),
      createdAt: new Date().toISOString()
    };
    onSave(newPerson);
    toast({
      title: "Pessoa cadastrada!",
      description: `${formData.name} foi cadastrado(a) com sucesso.`
    });

    // Reset form
    setFormData({
      name: '',
      birthYear: '',
      gender: '',
      city: '',
      hospitalId: '',
      phone: '',
      address: '',
      notes: ''
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <Button onClick={onBack} variant="outline" className="mb-4 text-lg px-6 py-3">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Voltar
        </Button>
        <h1 className="text-3xl font-bold text-gray-800">Cadastrar Nova Pessoa</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Informações Pessoais</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-lg font-semibold">
                  Nome Completo *
                </Label>
                <Input id="name" value={formData.name} onChange={e => handleInputChange('name', e.target.value)} placeholder="Digite o nome completo" className="text-lg py-3" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="birthYear" className="text-lg font-semibold">
                  Ano de Nascimento *
                </Label>
                <Input id="birthYear" type="number" value={formData.birthYear} onChange={e => handleInputChange('birthYear', e.target.value)} placeholder="Ex: 1960" className="text-lg py-3" min="1900" max={new Date().getFullYear()} required />
                {formData.birthYear && <p className="text-sm text-gray-600">
                    Idade atual: {calculateAge(formData.birthYear)} anos
                  </p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="gender" className="text-lg font-semibold">Gênero *</Label>
                <Select value={formData.gender} onValueChange={value => handleInputChange('gender', value)}>
                  <SelectTrigger className="text-lg py-3">
                    <SelectValue placeholder="Selecione o sexo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="masculino">Masculino</SelectItem>
                    <SelectItem value="feminino">Feminino</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="city" className="text-lg font-semibold">
                  Cidade *
                </Label>
                <Select value={formData.city} onValueChange={value => handleInputChange('city', value)}>
                  <SelectTrigger className="text-lg py-3">
                    <SelectValue placeholder="Selecione a cidade" />
                  </SelectTrigger>
                  <SelectContent className="max-h-60">
                    {cities.map((city) => (
                      <SelectItem key={city} value={city}>
                        {city}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="hospitalId" className="text-lg font-semibold">
                  ID do Hospital
                </Label>
                <Input id="hospitalId" value={formData.hospitalId} onChange={e => handleInputChange('hospitalId', e.target.value)} placeholder="Digite o ID do hospital" className="text-lg py-3" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-lg font-semibold">
                  Telefone
                </Label>
                <Input id="phone" value={formData.phone} onChange={e => handleInputChange('phone', e.target.value)} placeholder="Digite o telefone" className="text-lg py-3" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address" className="text-lg font-semibold">
                Endereço
              </Label>
              <Input id="address" value={formData.address} onChange={e => handleInputChange('address', e.target.value)} placeholder="Digite o endereço completo" className="text-lg py-3" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes" className="text-lg font-semibold">
                Observações
              </Label>
              <textarea id="notes" value={formData.notes} onChange={e => handleInputChange('notes', e.target.value)} placeholder="Observações adicionais" className="w-full min-h-[100px] p-3 text-lg border border-gray-300 rounded-md resize-vertical" />
            </div>

            <Button type="submit" className="w-full text-lg py-4 bg-blue-500 hover:bg-blue-600">
              <Save className="w-5 h-5 mr-2" />
              Salvar Cadastro
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default PersonRegistration;
