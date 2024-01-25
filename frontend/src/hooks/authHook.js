import { useContext } from 'react';
import AuthContext from '../context/context.js';

const useAuth = () => useContext(AuthContext);

export default useAuth;
