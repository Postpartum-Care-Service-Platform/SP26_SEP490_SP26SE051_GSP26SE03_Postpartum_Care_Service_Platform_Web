type Document = {
  id: string;
  name: string;
  size: string;
  url: string;
};

type UserProfile = {
  id: string;
  name: string;
  avatar: string | null;
  title: string;
  isOnline: boolean;
  email: string;
  phone: string;
  role: string;
  description: string;
  documents?: Document[];
};

export const mockUserProfiles: Record<string, UserProfile> = {
  eleanor: {
    id: 'eleanor',
    name: 'Eleanor Pena',
    avatar: 'https://i.pravatar.cc/150?img=1',
    title: 'Software Engineer',
    isOnline: true,
    email: 'eleanorpena@gmail.com',
    phone: '+1 (555) 123-4567',
    role: 'Marketing Manager',
    description: 'Marketing Manager with 5+ years of experience in digital campaigns, brand strategy, and team leadership.',
    documents: [
      {
        id: 'doc1',
        name: 'Project-Proposal.pdf',
        size: '450 KB',
        url: '#',
      },
      {
        id: 'doc2',
        name: 'Team-Report.pdf',
        size: '320 KB',
        url: '#',
      },
    ],
  },
};

