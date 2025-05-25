
export const calculateCurrentAge = (birthYear: string): number => {
  if (!birthYear) return 0;
  const currentYear = new Date().getFullYear();
  const birth = parseInt(birthYear);
  if (isNaN(birth) || birth < 1900 || birth > currentYear) return 0;
  return currentYear - birth;
};

export const getDisplayAge = (person: { birthYear?: string; age?: string }): string => {
  // If we have birthYear, calculate current age
  if (person.birthYear) {
    return calculateCurrentAge(person.birthYear).toString();
  }
  // Fallback to stored age (for backward compatibility)
  return person.age || '0';
};
