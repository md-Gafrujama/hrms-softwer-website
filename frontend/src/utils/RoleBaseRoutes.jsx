import React from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import { Navigate } from 'react-router-dom'

const RoleBaseRoutes = ({children, requiredRole}) => {
    const {user, loading} = useAuth()

    if(loading) {
        return <div>Loading ...</div>
    }

    if(!requiredRole.includes(user.role)) {
        alert("ok");
       <Navigate to="/unauthorized"/> 
    }
  
    return user ? children : <Navigate to="/login" />
}

export default RoleBaseRoutes