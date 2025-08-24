import { AuthProvider } from '@/contexts/AuthContext';
import { ModalProvider } from '@/contexts/ModalContext';
import { SidebarProvider } from '@/contexts/SidebarContext';
import { GetMeApiResponse } from '@/types'; // Import the specific response type
import { ProtectedContent } from './_components/ProtectedContent';
import { Sidebar } from './_components/Sidebar';

// The data fetching logic now returns the full API response.
async function getUserProfile(): Promise<GetMeApiResponse | null> {
  // Mock user data for testing
  const mockUser: GetMeApiResponse = {
    staff: {
      _id: '1',
      username: 'testuser',
      name: 'Test User',
      role: 'admin',
      email: 'test@example.com',
      phone: '+1234567890',
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  };
  
  return mockUser;
}

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  // Call the local function to get the user data object
  const userData = await getUserProfile();
  

  return (
    // Pass the entire userData object to the provider
    <AuthProvider user={userData}>
        <SidebarProvider>
          <div className="flex h-screen overflow-hidden">
            <Sidebar />
            <ModalProvider>
              <ProtectedContent>{children}</ProtectedContent>
            </ModalProvider>
          </div>
        </SidebarProvider>
    </AuthProvider>
  );
}
