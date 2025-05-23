
import React, { useState, useEffect } from 'react';
import Dashboard from '@/components/Dashboard';
import PersonRegistration from '@/components/PersonRegistration';
import VisitRegistration from '@/components/VisitRegistration';
import PeopleList from '@/components/PeopleList';
import Reports from '@/components/Reports';

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

interface Visit {
  id: number;
  personId: number;
  personName: string;
  personCity: string;
  personGender: string;
  personAge: string;
  serviceType: string;
  description: string;
  notes: string;
  date: string;
  createdAt: string;
}

const Index = () => {
  const [currentSection, setCurrentSection] = useState('dashboard');
  const [people, setPeople] = useState<Person[]>([]);
  const [visits, setVisits] = useState<Visit[]>([]);

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedPeople = localStorage.getItem('ngo-people');
    const savedVisits = localStorage.getItem('ngo-visits');
    
    if (savedPeople) {
      setPeople(JSON.parse(savedPeople));
    }
    
    if (savedVisits) {
      setVisits(JSON.parse(savedVisits));
    }
  }, []);

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem('ngo-people', JSON.stringify(people));
  }, [people]);

  useEffect(() => {
    localStorage.setItem('ngo-visits', JSON.stringify(visits));
  }, [visits]);

  const handleSavePerson = (person: Person) => {
    setPeople(prev => [...prev, person]);
  };

  const handleSaveVisit = (visit: Visit) => {
    setVisits(prev => [...prev, visit]);
  };

  const getStats = () => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    const thisMonthVisits = visits.filter(visit => {
      const visitDate = new Date(visit.date);
      return visitDate.getMonth() === currentMonth && visitDate.getFullYear() === currentYear;
    }).length;

    return {
      totalPersons: people.length,
      totalVisits: visits.length,
      thisMonth: thisMonthVisits
    };
  };

  const renderCurrentSection = () => {
    switch (currentSection) {
      case 'register':
        return (
          <PersonRegistration
            onBack={() => setCurrentSection('dashboard')}
            onSave={handleSavePerson}
          />
        );
      case 'visit':
        return (
          <VisitRegistration
            onBack={() => setCurrentSection('dashboard')}
            onSave={handleSaveVisit}
            people={people}
          />
        );
      case 'people':
        return (
          <PeopleList
            onBack={() => setCurrentSection('dashboard')}
            people={people}
          />
        );
      case 'reports':
        return (
          <Reports
            onBack={() => setCurrentSection('dashboard')}
            visits={visits}
            people={people}
          />
        );
      default:
        return (
          <Dashboard
            onNavigate={setCurrentSection}
            stats={getStats()}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <div className="container mx-auto px-4 py-8">
        {renderCurrentSection()}
      </div>
    </div>
  );
};

export default Index;
