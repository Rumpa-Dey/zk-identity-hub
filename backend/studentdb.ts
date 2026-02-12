// studentdb.ts

export interface Student {
  wallet: string;
  studentId: string;
  name: string;
  dob: string;        // YYYY-MM-DD
  phone: string;
  email: string;
}

export const studentDB: Record<string, Student> = {
  "B62qmyjHH2FA62ooHfvoyd1npnLtHU4NhGByXCCaUPks98h46QrLob9": {
    wallet: "B62qmyjHH2FA62ooHfvoyd1npnLtHU4NhGByXCCaUPks98h46QrLob9", 
    studentId: "STU001",
    name: "Ananya Sharma",
    dob: "2000-05-10",
    phone: "9876543210",
    email: "ananya@example.com",
  },

  "B62qktjYXuiFBpZt6nsTBhuQJtVF4J1VXjTHiaM9pmFGVB574dzaBaG": {
    wallet: "B62qktjYXuiFBpZt6nsTBhuQJtVF4J1VXjTHiaM9pmFGVB574dzaBaG",
    studentId: "STU002",
    name: "Rahul Verma",
    dob: "2010-03-15",
    phone: "9123456780",
    email: "rahul@example.com",
  },
};

// ✅ Helper function inside same file
export function calculateAge(dob: string): number {
  const birthDate = new Date(dob);
  const today = new Date();

  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }

  return age;
}
