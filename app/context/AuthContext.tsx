import { createContext, useEffect, useState } from "react";


interface Admin{
  email: string,
  firstName: string,
  lastName: string,
  isActive: boolean
  role: string
}
interface AuthContextType {
  token: string | null;
  admin: Admin | null;
  setAuthData: (token: string, admin: Admin) => void;
  clearAuthData: () => void;
}
  


export const AuthContext = createContext<AuthContextType>({
  token: null,
  admin: null,
  setAuthData: () => {},
  clearAuthData: () => {}
})



export const AuthProvider =({children}: {children: React.ReactNode})=>
{
  const [admin,setAdmin] = useState<Admin | null>(null);
  const [token,setToken] = useState<string | null>(null);
  const isAuthenticated = Boolean(token);
  
  const setAuthData = (token:string, admin:Admin)=>
  {
    setToken(token);
    setAdmin(admin);
    localStorage.setItem('sudo_auth_token', token);
    localStorage.setItem('sudo_admin_data', JSON.stringify(admin));
  }

  const clearAuthData =  ()=>
  {
    setToken(null);
    setAdmin(null);
    localStorage.removeItem('sudo_auth_token');
    localStorage.removeItem('sudo_admin_data');
  }

  useEffect(()=>{
    const storedToken = localStorage.getItem('sudo_auth_token');
    const storedAdmin = localStorage.getItem('sudo_admin_data');
    if(storedToken && storedAdmin)
    {
      setToken(storedToken);
      setAdmin(JSON.parse(storedAdmin));
    }
  }, [])
  return(
<AuthContext.Provider value={token && admin ? {
  token,
  admin,
  setAuthData,
  clearAuthData
} : {
  token: null,
  admin: null,
  setAuthData,
  clearAuthData
}}>
  {children}
</AuthContext.Provider>
  )
}
