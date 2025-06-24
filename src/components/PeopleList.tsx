
import React, { useState, useRef } from 'react';
import { ArrowLeft, Search, Users, Upload, FileSpreadsheet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getDisplayAge } from '@/utils/ageCalculator';
import { useToast } from '@/hooks/use-toast';
import * as XLSX from 'xlsx';

interface Person {
  id: number;
  name: string;
  age: string;
  birthYear?: string;
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
  onImportPeople?: (people: Person[]) => void;
}

const PeopleList = ({ onBack, people, onImportPeople }: PeopleListProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isImporting, setIsImporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleImportExcel = () => {
    fileInputRef.current?.click();
  };

  const processExcelFile = (file: File) => {
    setIsImporting(true);
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        const importedPeople: Person[] = [];
        const errors: string[] = [];

        jsonData.forEach((row: any, index) => {
          const rowNumber = index + 2; // +2 because Excel starts at 1 and we have header
          
          // Validate required fields
          if (!row.Nome || !row['Ano de Nascimento'] || !row.Sexo || !row.Cidade) {
            errors.push(`Linha ${rowNumber}: Campos obrigatórios faltando (Nome, Ano de Nascimento, Sexo, Cidade)`);
            return;
          }

          // Validate birth year
          const birthYear = parseInt(row['Ano de Nascimento']);
          const currentYear = new Date().getFullYear();
          if (isNaN(birthYear) || birthYear < 1900 || birthYear > currentYear) {
            errors.push(`Linha ${rowNumber}: Ano de nascimento inválido`);
            return;
          }

          // Validate gender
          const gender = row.Sexo?.toLowerCase();
          if (gender !== 'masculino' && gender !== 'feminino') {
            errors.push(`Linha ${rowNumber}: Sexo deve ser 'Masculino' ou 'Feminino'`);
            return;
          }

          const person: Person = {
            id: Date.now() + Math.random(), // Ensure unique ID
            name: row.Nome,
            birthYear: birthYear.toString(),
            age: (currentYear - birthYear).toString(),
            gender: gender,
            city: row.Cidade || '',
            hospitalId: row['ID Hospital'] || '',
            phone: row.Telefone || '',
            address: row.Endereço || '',
            notes: row.Observações || '',
            createdAt: new Date().toISOString()
          };

          importedPeople.push(person);
        });

        if (errors.length > 0) {
          toast({
            title: "Erros na importação",
            description: `${errors.length} erro(s) encontrado(s). Verifique o arquivo.`,
            variant: "destructive"
          });
          console.error('Import errors:', errors);
          setIsImporting(false);
          return;
        }

        if (importedPeople.length === 0) {
          toast({
            title: "Nenhum dado válido",
            description: "Não foram encontrados dados válidos para importar.",
            variant: "destructive"
          });
          setIsImporting(false);
          return;
        }

        // Import successful
        if (onImportPeople) {
          onImportPeople(importedPeople);
        }

        toast({
          title: "Importação concluída!",
          description: `${importedPeople.length} pessoa(s) importada(s) com sucesso.`
        });

      } catch (error) {
        toast({
          title: "Erro na importação",
          description: "Erro ao processar o arquivo Excel. Verifique o formato.",
          variant: "destructive"
        });
        console.error('Excel import error:', error);
      } finally {
        setIsImporting(false);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
    };

    reader.readAsBinaryString(file);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
        toast({
          title: "Formato inválido",
          description: "Por favor, selecione um arquivo Excel (.xlsx ou .xls).",
          variant: "destructive"
        });
        return;
      }
      processExcelFile(file);
    }
  };

  const downloadTemplate = () => {
    // Create template data
    const templateData = [
      {
        'Nome': 'João Silva',
        'Ano de Nascimento': 1980,
        'Sexo': 'Masculino',
        'Cidade': 'São Paulo',
        'ID Hospital': 'H001',
        'Telefone': '(11) 99999-9999',
        'Endereço': 'Rua das Flores, 123',
        'Observações': 'Exemplo de observação'
      }
    ];

    // Create workbook
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(templateData);

    // Set column widths
    const colWidths = [
      { wch: 20 }, // Nome
      { wch: 18 }, // Ano de Nascimento
      { wch: 10 }, // Sexo
      { wch: 15 }, // Cidade
      { wch: 12 }, // ID Hospital
      { wch: 15 }, // Telefone
      { wch: 25 }, // Endereço
      { wch: 25 }  // Observações
    ];
    ws['!cols'] = colWidths;

    XLSX.utils.book_append_sheet(wb, ws, 'Modelo');
    XLSX.writeFile(wb, 'modelo-cadastro-pessoas.xlsx');

    toast({
      title: "Template baixado!",
      description: "Use este arquivo como modelo para importar pessoas."
    });
  };

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
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Buscar por nome, cidade ou ID do hospital..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 text-lg py-3"
              />
            </div>
            <div className="flex gap-2">
              <Button
                onClick={downloadTemplate}
                variant="outline"
                className="flex items-center gap-2"
              >
                <FileSpreadsheet className="w-4 h-4" />
                Baixar Modelo
              </Button>
              <Button
                onClick={handleImportExcel}
                disabled={isImporting}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
              >
                <Upload className="w-4 h-4" />
                {isImporting ? 'Importando...' : 'Importar Excel'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <input
        ref={fileInputRef}
        type="file"
        accept=".xlsx,.xls"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />

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
                      <div><strong>Idade:</strong> {getDisplayAge(person)} anos</div>
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
